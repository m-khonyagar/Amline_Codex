from account.domain.entities.user import User
from account.domain.entities.user_text import UserText
from account.domain.enums import UserTextSender
from account.entrypoints.request_models import UserTextCreateRequest
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork


def create_user_text_handler(
    data: UserTextCreateRequest, uow: UnitOfWork, current_user: User, sms_service: SMSService
) -> dict:
    with uow:
        user = uow.users.get_or_raise(id=data.user_id)
        user_text = UserText(
            user_id=user.id,
            text=data.text,
            sender=data.sender,
            created_by=current_user.id,
        )
        if data.sender == UserTextSender.SMS:
            sms_service.send_sms(user.mobile, data.text)
        if data.sender == UserTextSender.DING:
            sms_service.send_ding_sms(user.mobile, data.text)

        uow.user_texts.add(user_text)
        uow.commit()
        uow.user_texts.refresh(user_text)
        return user_text.dumps()
