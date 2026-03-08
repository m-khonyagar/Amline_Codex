from account.domain.enums import UserRole
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from contract.service_layer.dtos import UpsertPRContractPropertySpecificationsDto
from core.types import CurrentUser
from shared.domain.entities.file import File
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


def upsert_prcontract_property_specifications_handler(
    contract_id: int,
    data: UpsertPRContractPropertySpecificationsDto,
    current_user: CurrentUser,
    uow: UnitOfWork,
    prc_service: PRContractService,
) -> dict:
    with uow:

        prc_step = PRContractStep.PROPERTY_SPECIFICATIONS

        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)

        prcontract.tenant_family_members_count = data.family_members_count

        party = uow.contract_parties.get_party_or_raise(
            contract_id=contract_id, user_id=current_user.id, user_roles=current_user.roles
        )

        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id=contract_id)

        prc_service.validate_party_has_permission_for_step(
            party=party, step=prc_step, prc=prcontract, completed_steps=contract_steps
        )

        uow.cities.get_or_raise(id=data.city_id)

        if prcontract.property_id:
            property = uow.properties.get_or_raise(id=prcontract.property_id)
            current_file_ids = property.deed_image_file_ids
        else:
            property = Property(owner_user_id=current_user.id, owner_user_role=UserRole.PERSON)
            uow.properties.add(property)
            uow.flush()
            prcontract.property_id = property.id
            current_file_ids = []

        property_dict_data = {k: v for k, v in data.dumps().items() if v is not None}

        property.validate_data(**property_dict_data)
        property.update(**property_dict_data)

        deed_image_files = handle_deed_image_files(
            new_file_ids=data.deed_image_file_ids, current_file_ids=current_file_ids, uow=uow
        )

        contract_step = uow.contract_steps.get(contract_id=contract_id, type=prc_step)
        if not contract_step:
            uow.contract_steps.add_step(contract_id=contract_id, type=prc_step)
        elif contract_step.is_completed and not property.specifications_completed:
            contract_step.revoke()

        property.deed_image_file_ids = [file.id for file in deed_image_files]

        uow.commit()
        uow.properties.refresh(property)
        if property.city_id:
            city = uow.cities.get_by_id_or_raise(property.city_id)
            property.city = city.dumps()
        property.deed_image_files = [file.dumps() for file in deed_image_files]

        result = property.dumps()
        result["family_members_count"] = prcontract.tenant_family_members_count

        return result


def handle_deed_image_files(new_file_ids: list[int], current_file_ids: list[int], uow: UnitOfWork) -> list[File]:
    current_ids = set(current_file_ids)
    new_ids = set(new_file_ids)
    ids_to_remove = current_ids - new_ids

    new_files: list[File] = [uow.files.get_or_raise(id=file_id) for file_id in new_ids]

    for file_id in ids_to_remove:
        file = uow.files.get_or_raise(id=file_id)
        file.is_used = False

    for file in new_files:
        file.is_used = True

    return new_files
