from contract.domain.entities import Contract, ContractParty, PropertyRentContract
from contract.domain.enums import ContractStatus, ContractType
from contract.domain.prcontract.clauses_generator import generate_clauses
from contract.service_layer.dtos import AdminStartContractDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def admin_start_contract_handler(current_user: CurrentUser, data: AdminStartContractDto, uow: UnitOfWork) -> Contract:
    with uow:
        owner = uow.users.get_or_raise(id=data.owner.user_id)

        contract = Contract(
            type=data.contract_type,
            owner_user_id=owner.id,
            status=ContractStatus.ADMIN_STARTED,
            created_by=current_user.id,
        )
        uow.contracts.add(contract)
        uow.flush()

        party = ContractParty(user_id=owner.id, contract_id=contract.id, party_type=data.owner.party_type)

        if data.contract_type == ContractType.PROPERTY_RENT:
            prcontract = PropertyRentContract(
                contract_id=contract.id,
                owner_user_id=owner.id,
                owner_party_type=data.owner.party_type,
                is_guaranteed=data.is_guaranteed,
                status=ContractStatus.ADMIN_STARTED,
            )
            uow.prcontracts.add(prcontract)

        # Add default clauses
        clauses = generate_clauses(uow=uow, contract_id=contract.id, is_guaranteed=data.is_guaranteed)
        uow.contract_clauses.add_all(clauses)

        uow.contract_parties.add(party)

        uow.commit()
        uow.contracts.refresh(contract)
        return contract
