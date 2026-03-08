from __future__ import annotations

import os
import subprocess
from pathlib import Path

from policy import Policy


class LocalBridge:
    def __init__(self, policy: Policy) -> None:
        self.policy = policy

    def _resolve(self, user_path: str) -> Path:
        raw = (self.policy.workspace_root / user_path).resolve()
        workspace = self.policy.workspace_root.resolve()
        if not str(raw).startswith(str(workspace)):
            raise PermissionError("Path escapes WORKSPACE_ROOT")
        return raw

    def list_dir(self, path: str = ".") -> dict:
        p = self._resolve(path)
        if not p.exists() or not p.is_dir():
            raise FileNotFoundError(f"Directory not found: {path}")
        items = []
        for x in sorted(p.iterdir(), key=lambda n: (not n.is_dir(), n.name.lower())):
            items.append(
                {
                    "name": x.name,
                    "is_dir": x.is_dir(),
                    "size": x.stat().st_size if x.is_file() else None,
                }
            )
        return {"path": str(p), "items": items}

    def read_file(self, path: str) -> dict:
        p = self._resolve(path)
        if not p.exists() or not p.is_file():
            raise FileNotFoundError(f"File not found: {path}")
        text = p.read_text(encoding="utf-8")
        return {"path": str(p), "content": text}

    def write_file(self, path: str, content: str) -> dict:
        if not self.policy.allow_local_write:
            raise PermissionError("Policy blocks local writes (ALLOW_LOCAL_WRITE=false)")
        p = self._resolve(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
        return {"path": str(p), "written": len(content)}

    def search_text(self, query: str, path: str = ".") -> dict:
        base = self._resolve(path)
        if not base.exists():
            raise FileNotFoundError(f"Path not found: {path}")

        matches = []
        files = [base] if base.is_file() else [x for x in base.rglob("*") if x.is_file()]
        for f in files:
            try:
                content = f.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for i, line in enumerate(content.splitlines(), start=1):
                if query.lower() in line.lower():
                    matches.append(
                        {
                            "file": str(f),
                            "line": i,
                            "text": line[:400],
                        }
                    )
                    if len(matches) >= 500:
                        return {"query": query, "matches": matches, "truncated": True}
        return {"query": query, "matches": matches, "truncated": False}

    def run_python_script(self, path: str, args: list[str] | None = None) -> dict:
        if not self.policy.allow_script_execution:
            raise PermissionError("Policy blocks script execution (ALLOW_SCRIPT_EXECUTION=false)")

        script = self._resolve(path)
        if not script.exists() or not script.is_file():
            raise FileNotFoundError(f"Script not found: {path}")
        if script.suffix.lower() != ".py":
            raise PermissionError("Only .py scripts are allowed")

        cmd = ["python", str(script), *(args or [])]
        proc = subprocess.run(
            cmd,
            cwd=str(self.policy.workspace_root),
            env={**os.environ},
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )
        return {
            "command": cmd,
            "returncode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
        }
