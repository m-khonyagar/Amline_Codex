from unit_of_work import UnitOfWork


def all_provinces_view(uow: UnitOfWork):
    with uow:
        cities = uow.provinces.all_provinces()
        result = [provinces.dumps() for provinces in cities]
        sorted_result = sorted(result, key=lambda x: x["id"] != "19")
        return sorted_result
