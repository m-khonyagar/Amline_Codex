from core.logger import Logger
from di import get_async_sms_service
from shared.message_schemas import WalletChargeSMSMessage
from shared.service_layer.services.async_sms_service import AsyncSMSService
from shared.service_layer.services.text_generator import TextGenerator

logger = Logger("sms-handler")


async def sms_handler(data: dict):
    sms_service: AsyncSMSService = get_async_sms_service()
    sms = WalletChargeSMSMessage(**data)
    try:
        if sms.custom_message:
            await sms_service.send_sms(
                mobile=sms.mobile,
                message=TextGenerator.text_generator(
                    sms.custom_message, {"amount": sms.charged_amount, "credit": sms.wallet_credit}
                ),
            )
        else:
            await sms_service.send_wallet_charge(
                mobile=sms.mobile, charged_amount=sms.charged_amount, wallet_credit=sms.wallet_credit
            )
        logger.info(f"SMS sent to {data}")
    except Exception as e:
        logger.error(f"Failed to send SMS to {data}: {e}")
        raise
