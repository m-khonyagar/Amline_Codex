from unit_of_work import UnitOfWork


def get_contract_descriptions_handler(contract_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        descriptions = uow.contract_descriptions.get_by_contract_id(contract_id)
        return [desc.dumps() for desc in descriptions]
