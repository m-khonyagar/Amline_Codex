from core.logger import Logger
from shared.domain.enums import SMSTemplates
from shared.service_layer.services.sms_service import SMSService
from shared.service_layer.services.tsms_provider import TSMSProvider

logger = Logger("multi-provider-sms-service")


class MultiProviderSMSService(SMSService):
    def __init__(self, sms_services: list[SMSService]) -> None:
        self.sms_services = sms_services

    def send_sms(self, mobile: str, message: str) -> bool:
        for provider in self.sms_services:
            if provider.send_sms(mobile, message):
                logger.info(f"SMS sent to {mobile} with {provider.__class__.__name__} provider")
                return True
        logger.error(f"SMS not sent to {mobile}")
        return False

    def send_ding_sms(self, mobile: str, message: str) -> bool:
        tsms_provider = next((provider for provider in self.sms_services if isinstance(provider, TSMSProvider)), None)
        if tsms_provider:
            return tsms_provider.send_ding_sms(mobile, message)
        return False

    def send_sms_with_pattern(self, mobile: str, pattern: SMSTemplates, params: dict) -> bool:        
        for provider in self.sms_services:
            if provider.send_sms_with_pattern(mobile, pattern, params):
                logger.info(f"SMS sent to {mobile} with {provider.__class__.__name__} provider")
                print(f"SMS sent to {mobile} with {provider.__class__.__name__} provider")  # temp
                return True
        logger.error(f"SMS not sent to {mobile}")
        return False
