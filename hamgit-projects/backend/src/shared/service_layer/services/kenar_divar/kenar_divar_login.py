import requests  # type: ignore

from account.service_layer.handlers.verify_authentication_otp import (
    verify_divar_authentication_handler,
)
from account.service_layer.services.token_service import TokenService
from core import helpers, settings
from core.exceptions import ProcessingException
from shared.entrypoints.request_models import KenarDivarLoginRequest
from unit_of_work import UnitOfWork


def get_access_token_handler(data: KenarDivarLoginRequest):
    response = requests.post(
        settings.kenar_divar_urls.user_token,
        data={
            "code": data.code,
            "client_id": settings.KENAR_DIVAR_APP_SLUG,
            "client_secret": settings.KENAR_DIVAR_CLIENT_SECRET,
            "redirect_uri": data.redirect_url,
            "grant_type": "authorization_code",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    if response.status_code != 200:
        raise ProcessingException(
            detail=f"Failed to fetch Kenar Divar access token {response.status_code} - {response.text}"
        )
    return response.json().get("access_token")


def get_user_info_handler(access_token: str):
    response = requests.post(
        settings.kenar_divar_urls.user_info,
        json={},
        headers={
            "Content-Type": "application/json",
            "x-api-key": settings.KENAR_DIVAR_API_KEY,
            "Authorization": f"Bearer {access_token}",
        },
    )
    if response.status_code != 200:
        raise ProcessingException(
            detail=f"Failed to fetch Kenar Divar user info {response.status_code} - {response.text}"
        )
    return response.json()


def kenar_divar_login_handler(data: KenarDivarLoginRequest, uow: UnitOfWork, token_service: TokenService):
    access_token = get_access_token_handler(data)
    user_info = get_user_info_handler(access_token)
    validated_mobile = helpers.validate_mobile_number(user_info.get("phone_number", "0"))
    return verify_divar_authentication_handler(uow=uow, token_service=token_service, mobile=validated_mobile)
