from account.service_layer.services.token_service import TokenService


def revoke_user_tokens_handler(authorization_header: str | None, token_service: TokenService) -> None:
    access_token = token_service.extract_token_from_authorization_header(authorization_header)
    token_service.revoke_access_token(access_token)
