from fastapi.testclient import TestClient

import api
from approval import ApprovalStore


def _task(task_id: str) -> dict:
    return {
        "id": task_id,
        "prompt": "x",
        "model": "gpt-4.1",
        "max_turns": 5,
        "status": "awaiting_approval",
        "output_text": "",
        "pending_approvals": [],
        "created_at": "2026-01-01T00:00:00+00:00",
        "updated_at": "2026-01-01T00:00:00+00:00",
        "last_response_id": None,
    }


def test_create_and_list_tasks(monkeypatch) -> None:
    api.TASKS.clear()
    api.approval_store = ApprovalStore()

    def fake_run(task: dict) -> dict:
        task["status"] = "completed"
        task["output_text"] = "ok"
        return task

    monkeypatch.setattr(api, "_run_task_or_http_error", fake_run)

    client = TestClient(api.app)
    created = client.post("/tasks", json={"prompt": "test"})
    assert created.status_code == 200

    listed = client.get("/tasks")
    assert listed.status_code == 200
    body = listed.json()
    assert body["count"] == 1


def test_resume_rejects_pending_approval() -> None:
    api.TASKS.clear()
    api.approval_store = ApprovalStore()

    task = _task("task-1")
    api.TASKS[task["id"]] = task
    api.approval_store.check_or_request(task["id"], "local_write_file", {"path": "x.txt", "content": "x"})

    client = TestClient(api.app)
    resp = client.post(f"/tasks/{task['id']}/resume")
    assert resp.status_code == 409


def test_approval_cannot_be_changed_after_decision() -> None:
    api.TASKS.clear()
    api.approval_store = ApprovalStore()

    task = _task("task-2")
    api.TASKS[task["id"]] = task
    pending = api.approval_store.check_or_request(task["id"], "local_write_file", {"path": "x.txt", "content": "x"})
    assert pending is not None

    client = TestClient(api.app)
    first = client.post(f"/approvals/{pending['id']}", json={"decision": "approve"})
    assert first.status_code == 200

    second = client.post(f"/approvals/{pending['id']}", json={"decision": "deny"})
    assert second.status_code == 409
