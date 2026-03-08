from account.domain.entities.user import User
from contract.domain.entities.contract_description import ContractDescription
from contract.service_layer.dtos import CreateContractDescriptionDto
from unit_of_work import UnitOfWork


def create_contract_description_handler(
    data: CreateContractDescriptionDto, current_user: User, uow: UnitOfWork
) -> dict:
    with uow:
        contract_description = ContractDescription(
            contract_id=data.contract_id,
            text=data.text,
            created_by=current_user.id,
        )
        uow.contract_descriptions.add(contract_description)
        uow.commit()
        uow.contract_descriptions.refresh(contract_description)
        return contract_description.dumps()
