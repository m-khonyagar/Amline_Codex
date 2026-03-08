import pytest
from fastapi.testclient import TestClient

from account.domain.enums import UserRole
from shared.domain.entities import Property
from unit_of_work import UnitOfWork


@pytest.fixture
def property():
    return Property(owner_user_id=1, owner_user_role=UserRole.PERSON)


def test_property_dumps_with_no_deed_images(property: Property):
    dumps = property.dumps()
    assert dumps["deed_image_files"] is None


def test_property_dumps_with_no_city(property: Property):
    dumps = property.dumps()
    assert dumps["city"] is None


def test_property_dumps_with_deed_images(property: Property):
    property.deed_image_file_ids = [1, 2]
    deed_image_files = [{"id": 1}, {"id": 2}]
    dumps = property.dumps(deed_image_files=deed_image_files)
    assert dumps["deed_image_files"] == deed_image_files


def test_property_dumps_with_city(property: Property):
    property.city_id = 1
    city = {"id": 1}

    dumps = property.dumps(city=city)
    assert dumps["city"] == city


def test_get_prcontract_property_route(client: TestClient, uow: UnitOfWork):
    prc = uow.fetchone(
        "SELECT contract_id, property_id FROM contract.property_rent_contracts \
            WHERE property_id IS NOT NULL"
    )
    assert prc
    response = client.get(f"/pr-contracts/{prc['contract_id']}/property")
    assert response.status_code == 200
    data = response.json()
    assert int(data["id"]) == prc["property_id"]

    assert isinstance(data["city"], dict)
