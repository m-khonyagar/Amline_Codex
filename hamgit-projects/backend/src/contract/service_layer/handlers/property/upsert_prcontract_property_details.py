from account.domain.enums import UserRole
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from contract.service_layer.dtos import UpsertPRContractPropertyDetailsDto
from core.types import CurrentUser
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


def upsert_prcontract_property_details_handler(
    contract_id: int,
    data: UpsertPRContractPropertyDetailsDto,
    current_user: CurrentUser,
    uow: UnitOfWork,
    prc_service: PRContractService,
) -> dict:
    with uow:

        prc_step = PRContractStep.PROPERTY_DETAILS

        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)

        party = uow.contract_parties.get_party_or_raise(
            contract_id=contract_id, user_id=current_user.id, user_roles=current_user.roles
        )

        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id=contract_id)

        prc_service.validate_party_has_permission_for_step(
            party=party, step=prc_step, prc=prcontract, completed_steps=contract_steps
        )

        if prcontract.property_id:
            property = uow.properties.get_or_raise(id=prcontract.property_id)
        else:
            property = Property(owner_user_id=current_user.id, owner_user_role=UserRole.PERSON)
            uow.properties.add(property)
            uow.flush()
            prcontract.property_id = property.id

        property_dict_data = {k: v for k, v in data.dumps().items() if v is not None}

        property.validate_data(**property_dict_data)
        property.update(**property_dict_data)

        contract_step = uow.contract_steps.get(contract_id=contract_id, type=prc_step)
        if not contract_step:
            uow.contract_steps.add_step(contract_id=contract_id, type=prc_step)
        elif contract_step.is_completed and not property.details_completed:
            contract_step.revoke()

        uow.commit()
        uow.properties.refresh(property)

        result = property.dumps()
        result["family_members_count"] = prcontract.tenant_family_members_count

        return result
