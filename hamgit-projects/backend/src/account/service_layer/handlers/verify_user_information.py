from account.service_layer.dtos import VerifyUserInformationDto
from core.exceptions import BadRequestException
from shared.service_layer.services.user_verifier_service import UserVerifierService
from unit_of_work import UnitOfWork


def verify_user_information_handler(data: VerifyUserInformationDto, uow: UnitOfWork, verifier: UserVerifierService):
    with uow:
        user = uow.users.get_or_raise(mobile=data.mobile)
        if data.without_verifying:
            user.is_verified = True
        elif data.birth_date and data.national_code:
            verified_data = verifier.verify_user_info(
                mobile=data.mobile, national_code=data.national_code, birth_date=data.birth_date
            )
            user.update(**verified_data)
        else:
            raise BadRequestException(detail="invalid data")
        uow.commit()
        uow.users.refresh(user)
        return user
