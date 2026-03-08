from datetime import timedelta

from core.helpers import generate_otp, validate_mobile_number
from shared.domain.enums import OtpType
from shared.service_layer.exceptions import OtpRateLimitExceededException
from shared.service_layer.services import SMSService
from shared.service_layer.services.cache_service import CacheService
from shared.service_layer.services.messenger_service import BaleProvider


def send_authentication_otp_handler(mobile: str, sms_service: SMSService, cache: CacheService) -> None:
    validate_mobile = validate_mobile_number(mobile)
    otp = generate_otp(mobile=validate_mobile, otp_type=OtpType.AUTHENTICATION)

    if cache.get(otp.key):
        raise OtpRateLimitExceededException

    sms_service.send_otp(mobile=validate_mobile, otp=otp.value)
    BaleProvider.send_otp(mobile=validate_mobile, otp=otp.value)

    cache.cache_otp(key=otp.key, otp=otp.value)