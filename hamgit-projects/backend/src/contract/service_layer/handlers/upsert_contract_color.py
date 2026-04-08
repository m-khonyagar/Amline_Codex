from contract.domain.enums import ContractColor
from unit_of_work import UnitOfWork


def upsert_contract_color_handler(uow: UnitOfWork, contract_id: int, color: ContractColor) -> None:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        prcontract.color = color
        uow.commit()
