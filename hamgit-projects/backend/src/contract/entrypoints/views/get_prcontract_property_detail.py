from account.domain.entities.user import User
from core.exceptions import NotFoundException, ProcessingException
from core.translates.not_found_exception import NotFoundExcTrans
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork


def get_prcontract_property_detail_view(contract_id: int, user: User, uow: UnitOfWork) -> dict:
    with uow:
        prc = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        contract = uow.contracts.get_or_raise(id=contract_id)

        if not user.is_admin and contract.created_by != user.id:
            uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id=contract_id, user=user)

        if prc.property_id is None:
            raise NotFoundException(NotFoundExcTrans.prcontract_property_not_found)

        property = uow.properties.get_or_raise(id=prc.property_id)

        if not property:
            raise ProcessingException(ProcessingExcTrans.prcontract_property_was_deleted)

        city = uow.cities.get_by_id(property.city_id) if property.city_id else None
        property.city = city.dumps() if city else None
        deed_image_files = [uow.files.get(id=file_id) for file_id in property.deed_image_file_ids]
        property.deed_image_files = [file.dumps() for file in deed_image_files if file]

        result = property.dumps()
        result["family_members_count"] = prc.tenant_family_members_count

        return result
