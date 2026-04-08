from shared.domain.entities.city import City
from unit_of_work import UnitOfWork


def city_detail_view(city_id: int, uow: UnitOfWork) -> City:
    with uow:
        return uow.cities.get_or_raise(id=city_id)
