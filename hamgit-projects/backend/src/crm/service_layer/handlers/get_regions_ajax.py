from sqlalchemy import select

from shared.domain.entities.district import District
from unit_of_work import UnitOfWork


def get_regions_ajax_handler(city_id: int, uow: UnitOfWork):
    with uow:
        query = (
            select(District.region)  # type: ignore
            .distinct()
            .where(District.region.isnot(None), District.city_id == city_id)  # type: ignore
        )
        result = uow.session.execute(query).scalars().all()
        return sorted(result)
