from datetime import timedelta

import requests

from core import settings
from core.logger import Logger
from shared.service_layer.services.cache_service import RedisCacheService

logger = Logger("bale_provider")


class BaleProvider:
    cache = RedisCacheService(config=settings.redis_config)
    token_key = "bale_token"

    @classmethod
    def _get_token(cls) -> str | None:
        token = cls.cache.get(key=cls.token_key)
        if token:
            return token
        try:
            data = {
                "client_secret": settings.BALE_CLIENT_SECRET,
                "client_id": settings.BALE_CLIENT_ID,
                "grant_type": "client_credentials",
                "scope": "read",
            }
            response = requests.post(
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                url=settings.bale_urls.auth_token,
                data=data,
            )
            if response.status_code != 200:
                logger.error(
                    f"Failed to get token with status code : {response.status_code} and response : {response.text}"
                )
            token = response.json()["access_token"]
            exp = response.json()["expires_in"]
            cls.cache.set(key=cls.token_key, value=token, exp=timedelta(seconds=exp))
            return token
        except Exception as e:
            logger.error(f"Failed to make request to get bale token with error : {e}")
        return None

    @classmethod
    def send_otp(cls, mobile: str, otp: str) -> None:
        fixed_mobile = "98" + mobile[1:]
        token = cls._get_token()
        if not token:
            logger.error("Failed to get token")
        try:
            payload = {"phone": fixed_mobile, "otp": int(otp)}
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "Content-Type: application/json"}
            response = requests.post(
                url=settings.bale_urls.send_otp,
                json=payload,
                headers=headers,
            )
            if response.status_code != 200:
                logger.error(
                    f"Failed to send otp with status code : {response.status_code} and response : {response.text}"
                )
        except Exception as e:
            logger.error(f"Failed to make request to send bale otp with error : {e}")
