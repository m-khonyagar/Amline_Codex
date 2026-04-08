from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Policy:
    workspace_root: Path
    allow_local_write: bool
    allow_script_execution: bool
    allowed_domains: tuple[str, ...]

    @classmethod
    def from_env(cls) -> "Policy":
        root = Path(os.environ.get("WORKSPACE_ROOT", "./workspace")).resolve()
        root.mkdir(parents=True, exist_ok=True)
        write_ok = os.environ.get("ALLOW_LOCAL_WRITE", "false").lower() == "true"
        run_ok = os.environ.get("ALLOW_SCRIPT_EXECUTION", "false").lower() == "true"
        domains_raw = os.environ.get("ALLOWED_DOMAINS", "")
        allowed_domains = tuple(
            d.strip().lower()
            for d in domains_raw.split(",")
            if d.strip()
        )
        return cls(
            workspace_root=root,
            allow_local_write=write_ok,
            allow_script_execution=run_ok,
            allowed_domains=allowed_domains,
        )

    def is_domain_allowed(self, host: str) -> bool:
        if not self.allowed_domains:
            return True
        h = host.lower().strip()
        return any(h == domain or h.endswith(f".{domain}") for domain in self.allowed_domains)
