import requests

from core import settings
from core.logger import Logger

logger = Logger("voip_otp_service")


class VoipOtpService:

    def __init__(self) -> None:
        self.config = settings.voip_config
        self.url_pattern = settings.VOIP_OTP_URL

    def call_otp(self,mobile: str, otp: str) -> None:
        url = self.url_pattern.send_message
        if not url:
            logger.warning("VOIP_OTP_URL is not set, skipping VoIP OTP")
            return

        url = url.format(mobile=mobile, otp=otp, id=self.config.service_id)

        header = {"Authorization": self.config.auth}

        try:
            response = requests.get(url, headers=header, timeout=30)

            if not response.ok:
                logger.error(
                    f"VoIP OTP request failed: status={response.status_code}, response={response.text}"
                )

            else:
                logger.info(f"VoIP OTP sent to {mobile}")

        except Exception as e:
            logger.error(f"Failed to send VoIP OTP to {mobile}: {e}")
