"""ADMIN ROUTES HANDLER"""

from contract.domain.entities.contract_step import ContractStep
from contract.domain.enums import PRContractStep
from contract.service_layer.dtos import PRContractPropertyDto
from contract.service_layer.exceptions import InvalidActionOrderException
from core.exceptions import NotFoundException
from core.translates.not_found_exception import NotFoundExcTrans
from unit_of_work import UnitOfWork


def update_prcontract_property_handler(contract_id: int, data: PRContractPropertyDto, uow: UnitOfWork) -> dict:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        # if prcontract.status not in [ContractStatus.EDIT_REQUESTED, ContractStatus.ADMIN_STARTED]:
        #     raise ContractIsNotEditRequestedException

        check_perm(uow.contract_steps.get_contract_completed_steps(contract_id))

        prcontract.tenant_family_members_count = data.family_members_count if data.family_members_count else None

        if prcontract.property_id is None:
            raise NotFoundException(NotFoundExcTrans.Property)

        property = uow.properties.get_or_raise(id=prcontract.property_id)

        # handle deed image files
        if data.deed_image_file_ids is not None:
            files_to_delete = set(property.deed_image_file_ids) - set(data.deed_image_file_ids)
            files_to_add = set(data.deed_image_file_ids) - set(property.deed_image_file_ids)

            for file_id in files_to_delete:
                file = uow.files.get_or_raise(id=file_id)
                file.delete()

            for file_id in files_to_add:
                file = uow.files.get_or_raise(id=file_id)
                file.is_used = True

        # handle city
        if data.city_id and data.city_id != property.city_id:
            uow.cities.get_or_raise(id=data.city_id)

        property_dict_data = {k: v for k, v in data.dumps().items() if v is not None}

        property.validate_data(**property_dict_data)
        property.update(**property_dict_data)

        if property.specifications_completed:
            uow.contract_steps.add_step(contract_id, PRContractStep.PROPERTY_SPECIFICATIONS)
        else:
            uow.contract_steps.revoke_step_if_exists(contract_id, PRContractStep.PROPERTY_SPECIFICATIONS)

        if property.details_completed:
            uow.contract_steps.add_step(contract_id, PRContractStep.PROPERTY_DETAILS)
        else:
            uow.contract_steps.revoke_step_if_exists(contract_id, PRContractStep.PROPERTY_DETAILS)

        if property.facilities_completed:
            uow.contract_steps.add_step(contract_id, PRContractStep.PROPERTY_FACILITIES)
        else:
            uow.contract_steps.revoke_step_if_exists(contract_id, PRContractStep.PROPERTY_FACILITIES)

        uow.commit()
        uow.properties.refresh(property)
        property.city = uow.cities.get_by_id(property.city_id).dumps() if property.city_id else None

        result = property.dumps()
        result["family_members_count"] = prcontract.tenant_family_members_count

        return result


def check_perm(completed_steps: list[ContractStep]) -> None:
    steps = [step.type for step in completed_steps]
    if [PRContractStep.TENANT_SIGNATURE, PRContractStep.LANDLORD_SIGNATURE] in steps:
        raise InvalidActionOrderException
