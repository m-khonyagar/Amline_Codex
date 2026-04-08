from contract.domain.entities import Contract, ContractParty, PropertyRentContract
from contract.domain.enums import ContractStatus, ContractType, PartyType
from contract.service_layer.dtos import CreateEmptyContractDto
from core.exceptions import ConflictException
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def create_empty_contract_handler(current_user: CurrentUser, data: CreateEmptyContractDto, uow: UnitOfWork) -> dict:
    with uow:
        existing_prcontract = uow.prcontracts.get(tracking_code_value=data.tracking_code)
        if existing_prcontract:
            raise ConflictException(detail="tracking code already exists")
        contract = Contract(
            type=ContractType.PROPERTY_RENT,
            owner_user_id=current_user.id,
            status=ContractStatus.PDF_GENERATED,
            created_by=current_user.id,
        )
        uow.contracts.add(contract)
        uow.flush()
        party = ContractParty(contract_id=contract.id, user_id=current_user.id, party_type=PartyType.LANDLORD)

        prcontract = PropertyRentContract(
            contract_id=contract.id,
            owner_user_id=current_user.id,
            owner_party_type=PartyType.LANDLORD,
            is_guaranteed=False,
        )
        prcontract.tracking_code_value = data.tracking_code
        prcontract.status = ContractStatus.PDF_GENERATED
        uow.prcontracts.add(prcontract)
        uow.contract_parties.add(party)

        uow.commit()
        uow.contracts.refresh(contract)
        return contract.dumps()
