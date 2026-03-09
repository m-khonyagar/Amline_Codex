from pathlib import Path

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


def _reset_state() -> None:
    api.TASKS.clear()
    api.CHAT_SESSIONS.clear()
    api.UPLOADS.clear()
    api.approval_store = ApprovalStore()


def test_create_and_list_tasks(monkeypatch) -> None:
    _reset_state()

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
    _reset_state()

    task = _task("task-1")
    api.TASKS[task["id"]] = task
    api.approval_store.check_or_request(task["id"], "local_write_file", {"path": "x.txt", "content": "x"})

    client = TestClient(api.app)
    resp = client.post(f"/tasks/{task['id']}/resume")
    assert resp.status_code == 409


def test_approval_cannot_be_changed_after_decision() -> None:
    _reset_state()

    task = _task("task-2")
    api.TASKS[task["id"]] = task
    pending = api.approval_store.check_or_request(task["id"], "local_write_file", {"path": "x.txt", "content": "x"})
    assert pending is not None

    client = TestClient(api.app)
    first = client.post(f"/approvals/{pending['id']}", json={"decision": "approve"})
    assert first.status_code == 200

    second = client.post(f"/approvals/{pending['id']}", json={"decision": "deny"})
    assert second.status_code == 409


def test_create_chat_session_and_message_in_agent_mode(monkeypatch) -> None:
    _reset_state()

    def fake_run(task: dict) -> dict:
        task["status"] = "completed"
        task["output_text"] = "پاسخ تستی عامل"
        return task

    monkeypatch.setattr(api, "_run_task_or_http_error", fake_run)

    client = TestClient(api.app)
    session = client.post("/chat/sessions", json={})
    assert session.status_code == 200
    session_id = session.json()["id"]

    sent = client.post(
        f"/chat/sessions/{session_id}/messages",
        json={"content": "یک پیام", "mode": "agent", "model": "gpt-4.1", "max_turns": 3, "attachment_ids": []},
    )
    assert sent.status_code == 200
    body = sent.json()
    assert body["assistant_message"]["meta"]["mode"] == "agent"
    assert "task_id" in body["assistant_message"]["meta"]


def test_upload_file_and_use_in_chat(monkeypatch, tmp_path: Path) -> None:
    _reset_state()

    monkeypatch.setattr(api, "UPLOADS_DIR", tmp_path)

    def fake_run(task: dict) -> dict:
        task["status"] = "completed"
        task["output_text"] = "ضمیمه دریافت شد"
        return task

    monkeypatch.setattr(api, "_run_task_or_http_error", fake_run)

    client = TestClient(api.app)

    uploaded = client.post(
        "/uploads",
        files=[("files", ("sample.txt", b"hello upload", "text/plain"))],
    )
    assert uploaded.status_code == 200
    file_id = uploaded.json()["files"][0]["id"]

    session = client.post("/chat/sessions", json={})
    session_id = session.json()["id"]

    sent = client.post(
        f"/chat/sessions/{session_id}/messages",
        json={
            "content": "با ضمیمه پاسخ بده",
            "mode": "agent",
            "model": "gpt-4.1",
            "max_turns": 3,
            "attachment_ids": [file_id],
        },
    )
    assert sent.status_code == 200
    assert sent.json()["assistant_message"]["content"] == "ضمیمه دریافت شد"
