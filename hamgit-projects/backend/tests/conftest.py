import pytest
from fastapi.testclient import TestClient

from account.adapters.orm.mappers import start_mappers as start_account_mappers
from account.domain.entities.user import User
from account.domain.enums import UserRole
from advertisement.adapters.orm.mappers import start_mappers as start_ads_mappers
from contract.adapters.orm.mappers import start_mappers as start_contract_mappers
from di import get_current_user
from financial.adapters.orm.mappers import start_mappers as start_financial_mappers
from main import app
from shared.adapters.orm.mappers import start_mappers as start_storage_mappers


@pytest.fixture(scope="session", autouse=True)
def setup_mappers():
    start_account_mappers()
    start_storage_mappers()
    start_contract_mappers()
    start_financial_mappers()
    start_ads_mappers()


_client = TestClient(app)


@pytest.fixture
def client():
    return _client


@pytest.fixture
def uow():
    from core.database import SESSION_FACTORY
    from unit_of_work import SQLAlchemyUnitOfWork

    _db = SESSION_FACTORY()
    try:
        return SQLAlchemyUnitOfWork(_db)
    finally:
        _db.close()


def override_get_current_user():
    return User(mobile="1234567890", roles=[UserRole.SUPERUSER])


app.dependency_overrides[get_current_user] = override_get_current_user
