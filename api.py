from __future__ import annotations

import uuid
from datetime import UTC, datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from agent import AgentRunner
from approval import ApprovalStore


class TaskCreateRequest(BaseModel):
    prompt: str = Field(min_length=1)
    model: str = "gpt-4.1"
    max_turns: int = Field(default=12, ge=1, le=50)


class DecisionRequest(BaseModel):
    decision: str


app = FastAPI(title="Agent Mode API", version="0.2.0")
approval_store = ApprovalStore()

# In-memory task store for MVP.
TASKS: dict[str, dict] = {}


def _now() -> str:
    return datetime.now(UTC).isoformat()


def _run_task(task: dict) -> dict:
    runner = AgentRunner(
        model=task["model"],
        max_turns=task["max_turns"],
        approval_check=lambda tool_name, args: approval_store.check_or_request(task["id"], tool_name, args),
    )
    result = runner.run_detailed(task["prompt"])

    task["updated_at"] = _now()
    task["output_text"] = result["output_text"]
    task["last_response_id"] = result.get("response_id")
    task["pending_approvals"] = result.get("pending_approvals", [])

    if approval_store.has_pending(task["id"]):
        task["status"] = "awaiting_approval"
    elif approval_store.has_denied(task["id"]):
        task["status"] = "blocked"
    else:
        task["status"] = result["status"]

    return task


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/tasks")
def create_task(req: TaskCreateRequest) -> dict:
    task_id = str(uuid.uuid4())
    task = {
        "id": task_id,
        "prompt": req.prompt,
        "model": req.model,
        "max_turns": req.max_turns,
        "status": "running",
        "output_text": "",
        "pending_approvals": [],
        "created_at": _now(),
        "updated_at": _now(),
        "last_response_id": None,
    }
    TASKS[task_id] = task
    return _run_task(task)


@app.get("/tasks/{task_id}")
def get_task(task_id: str) -> dict:
    task = TASKS.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    data = dict(task)
    data["approvals"] = approval_store.list_for_task(task_id)
    return data


@app.get("/tasks/{task_id}/approvals")
def list_task_approvals(task_id: str) -> dict:
    task = TASKS.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"task_id": task_id, "approvals": approval_store.list_for_task(task_id)}


@app.post("/approvals/{approval_id}")
def decide_approval(approval_id: str, req: DecisionRequest) -> dict:
    try:
        return approval_store.decide(approval_id, req.decision)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/tasks/{task_id}/resume")
def resume_task(task_id: str) -> dict:
    task = TASKS.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task["status"] = "running"
    task["updated_at"] = _now()
    return _run_task(task)
