from account.domain.entities.user import User
from account.domain.enums import UserRole
from account.entrypoints.request_models import RealtorRegisterRequest
from core.exceptions import ValidationException
from crm.domain.entities.realtor_file import RealtorFile
from shared.service_layer.services.user_verifier_service import UserVerifierService
from unit_of_work import UnitOfWork


def verify_user_info(uow: UnitOfWork, verifier: UserVerifierService, data: RealtorRegisterRequest) -> User:
    user = uow.users.get_by_mobile(mobile=data.mobile)
    uow.files.get_or_raise(id=data.avatar_file_id)
    if not user:
        user = User(mobile=data.mobile)
        uow.users.add(user)

    if not user.is_verified:
        verified_data = verifier.verify_user_info(
            mobile=data.mobile, national_code=data.national_code, birth_date=data.birth_date
        )
        user.update(**verified_data)

    elif user.national_code != data.national_code or user.birth_date != data.birth_date:
        raise ValidationException("کد ملی یا تاریخ تولد با شماره موبایل مطابقت ندارد.")

    user.update(address=data.address, avatar_file_id=data.avatar_file_id)
    user.add_role(UserRole.CONTRACT_ADMIN)
    return user


def realtor_register_handler(uow: UnitOfWork, data: RealtorRegisterRequest, verifier: UserVerifierService):
    with uow:
        user = verify_user_info(uow=uow, verifier=verifier, data=data)
        realtor_file = uow.realtor_files.get(mobile=data.mobile)
        if not realtor_file:
            realtor_file = RealtorFile(mobile=data.mobile, created_by=user.id)
        realtor_file.update(**data.model_dump())
        uow.users.add(user)
        uow.realtor_files.add(realtor_file)
        uow.commit()
        return dict(user=user.dumps(), realtor_file=realtor_file.dumps())
