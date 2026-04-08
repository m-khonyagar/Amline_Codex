from core.exceptions import ConflictException, NotFoundException
from core.helpers import get_now
from shared.domain.entities.district import District
from shared.entrypoints.request_models import UpdateDistrictRequestModel
from unit_of_work import UnitOfWork


def create_district_handler(city_id: int, name: str, region: int | None, uow: UnitOfWork):
    with uow:
        existing_district = (
            uow.session.query(District).filter(District.name == name, District.city_id == city_id).first()
        )
        if existing_district:
            raise ConflictException(detail=f"District {name} already exists")

        district = District(name=name, city_id=city_id, lat="unknown", long="unknown", region=region)
        uow.districts.add(district)
        uow.commit()
        return district.dumps()


def update_district_handler(district_id: int, data: UpdateDistrictRequestModel, uow: UnitOfWork):
    with uow:
        district: District | None = uow.session.query(District).filter(District.id == district_id).first()
        if not district:
            raise NotFoundException(detail=f"District {district_id} not found")
        district.update(**data.model_dump(exclude_unset=True))
        uow.commit()
        uow.districts.refresh(district)
        return district.dumps()


def delete_district_handler(district_id: int, uow: UnitOfWork):
    with uow:
        district: District | None = uow.session.query(District).filter(District.id == district_id).first()
        if not district:
            raise NotFoundException(detail=f"District {district_id} not found")
        district.deleted_at = get_now()
        uow.commit()
        return True
