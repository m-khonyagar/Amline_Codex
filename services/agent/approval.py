from __future__ import annotations

import hashlib
import json
import uuid
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from typing import Any


@dataclass
class ApprovalRequest:
    id: str
    task_id: str
    tool_name: str
    args: dict[str, Any]
    signature: str
    status: str
    created_at: str
    decided_at: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class ApprovalStore:
    def __init__(self, sensitive_tools: set[str] | None = None) -> None:
        self.sensitive_tools = sensitive_tools or {
            "browser_click",
            "local_write_file",
            "local_run_python_script",
        }
        self._requests: dict[str, ApprovalRequest] = {}
        self._task_signature_to_request: dict[tuple[str, str], str] = {}

    def _now(self) -> str:
        return datetime.now(UTC).isoformat()

    def _signature(self, tool_name: str, args: dict[str, Any]) -> str:
        payload = json.dumps({"tool": tool_name, "args": args}, sort_keys=True, ensure_ascii=False)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def check_or_request(self, task_id: str, tool_name: str, args: dict[str, Any]) -> dict[str, Any] | None:
        if tool_name not in self.sensitive_tools:
            return None

        sig = self._signature(tool_name, args)
        key = (task_id, sig)
        existing_id = self._task_signature_to_request.get(key)

        if existing_id is not None:
            existing = self._requests[existing_id]
            if existing.status == "approved":
                return None
            return existing.to_dict()

        req = ApprovalRequest(
            id=str(uuid.uuid4()),
            task_id=task_id,
            tool_name=tool_name,
            args=args,
            signature=sig,
            status="pending",
            created_at=self._now(),
        )
        self._requests[req.id] = req
        self._task_signature_to_request[key] = req.id
        return req.to_dict()

    def decide(self, approval_id: str, decision: str) -> dict[str, Any]:
        if approval_id not in self._requests:
            raise KeyError(f"Approval not found: {approval_id}")

        if decision not in {"approve", "deny"}:
            raise ValueError("decision must be approve|deny")

        req = self._requests[approval_id]
        if req.status != "pending":
            raise ValueError(f"approval is already {req.status}")

        req.status = "approved" if decision == "approve" else "denied"
        req.decided_at = self._now()
        return req.to_dict()

    def list_for_task(self, task_id: str) -> list[dict[str, Any]]:
        data = [r.to_dict() for r in self._requests.values() if r.task_id == task_id]
        data.sort(key=lambda x: x["created_at"])
        return data

    def list_pending(self) -> list[dict[str, Any]]:
        data = [r.to_dict() for r in self._requests.values() if r.status == "pending"]
        data.sort(key=lambda x: x["created_at"])
        return data

    def has_pending(self, task_id: str) -> bool:
        return any(r.task_id == task_id and r.status == "pending" for r in self._requests.values())

    def has_denied(self, task_id: str) -> bool:
        return any(r.task_id == task_id and r.status == "denied" for r in self._requests.values())
