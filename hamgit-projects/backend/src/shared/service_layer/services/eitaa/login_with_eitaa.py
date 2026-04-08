from account.service_layer.handlers.verify_authentication_otp import (
    create_token,
    user_from_mobile,
)
from account.service_layer.services.token_service import TokenService
from shared.service_layer.services.eitaa.hash_verifier import verify_hash
from unit_of_work import UnitOfWork


def login_with_eitaa_handler(uow: UnitOfWork, token_service: TokenService, data: str):
    mobile, eitaa_user_id = verify_hash(data)
    user = user_from_mobile(mobile=mobile, uow=uow, eitaa_user_id=eitaa_user_id)
    token = create_token(user_id=user.id, token_service=token_service)
    return token


def login_with_eitaa_user_id_handler(uow: UnitOfWork, token_service: TokenService, eitaa_user_id: str):
    with uow:
        user = uow.users.get_or_raise(eitaa_user_id=eitaa_user_id)
        token = create_token(user_id=user.id, token_service=token_service)
        return token
