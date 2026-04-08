from datetime import timedelta
from fastapi import Request
from core.helpers import generate_otp, validate_mobile_number
from shared.domain.enums import OtpType
from shared.service_layer.exceptions import OtpRateLimitExceededException
from shared.service_layer.services.cache_service import CacheService, RedisClient
from shared.service_layer.services.voip_otp_service import VoipOtpService



def call_authentication_voip_otp_handler(request: Request, mobile: str, voip_service: VoipOtpService, cache: CacheService) -> None:
    client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "127.0.0.1")
    
    if current_limit := RedisClient.get_value(client_ip):
        if int(current_limit) <= 1:
            raise OtpRateLimitExceededException
    
    validate_mobile = validate_mobile_number(mobile)
    otp = generate_otp(mobile=validate_mobile, otp_type=OtpType.AUTHENTICATION)

    if cache.get(otp.key):
        raise OtpRateLimitExceededException

    voip_service.call_otp(mobile=validate_mobile,otp=otp.value)
    cache.set(key=otp.key, value=otp.value, exp=timedelta(minutes=2))
