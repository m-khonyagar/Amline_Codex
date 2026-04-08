from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Callable

from browser_tool import BrowserTool
from local_bridge import LocalBridge

ToolFunc = Callable[[dict[str, Any]], dict[str, Any]]


@dataclass
class ToolDef:
    name: str
    description: str
    parameters: dict[str, Any]
    handler: ToolFunc


class ToolRegistry:
    def __init__(self, browser: BrowserTool, local_bridge: LocalBridge) -> None:
        self.browser = browser
        self.local_bridge = local_bridge
        self._tools = self._build_tools()

    def _build_tools(self) -> dict[str, ToolDef]:
        return {
            "browser_open": ToolDef(
                name="browser_open",
                description="Open a URL in the browser",
                parameters={
                    "type": "object",
                    "properties": {"url": {"type": "string"}},
                    "required": ["url"],
                },
                handler=lambda a: self.browser.open(a["url"]),
            ),
            "browser_snapshot": ToolDef(
                name="browser_snapshot",
                description="Get current page title/url plus interactable elements",
                parameters={"type": "object", "properties": {}},
                handler=lambda _a: self.browser.snapshot(),
            ),
            "browser_click": ToolDef(
                name="browser_click",
                description="Click an element by snapshot element_id",
                parameters={
                    "type": "object",
                    "properties": {"element_id": {"type": "string"}},
                    "required": ["element_id"],
                },
                handler=lambda a: self.browser.click(a["element_id"]),
            ),
            "browser_type": ToolDef(
                name="browser_type",
                description="Type into an element by snapshot element_id",
                parameters={
                    "type": "object",
                    "properties": {
                        "element_id": {"type": "string"},
                        "text": {"type": "string"},
                    },
                    "required": ["element_id", "text"],
                },
                handler=lambda a: self.browser.type(a["element_id"], a["text"]),
            ),
            "local_list_dir": ToolDef(
                name="local_list_dir",
                description="List files/folders under workspace",
                parameters={
                    "type": "object",
                    "properties": {"path": {"type": "string"}},
                },
                handler=lambda a: self.local_bridge.list_dir(a.get("path", ".")),
            ),
            "local_read_file": ToolDef(
                name="local_read_file",
                description="Read a text file in workspace",
                parameters={
                    "type": "object",
                    "properties": {"path": {"type": "string"}},
                    "required": ["path"],
                },
                handler=lambda a: self.local_bridge.read_file(a["path"]),
            ),
            "local_write_file": ToolDef(
                name="local_write_file",
                description="Write text to a file in workspace (policy-gated)",
                parameters={
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "content": {"type": "string"},
                    },
                    "required": ["path", "content"],
                },
                handler=lambda a: self.local_bridge.write_file(a["path"], a["content"]),
            ),
            "local_search_text": ToolDef(
                name="local_search_text",
                description="Search text in workspace files",
                parameters={
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "path": {"type": "string"},
                    },
                    "required": ["query"],
                },
                handler=lambda a: self.local_bridge.search_text(a["query"], a.get("path", ".")),
            ),
            "local_run_python_script": ToolDef(
                name="local_run_python_script",
                description="Run a Python script inside workspace (policy-gated)",
                parameters={
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "args": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["path"],
                },
                handler=lambda a: self.local_bridge.run_python_script(a["path"], a.get("args", [])),
            ),
        }

    def tool_specs(self) -> list[dict[str, Any]]:
        specs = []
        for tool in self._tools.values():
            specs.append(
                {
                    "type": "function",
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.parameters,
                }
            )
        return specs

    def execute(self, name: str, args: dict[str, Any]) -> dict[str, Any]:
        if name not in self._tools:
            return {"ok": False, "error": f"Unknown tool: {name}"}

        try:
            return {"ok": True, "result": self._tools[name].handler(args)}
        except Exception as exc:  # noqa: BLE001
            return {
                "ok": False,
                "error": str(exc),
                "tool": name,
                "args": json.dumps(args, ensure_ascii=False),
            }
