from unit_of_work import UnitOfWork


def all_city_districts_view(city_id: int, uow: UnitOfWork):
    with uow:
        districts = uow.districts.get_by_city(city_id)
        return [district.dumps() for district in districts]
