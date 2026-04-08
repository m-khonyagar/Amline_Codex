from urllib.parse import quote

import requests

from core import settings
from core.logger import Logger
from shared.domain.enums import SMSTemplates
from shared.service_layer.services.sms_service import SMSService

logger = Logger("sms-service-tsms")


class TSMSProvider(SMSService):

    def __init__(self) -> None:
        self.username = settings.tsms_config.username
        self.password = settings.tsms_config.password
        self.sender_number = settings.tsms_config.sender_number
        self.ding_sender_number = settings.tsms_config.ding_sender_number
        self.send_sms_url = settings.tsms_urls.send_message

    def _send(self, mobile: str, message: str, is_ding: bool = False) -> bool:
        sender_number = self.ding_sender_number if is_ding else self.sender_number
        url = self.send_sms_url.format(
            username=self.username,
            password=self.password,
            sender_number=sender_number,
            mobile=mobile,
            text_message=quote(message),
        )
        try:
            response = requests.get(url)
            response_text = int(response.text)
            if response_text in tsms_errors.keys():
                logger.error(f"Failed to send sms with error message : {tsms_errors[response_text]}")
                return False
            return True
        except Exception as e:
            logger.error(f"Failed to send sms with error : {e}")
            return False

    def send_sms(self, mobile: str, message: str) -> bool:
        return self._send(mobile, message)

    def send_ding_sms(self, mobile: str, message: str) -> bool:
        return self._send(mobile, message, is_ding=True)

    def send_sms_with_pattern(self, mobile: str, pattern: SMSTemplates, params: dict) -> bool:
        text_message = pattern.text.format(**params)
        return self._send(mobile, text_message)


tsms_errors = {
    1: "tsms server error",
    2: "sms text error",
    3: "phone number error",
    4: "variables error",
    5: "empty text error",
    6: "empty phone number error",
    7: "wrong username or password error",
    8: "sms server error",
    9: "service is disabled error",
    14: "not enough balance error",
}
