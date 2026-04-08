from approval import ApprovalStore


def test_approval_cannot_be_decided_twice() -> None:
    store = ApprovalStore()
    req = store.check_or_request("t1", "local_write_file", {"path": "a.txt", "content": "x"})
    assert req is not None

    decided = store.decide(req["id"], "approve")
    assert decided["status"] == "approved"

    try:
        store.decide(req["id"], "deny")
        assert False, "Expected ValueError for second decision"
    except ValueError as exc:
        assert "already" in str(exc)


def test_approved_signature_does_not_request_again() -> None:
    store = ApprovalStore()
    req = store.check_or_request("t1", "local_write_file", {"path": "a.txt", "content": "x"})
    assert req is not None
    store.decide(req["id"], "approve")

    second = store.check_or_request("t1", "local_write_file", {"path": "a.txt", "content": "x"})
    assert second is None
