from contract.domain.enums import PartyType, PRContractStep
from contract.service_layer.dtos import PRContractPropertyDto
from core.exceptions import NotFoundException
from core.translates.not_found_exception import NotFoundExcTrans
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


def create_prcontract_property_handler(contract_id: int, data: PRContractPropertyDto, uow: UnitOfWork) -> dict:
    with uow:
        landlord = uow.contract_parties.get_by_contract_id_and_party_type(
            contract_id=contract_id, party_type=PartyType.LANDLORD
        )
        if not landlord:
            raise NotFoundException(NotFoundExcTrans.ContractParty)

        city = None
        if data.city_id:
            city = uow.cities.get_or_raise(id=data.city_id)

        deed_images = [uow.files.get_or_raise(id=file_id) for file_id in data.deed_image_file_ids]
        property_deed_images = []
        for deed_image in deed_images:
            deed_image.is_used = True
            property_deed_images.append(deed_image)

        property = Property(owner_user_id=landlord.user_id, owner_user_role=landlord.user_role)
        property_dict_data = {k: v for k, v in data.dumps().items() if v is not None}

        property.validate_data(**property_dict_data)
        property.update(**property_dict_data)
        uow.properties.add(property)

        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        prcontract.property_id = property.id
        prcontract.tenant_family_members_count = data.family_members_count if data.family_members_count else None

        if property.specifications_completed:
            uow.contract_steps.add_step(contract_id, PRContractStep.PROPERTY_SPECIFICATIONS)
        if property.details_completed:
            uow.contract_steps.add_step(contract_id, PRContractStep.PROPERTY_DETAILS)
        if property.facilities_completed:
            uow.contract_steps.add_step(contract_id, PRContractStep.PROPERTY_FACILITIES)

        uow.commit()

        uow.properties.refresh(property)

        property.deed_image_files = [deed_image.dumps() for deed_image in property_deed_images]
        property.city = city.dumps() if city else None

        result = property.dumps()
        result["family_members_count"] = prcontract.tenant_family_members_count

        return result
