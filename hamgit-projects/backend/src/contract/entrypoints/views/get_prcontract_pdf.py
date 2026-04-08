from account.domain.entities.user import User
from core.exceptions import NotFoundException
from core.translates import not_found_trans
from shared.service_layer.services.storage_service import StorageService
from unit_of_work import UnitOfWork


def get_prcontract_pdf_view(contract_id: int, user: User, uow: UnitOfWork, storage: StorageService) -> dict:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)

        if not user.is_admin and contract.created_by != user.id:
            uow.contract_parties.get_party_or_raise(contract_id=contract_id, user_id=user.id, user_roles=user.roles)
        if contract.pdf_file_id:
            pdf_file = uow.files.get_or_raise(id=contract.pdf_file_id)
            pdf_file.url = storage.get_url(pdf_file)
        else:
            raise NotFoundException(not_found_trans.contract_pdf_not_set)

        return pdf_file.dumps()
