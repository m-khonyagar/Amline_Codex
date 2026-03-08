from concurrent.futures import ThreadPoolExecutor

from shared.domain.enums import SMSTemplates
from shared.service_layer.services.sms_service import SMSService



def send_reminder(users: list[tuple[str, str]], sms_service: SMSService) -> None:
    with ThreadPoolExecutor(max_workers=4) as exe:
        for contract_id, user_mobile in users:
            exe.submit(
                sms_service.send_sms,
                user_mobile,
                SMSTemplates.CONTRACT_REMINDER.text.format(
                    contract_id=contract_id
                )
            )