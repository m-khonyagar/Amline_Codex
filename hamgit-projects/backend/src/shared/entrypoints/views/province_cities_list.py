from unit_of_work import UnitOfWork


def all_province_cities_view(province_id: int, uow: UnitOfWork):
    with uow:
        cities = uow.cities.get_by_province_id(province_id)
        return [city.dumps() for city in cities]
