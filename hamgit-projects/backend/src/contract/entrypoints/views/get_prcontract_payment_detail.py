from account.domain.entities.user import User
from core.exceptions import PermissionException
from core.translates.permission_exception import PermExcTrans
from shared.service_layer.services.storage_service import StorageService
from unit_of_work import UnitOfWork


def get_prcontract_payment_detail_view(
    contract_id: int, payment_id: int, user: User, uow: UnitOfWork, storage: StorageService
) -> dict:
    with uow:
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        parties = uow.contract_parties.get_by_contract_id(contract_id=prcontract.contract_id)
        parties_ids = [party.user_id for party in parties]
        if user.id not in parties_ids:
            raise PermissionException(PermExcTrans.user_is_not_contract_party)
        payment = uow.contract_payments.get_or_raise(id=payment_id)

        image_file = None

        if payment.cheque:
            image = uow.files.get_or_raise(id=payment.cheque.image_file_id)
            image.url = storage.get_url(image)
        return payment.dumps(image_file=image_file)
