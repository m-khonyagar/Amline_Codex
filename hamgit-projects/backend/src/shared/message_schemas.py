from pydantic import BaseModel


class WalletChargeSMSMessage(BaseModel):
    mobile: str
    charged_amount: str
    wallet_credit: str
    custom_message: str | None = None
