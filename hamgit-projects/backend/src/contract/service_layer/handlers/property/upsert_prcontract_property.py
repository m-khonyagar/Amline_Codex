from account.domain.enums import UserRole
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from core.types import CurrentUser
from shared.domain.entities.file import File
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


def upsert_prcontract_property_handler(
    contract_id: int,
    data: dict,
    current_user: CurrentUser,
    uow: UnitOfWork,
    prc_service: PRContractService,
    prc_step: PRContractStep,
) -> Property:
    with uow:
        # REF: this function needs refactoring because it handle three routes in one function
        # TEMP: all the fixes are temporary
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)

        party = uow.contract_parties.get_party_or_raise(
            contract_id=contract_id, user_id=current_user.id, user_roles=current_user.roles
        )

        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id=contract_id)

        prc_service.validate_party_has_permission_for_step(
            party=party, step=prc_step, prc=prcontract, completed_steps=contract_steps
        )

        # files_exist = data.get("deed_image_file_ids", False)

        # new_file_ids = data.pop("deed_image_file_ids", [])

        current_file_ids = []

        if city_id := data.get("city_id"):
            uow.cities.get_or_raise(id=city_id)

        if prcontract.property_id is not None:
            property = uow.properties.get_or_raise(id=prcontract.property_id)
            current_file_ids = property.deed_image_file_ids
            new_file_ids = data.pop("deed_image_file_ids", current_file_ids)
        else:
            property = Property(owner_user_id=current_user.id, owner_user_role=UserRole.PERSON)
            uow.properties.add(property)
            uow.flush()
            prcontract.property_id = property.id
            new_file_ids = []

        property_dict_data = {k: v for k, v in data.items() if v is not None}

        property.validate_data(**property_dict_data)
        property.update(**property_dict_data)

        deed_image_files = handle_deed_image_files(
            new_file_ids=new_file_ids, current_file_ids=current_file_ids, uow=uow
        )

        contract_step = uow.contract_steps.get(contract_id=contract_id, type=prc_step)

        property.deed_image_file_ids = [file.id for file in deed_image_files]

        if check_step_status(property, prc_step) and not contract_step:
            contract_step = uow.contract_steps.add_step(contract_id=contract_id, type=prc_step)
        elif contract_step and contract_step.is_completed and not check_step_status(property, prc_step):
            contract_step.revoke()

        elif contract_step and contract_step.is_completed and check_step_status(property, prc_step):
            pass

        uow.commit()
        uow.properties.refresh(property)
        if property.city_id:
            city = uow.cities.get_by_id_or_raise(property.city_id)
            property.city = city.dumps()
        property.deed_image_files = [file.dumps() for file in deed_image_files]
        return property


def check_step_status(property: Property, step_type: PRContractStep) -> bool:
    if step_type == PRContractStep.PROPERTY_SPECIFICATIONS:
        return property.specifications_completed
    elif step_type == PRContractStep.PROPERTY_DETAILS:
        return property.details_completed
    elif step_type == PRContractStep.PROPERTY_FACILITIES:
        return property.facilities_completed
    return False


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
