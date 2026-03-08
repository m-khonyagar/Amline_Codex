from core.logger import Logger
from di import get_sms_service
from financial.service_layer.events import SendWalletChargeMessageEvent
from shared.service_layer.services.sms_service import SMSService

logger = Logger("sms-handler")


async def send_wallet_charge_message_event_handler(event: SendWalletChargeMessageEvent):
    sms_service: SMSService = get_sms_service()
    try:
        if event.custom_message:
            sms_service.send_sms(
                mobile=event.mobile,
                message=event.custom_message.format(amount=event.charged_amount, credit=event.wallet_credit),
            )
        else:
            sms_service.send_wallet_charge(
                mobile=event.mobile, charged_amount=event.charged_amount, wallet_credit=event.wallet_credit
            )
        logger.info(f"SMS sent to {event.dumps()}")
    except Exception as e:
        logger.error(f"Failed to send SMS to {event.dumps()}: {e}")
        return
