from pathlib import Path

import pytest

from local_bridge import LocalBridge
from policy import Policy


def test_path_escape_is_blocked(tmp_path: Path) -> None:
    workspace = tmp_path / "workspace"
    workspace.mkdir()
    (tmp_path / "workspace2").mkdir()

    bridge = LocalBridge(
        Policy(
            workspace_root=workspace,
            allow_local_write=True,
            allow_script_execution=False,
            allowed_domains=(),
        )
    )

    with pytest.raises(PermissionError):
        bridge._resolve("../workspace2/secret.txt")


def test_read_write_round_trip(tmp_path: Path) -> None:
    workspace = tmp_path / "workspace"
    workspace.mkdir()

    bridge = LocalBridge(
        Policy(
            workspace_root=workspace,
            allow_local_write=True,
            allow_script_execution=False,
            allowed_domains=(),
        )
    )

    bridge.write_file("a/b.txt", "hello")
    loaded = bridge.read_file("a/b.txt")
    assert loaded["content"] == "hello"
