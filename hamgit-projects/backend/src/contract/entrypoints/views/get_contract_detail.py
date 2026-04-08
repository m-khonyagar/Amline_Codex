from unit_of_work import UnitOfWork


def get_contract_detail_view(contract_id: int, uow: UnitOfWork) -> dict:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        return prcontract.dumps(key=str(contract.id), password=contract.password)
