from __future__ import annotations

import os
import uuid
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI, OpenAIError
from pydantic import BaseModel, Field

from agent import AgentRunner
from approval import ApprovalStore


class TaskCreateRequest(BaseModel):
    prompt: str = Field(min_length=1)
    model: str = "gpt-4.1"
    max_turns: int = Field(default=12, ge=1, le=50)


class DecisionRequest(BaseModel):
    decision: Literal["approve", "deny"]


class ChatSessionCreateRequest(BaseModel):
    title: str | None = None


class ChatMessageCreateRequest(BaseModel):
    content: str = Field(min_length=1)
    model: str = "gpt-4.1"
    max_turns: int = Field(default=12, ge=1, le=50)
    mode: Literal["agent", "chat"] = "agent"
    attachment_ids: list[str] = Field(default_factory=list)


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR / "web"
WORKSPACE_ROOT = Path(os.environ.get("WORKSPACE_ROOT", str(BASE_DIR / "workspace"))).resolve()
UPLOADS_DIR = WORKSPACE_ROOT / "uploads"
UPLOAD_ALIAS_DIR = WORKSPACE_ROOT / "attachments"

WEB_DIR.mkdir(parents=True, exist_ok=True)
WORKSPACE_ROOT.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_ALIAS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Agent Mode API", version="0.8.0")
app.mount("/static", StaticFiles(directory=str(WEB_DIR)), name="static")

approval_store = ApprovalStore()

# In-memory stores for MVP
TASKS: dict[str, dict] = {}
CHAT_SESSIONS: dict[str, dict] = {}
UPLOADS: dict[str, dict] = {}

TERMINAL_STATUSES = {"completed", "blocked", "failed"}


def _now() -> str:
    return datetime.now(UTC).isoformat()


def _set_task_status(task: dict, status: str, output_text: str | None = None) -> None:
    task["status"] = status
    task["updated_at"] = _now()
    if output_text is not None:
        task["output_text"] = output_text


def _new_task(prompt: str, model: str, max_turns: int) -> dict:
    task_id = str(uuid.uuid4())
    return {
        "id": task_id,
        "prompt": prompt,
        "model": model,
        "max_turns": max_turns,
        "status": "running",
        "output_text": "",
        "pending_approvals": [],
        "created_at": _now(),
        "updated_at": _now(),
        "last_response_id": None,
    }


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


def _run_task_or_http_error(task: dict) -> dict:
    try:
        return _run_task(task)
    except OpenAIError as exc:
        _set_task_status(task, "failed", f"OpenAI client error: {exc}")
        raise HTTPException(status_code=400, detail=f"OpenAI client error: {exc}") from exc
    except Exception as exc:  # noqa: BLE001
        _set_task_status(task, "failed", f"Task execution failed: {exc}")
        raise HTTPException(status_code=500, detail=f"Task execution failed: {exc}") from exc


def _chat_text_reply(messages: list[dict], model: str) -> str:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    prompt_messages = []
    for msg in messages:
        if msg["role"] not in {"user", "assistant"}:
            continue
        prompt_messages.append({"role": msg["role"], "content": msg["content"]})

    response = client.responses.create(model=model, input=prompt_messages)
    return response.output_text or "پاسخی تولید نشد."


def _session_summary(session: dict) -> dict:
    return {
        "id": session["id"],
        "title": session["title"],
        "created_at": session["created_at"],
        "updated_at": session["updated_at"],
        "message_count": len(session["messages"]),
        "last_mode": session.get("last_mode", "agent"),
    }


def _preview_text(data: bytes, filename: str, content_type: str | None) -> str | None:
    text_like = {".txt", ".md", ".json", ".csv", ".py", ".log"}
    suffix = Path(filename).suffix.lower()
    if suffix not in text_like and not (content_type or "").startswith("text/"):
        return None
    try:
        decoded = data.decode("utf-8")
    except UnicodeDecodeError:
        return None
    preview = decoded[:1600].strip()
    return preview or None


def _build_agent_prompt(content: str, attachments: list[dict]) -> str:
    if not attachments:
        return content

    lines = [
        content,
        "",
        "فایل های ضمیمه داخل WORKSPACE_ROOT در این مسیرها قابل خواندن هستند:",
    ]
    for a in attachments:
        lines.append(f"- {a['filename']} -> {a['workspace_path']}")

    lines.append("")
    lines.append("برای خواندن محتوا از local_read_file با path های بالا استفاده کن.")

    previews = [a for a in attachments if a.get("preview_text")]
    if previews:
        lines.append("")
        lines.append("پیش نمایش اولیه برخی فایل های متنی:")
        for a in previews:
            lines.append(f"--- {a['workspace_path']} ---")
            lines.append(a["preview_text"])

    return "\n".join(lines)


@app.get("/", include_in_schema=False)
def frontend_index() -> FileResponse:
    index_file = WEB_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Frontend not found")
    return FileResponse(index_file)


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/uploads")
async def upload_files(files: list[UploadFile] = File(...)) -> dict:
    saved = []
    for file in files:
        upload_id = str(uuid.uuid4())
        safe_name = Path(file.filename or "file.bin").name

        raw_name = f"{upload_id}_{safe_name}"
        raw_path = UPLOADS_DIR / raw_name

        alias_dir = UPLOAD_ALIAS_DIR / upload_id
        alias_dir.mkdir(parents=True, exist_ok=True)
        alias_path = alias_dir / safe_name

        data = await file.read()
        raw_path.write_bytes(data)
        alias_path.write_bytes(data)

        meta = {
            "id": upload_id,
            "filename": safe_name,
            "content_type": file.content_type,
            "size": len(data),
            "created_at": _now(),
            "path": str(raw_path),
            "workspace_path": str(alias_path.relative_to(WORKSPACE_ROOT)).replace("\\", "/"),
            "preview_text": _preview_text(data, safe_name, file.content_type),
        }
        UPLOADS[upload_id] = meta
        saved.append(meta)
    return {"files": saved}


@app.get("/uploads")
def list_uploads() -> dict:
    items = sorted(UPLOADS.values(), key=lambda x: x["created_at"], reverse=True)
    return {"files": items, "count": len(items)}


@app.get("/uploads/{upload_id}/download", include_in_schema=False)
def download_upload(upload_id: str) -> FileResponse:
    item = UPLOADS.get(upload_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Upload not found")
    return FileResponse(item["path"], filename=item["filename"])


@app.get("/tasks")
def list_tasks() -> dict:
    data = sorted(TASKS.values(), key=lambda t: t["created_at"], reverse=True)
    return {"tasks": data, "count": len(data)}


@app.post("/tasks")
def create_task(req: TaskCreateRequest) -> dict:
    task = _new_task(req.prompt, req.model, req.max_turns)
    TASKS[task["id"]] = task
    return _run_task_or_http_error(task)


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


@app.get("/approvals/pending")
def list_pending_approvals() -> dict:
    pending = approval_store.list_pending()
    return {"approvals": pending, "count": len(pending)}


@app.post("/approvals/{approval_id}")
def decide_approval(approval_id: str, req: DecisionRequest) -> dict:
    try:
        return approval_store.decide(approval_id, req.decision)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@app.post("/tasks/{task_id}/resume")
def resume_task(task_id: str) -> dict:
    task = TASKS.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] in TERMINAL_STATUSES:
        raise HTTPException(status_code=409, detail=f"Task is already terminal: {task['status']}")

    if approval_store.has_pending(task_id):
        raise HTTPException(status_code=409, detail="Task has pending approvals")

    if approval_store.has_denied(task_id):
        _set_task_status(task, "blocked")
        raise HTTPException(status_code=409, detail="Task has denied approvals")

    _set_task_status(task, "running")
    return _run_task_or_http_error(task)


@app.get("/chat/sessions")
def list_chat_sessions() -> dict:
    sessions = sorted(CHAT_SESSIONS.values(), key=lambda s: s["updated_at"], reverse=True)
    return {"sessions": [_session_summary(s) for s in sessions], "count": len(sessions)}


@app.post("/chat/sessions")
def create_chat_session(req: ChatSessionCreateRequest) -> dict:
    session_id = str(uuid.uuid4())
    session = {
        "id": session_id,
        "title": (req.title or "گفتگوی جدید").strip() or "گفتگوی جدید",
        "created_at": _now(),
        "updated_at": _now(),
        "messages": [],
        "last_mode": "agent",
    }
    CHAT_SESSIONS[session_id] = session
    return session


@app.get("/chat/sessions/{session_id}")
def get_chat_session(session_id: str) -> dict:
    session = CHAT_SESSIONS.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.post("/chat/sessions/{session_id}/messages")
def create_chat_message(session_id: str, req: ChatMessageCreateRequest) -> dict:
    session = CHAT_SESSIONS.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    attachments = []
    for aid in req.attachment_ids:
        meta = UPLOADS.get(aid)
        if meta is None:
            raise HTTPException(status_code=404, detail=f"Attachment not found: {aid}")
        attachments.append(meta)

    user_msg = {
        "id": str(uuid.uuid4()),
        "role": "user",
        "content": req.content,
        "attachments": attachments,
        "created_at": _now(),
    }
    session["messages"].append(user_msg)

    if session["title"] == "گفتگوی جدید":
        session["title"] = req.content.strip()[:36] or "گفتگوی جدید"

    assistant_text = ""

    if req.mode == "agent":
        task_prompt = _build_agent_prompt(req.content, attachments)
        task = _new_task(task_prompt, req.model, req.max_turns)
        TASKS[task["id"]] = task
        task = _run_task_or_http_error(task)
        assistant_text = task.get("output_text") or "پاسخ خالی بود."
        assistant_meta = {
            "mode": "agent",
            "task_id": task["id"],
            "task_status": task["status"],
            "pending_approvals": task.get("pending_approvals", []),
        }
    else:
        try:
            assistant_text = _chat_text_reply(session["messages"], req.model)
        except OpenAIError as exc:
            raise HTTPException(status_code=400, detail=f"OpenAI client error: {exc}") from exc
        assistant_meta = {"mode": "chat"}

    assistant_msg = {
        "id": str(uuid.uuid4()),
        "role": "assistant",
        "content": assistant_text,
        "meta": assistant_meta,
        "created_at": _now(),
    }

    session["messages"].append(assistant_msg)
    session["updated_at"] = _now()
    session["last_mode"] = req.mode

    return {"session": session, "assistant_message": assistant_msg}
