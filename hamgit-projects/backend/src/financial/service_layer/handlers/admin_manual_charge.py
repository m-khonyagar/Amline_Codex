from fastapi import BackgroundTasks, UploadFile

from account.domain.entities import User
from core import helpers
from core.exceptions import ValidationException
from core.types import CurrentUser
from financial.domain.entities.wallet import Wallet
from financial.domain.entities.wallet_transaction import WalletTransaction
from financial.domain.enums import WalletTransactionCategory
from financial.entrypoints.request_models import WalletManualChargeRequest
from financial.service_layer.event_handlers.send_wallet_charge_message import (
    send_wallet_charge_message_event_handler,
)
from financial.service_layer.events import SendWalletChargeMessageEvent
from shared.service_layer.services.file_reader import FileReader
from unit_of_work import UnitOfWork


def manual_wallet_charge(
    mobile: str,
    amount: int,
    current_user: CurrentUser,
    uow: UnitOfWork,
    sms_list: list,
    custom_message: str | None = None,
):
    validated_mobile = helpers.validate_mobile_number(mobile)

    user = uow.users.get_by_mobile(mobile=validated_mobile)

    if not user:
        user = User(mobile=validated_mobile)
        uow.users.add(user)

    wallet = uow.wallets.get(user_id=user.id)

    if not wallet:
        if amount <= 0:
            raise ValidationException("Credit to add must be positive")

        wallet = Wallet(
            credit=amount,
            user_id=user.id,
            created_by=current_user.id,
            updated_by=current_user.id,
        )

        uow.wallets.add(wallet)
    else:
        if amount > 0:
            wallet.add_credit(amount)
        else:
            wallet.withdraw_credit(amount * -1)

    wallet_transaction = WalletTransaction(amount, wallet.id, WalletTransactionCategory.MANUAL_CHARGE)
    uow.wallet_transactions.add(wallet_transaction)

    sms_list.append(
        SendWalletChargeMessageEvent(
            mobile=validated_mobile,
            charged_amount=f"{amount:,}",
            wallet_credit=f"{wallet.credit:,}",
            custom_message=custom_message,
        )
    )

    return wallet.dumps()


async def admin_manual_charge_handler(
    data: WalletManualChargeRequest, current_user: CurrentUser, uow: UnitOfWork, bg_tasks: BackgroundTasks
):
    with uow:
        sms_list: list[SendWalletChargeMessageEvent] = []
        result = manual_wallet_charge(data.mobile, data.amount, current_user, uow, sms_list, data.text_message)
        uow.commit()
        for sms in sms_list:
            bg_tasks.add_task(send_wallet_charge_message_event_handler, event=sms)
        return result


async def admin_bulk_manual_charge_handler(
    file: UploadFile,
    text_message: str | None,
    current_user: CurrentUser,
    uow: UnitOfWork,
    bg_tasks: BackgroundTasks,
):
    data = await FileReader.excel(file)
    if not data:
        raise ValidationException("File is empty or invalid")
    with uow:
        sms_list: list[SendWalletChargeMessageEvent] = []
        results = []
        for row in data:
            result = manual_wallet_charge(
                str(row["mobile"]),
                row["amount"],
                current_user,
                uow,
                sms_list,
                text_message,
            )
            results.append(result)
        uow.commit()
        for sms in sms_list:
            bg_tasks.add_task(send_wallet_charge_message_event_handler, event=sms)
        return results
