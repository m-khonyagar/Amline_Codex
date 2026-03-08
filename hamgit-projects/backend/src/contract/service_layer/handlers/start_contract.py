from contract.domain.entities import Contract, ContractParty, PropertyRentContract
from contract.domain.enums import ContractType
from contract.domain.prcontract.clauses_generator import generate_clauses
from contract.service_layer.dtos import StartContractDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def start_contract_handler(current_user: CurrentUser, data: StartContractDto, uow: UnitOfWork) -> Contract:
    with uow:
        contract = Contract(type=ContractType.PROPERTY_RENT, owner_user_id=current_user.id, created_by=current_user.id)
        uow.contracts.add(contract)
        uow.flush()
        party = ContractParty(contract_id=contract.id, user_id=current_user.id, party_type=data.party_type)

        # Create a Property Rent Contract
        if data.contract_type == ContractType.PROPERTY_RENT:
            prcontract = PropertyRentContract(
                contract_id=contract.id,
                owner_user_id=current_user.id,
                owner_party_type=data.party_type,
                is_guaranteed=data.is_guaranteed,
            )
            uow.prcontracts.add(prcontract)

        # Add default clauses
        clauses = generate_clauses(uow=uow, contract_id=contract.id, is_guaranteed=data.is_guaranteed)
        uow.contract_clauses.add_all(clauses)

        uow.contract_parties.add(party)

        uow.commit()
        uow.contracts.refresh(contract)
        return contract
