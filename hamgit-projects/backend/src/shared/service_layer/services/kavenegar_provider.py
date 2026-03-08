from kavenegar import APIException, HTTPException, KavenegarAPI

from core import settings
from core.logger import Logger
from shared.domain.enums import SMSTemplates
from shared.service_layer.services.sms_service import SMSService

logger = Logger("sms-service-kavenegar")


class KavenegarSMSProvider(SMSService):

    def __init__(self) -> None:
        self.client = KavenegarAPI(settings.kavenegar_config.api_key)

    def send_sms(self, mobile: str, message: str) -> bool:
        return False

    def send_ding_sms(self, mobile: str, message: str) -> bool:
        return False

    def send_sms_with_pattern(self, mobile: str, pattern: SMSTemplates, params: dict) -> bool:
        updated_params = params.copy()
        updated_params.update({"receptor": mobile, "template": pattern.key, "type": "sms"})
        try:
            response = self.client.verify_lookup(updated_params)
            response_status = response[0].get("status")
            logger.warning(f"SMS sent to {updated_params['receptor']} | Status: {response_status}")
            return True
        except (APIException, HTTPException) as error:
            logger.error(f"Kavenegar API error: {error}")
            logger.error(f"params: {updated_params}")
            return False
