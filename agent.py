from __future__ import annotations

import json
import os
from typing import Any, Callable

from dotenv import load_dotenv
from openai import OpenAI

from browser_tool import BrowserTool
from local_bridge import LocalBridge
from policy import Policy
from tool_registry import ToolRegistry

ApprovalCheck = Callable[[str, dict[str, Any]], dict[str, Any] | None]


class AgentRunner:
    def __init__(self, model: str, max_turns: int = 12, approval_check: ApprovalCheck | None = None) -> None:
        load_dotenv()
        self.model = model
        self.max_turns = max_turns
        self.approval_check = approval_check
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.policy = Policy.from_env()
        self.browser = BrowserTool(self.policy)
        self.local_bridge = LocalBridge(self.policy)
        self.registry = ToolRegistry(self.browser, self.local_bridge)

    def _collect_function_calls(self, response: Any) -> list[dict[str, Any]]:
        calls: list[dict[str, Any]] = []
        for item in getattr(response, "output", []) or []:
            if getattr(item, "type", None) == "function_call":
                calls.append(
                    {
                        "name": getattr(item, "name", ""),
                        "arguments": getattr(item, "arguments", "{}"),
                        "call_id": getattr(item, "call_id", ""),
                    }
                )
        return calls

    def _text_from_response(self, response: Any) -> str:
        text = getattr(response, "output_text", None)
        if text:
            return text

        chunks: list[str] = []
        for item in getattr(response, "output", []) or []:
            if getattr(item, "type", None) != "message":
                continue
            for c in getattr(item, "content", []) or []:
                if getattr(c, "type", None) == "output_text":
                    chunks.append(getattr(c, "text", ""))
        return "\n".join(x for x in chunks if x)

    def run(self, task: str) -> str:
        return self.run_detailed(task)["output_text"]

    def run_detailed(self, task: str) -> dict[str, Any]:
        tools = self.registry.tool_specs() + [{"type": "web_search_preview"}]

        response = self.client.responses.create(
            model=self.model,
            input=task,
            tools=tools,
        )

        pending_approvals: list[dict[str, Any]] = []
        status = "completed"

        try:
            for _ in range(self.max_turns):
                calls = self._collect_function_calls(response)
                if not calls:
                    break

                approval_triggered = False
                tool_outputs = []

                for call in calls:
                    try:
                        args = json.loads(call["arguments"] or "{}")
                    except json.JSONDecodeError:
                        args = {}

                    approval = self.approval_check(call["name"], args) if self.approval_check else None
                    if approval is not None:
                        approval_triggered = True
                        pending_approvals.append(approval)
                        result = {
                            "ok": False,
                            "approval_required": True,
                            "approval": approval,
                            "tool": call["name"],
                        }
                    else:
                        result = self.registry.execute(call["name"], args)

                    tool_outputs.append(
                        {
                            "type": "function_call_output",
                            "call_id": call["call_id"],
                            "output": json.dumps(result, ensure_ascii=False),
                        }
                    )

                response = self.client.responses.create(
                    model=self.model,
                    previous_response_id=response.id,
                    input=tool_outputs,
                    tools=tools,
                )

                if approval_triggered:
                    return {
                        "status": "awaiting_approval",
                        "output_text": self._text_from_response(response),
                        "pending_approvals": pending_approvals,
                        "response_id": response.id,
                    }
            else:
                status = "max_turns_reached"

            return {
                "status": status,
                "output_text": self._text_from_response(response),
                "pending_approvals": pending_approvals,
                "response_id": response.id,
            }
        finally:
            self.browser.close()
