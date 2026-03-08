from unit_of_work import UnitOfWork


def all_cities_view(uow: UnitOfWork):
    with uow:
        cities = uow.cities.all_cities()
        result = [city.dumps() for city in cities]
        sorted_result = sorted(result, key=lambda x: x["id"] != "712")
        return sorted_result
