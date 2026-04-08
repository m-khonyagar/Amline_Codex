import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def test_client():
    return TestClient(app)


def test_ping(test_client):
    response = test_client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"ping": "pong!"}
