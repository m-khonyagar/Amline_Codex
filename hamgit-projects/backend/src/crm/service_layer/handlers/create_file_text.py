from account.domain.entities.user import User
from core import helpers
from crm.domain.entities.file_text import FileText
from crm.entrypoints.request_models import FileTextCreateRequest
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork


def create_file_text_handler(
    data: FileTextCreateRequest, uow: UnitOfWork, current_user: User, sms_service: SMSService
) -> dict:
    with uow:
        data.mobile = helpers.validate_mobile_number(data.mobile)
        sms_service.send_sms(data.mobile, data.text)
        file_text = FileText(
            file_id=data.file_id,
            mobile=data.mobile,
            text=data.text,
            created_by=current_user.id,
        )
        uow.file_texts.add(file_text)
        uow.commit()
        uow.file_texts.refresh(file_text)
        return file_text.dumps()
