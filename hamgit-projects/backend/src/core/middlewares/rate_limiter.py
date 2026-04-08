from functools import wraps

from fastapi import Request

import di
from account.service_layer.dtos import SendAuthenticationOtpDto
from shared.service_layer.exceptions import OtpRateLimitExceededException
from shared.service_layer.services.cache_service import RedisClient
from unit_of_work import SQLAlchemyUnitOfWork


def rate_limiter(limit: int, period: int):
    """
    The decorated function must include -> request: Request
    limit: Number of allowed requests
    period: Duration of restriction in seconds

    @app.get("/ping")
    @rate_limiter(1,5)
    def pong(request: Request):
        return {"ping": "pong!", "env": settings.APP_ENV}
    """

    def decorator(func):
        @wraps(func)
        def wrapper(request: Request, *args, **kwargs):
            client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "127.0.0.1")

            if current_limit := RedisClient.get_value(client_ip):
                if int(current_limit) >= limit:
                    raise OtpRateLimitExceededException
                RedisClient.increment_with_ttl(client_ip, exp=RedisClient.get_ttl(client_ip))  # type: ignore
            else:
                RedisClient.set_value(client_ip, 1, exp=period)
            return func(request, *args, **kwargs)

        return wrapper

    return decorator


def get_allowed_phones() -> list[str]:
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    with uow:
        query_string = """
            SELECT u.mobile
            FROM "account".users u
            WHERE u.roles && ARRAY['SUPERUSER', 'STAFF']::varchar[];
        """
        result = uow.fetchall(query_string)
        return [r["mobile"] for r in result]


def login_rate_limiter(limit: int, period: int):

    def decorator(func):
        @wraps(func)
        def wrapper(request: Request, *args, **kwargs):
            client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "127.0.0.1")

            mobile_data: SendAuthenticationOtpDto | None = kwargs.get("data", None)
            if mobile_data:
                allowed_phones = get_allowed_phones()
                if mobile_data.mobile in allowed_phones:
                    return func(request, *args, **kwargs)

            if current_limit := RedisClient.get_value(client_ip):
                if int(current_limit) >= limit:
                    raise OtpRateLimitExceededException
                RedisClient.increment_with_ttl(
                    client_ip,
                    exp=RedisClient.get_ttl(client_ip),  # type: ignore
                )
            else:
                RedisClient.set_value(client_ip, 1, exp=period)
            return func(request, *args, **kwargs)

        return wrapper

    return decorator


def throttling(limit: int, period: int):
    def decorator(func):
        @wraps(func)
        def wrapper(request: Request, *args, **kwargs):

            if current_limit := RedisClient.get_value(request.url._url):
                if int(current_limit) >= limit:
                    raise OtpRateLimitExceededException
                RedisClient.increment_with_ttl(
                    request.url._url,
                    exp=RedisClient.get_ttl(request.url._url),  # type: ignore
                )
            else:
                RedisClient.set_value(request.url._url, 1, exp=period)
            return func(request, *args, **kwargs)

        return wrapper

    return decorator


def async_rate_limiter(limit: int, period: int):
    """
    The decorated function must include -> request: Request
    limit: Number of allowed requests
    period: Duration of restriction in seconds

    @app.get("/ping")
    @async_rate_limiter(1,5)
    async def pong(request: Request):
        return {"ping": "pong!", "env": settings.APP_ENV}
    """

    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "127.0.0.1")

            if current_limit := RedisClient.get_value(client_ip):
                if int(current_limit) >= limit:
                    raise OtpRateLimitExceededException
                RedisClient.increment_with_ttl(client_ip, exp=RedisClient.get_ttl(client_ip))  # type: ignore
            else:
                RedisClient.set_value(client_ip, 1, exp=period)
            return await func(request, *args, **kwargs)

        return wrapper

    return decorator
