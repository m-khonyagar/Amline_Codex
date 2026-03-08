from abc import ABC, abstractmethod

from core.logger import Logger
from core.types import KaveNegarConfig
from shared.service_layer.services.async_kavenegar_api import APIException
from shared.service_layer.services.async_kavenegar_api import (
    AsyncKavenegarAPI as KavenegarAPI,
)
from shared.service_layer.services.async_kavenegar_api import HTTPException

logger = Logger("sms-service")


class AsyncSMSService(ABC):

    @abstractmethod
    async def send_sms(self, mobile: str, message: str) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_otp(self, mobile: str, otp: str) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_sign_contract_otp(self, mobile, party_full_name: str, contract_id: int, otp: str) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_invitation_to_landlord(self, tenant_fullname: str, mobile: str, contract_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_invitation_to_tenant(self, landlord_fullname: str, mobile: str, contract_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_counter_party_signed(self, mobile: str, contract_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_counter_party_rejected(self, counter_party_name: str, mobile: str, contract_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_contract_edit_requested(self, current_party_name: str, mobile: str, contract_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_custom_payment(self, mobile: str, invoice_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    async def send_wallet_charge(self, mobile: str, charged_amount: str, wallet_credit: str) -> None:
        raise NotImplementedError


class AsyncKavenegarSMSProvider(AsyncSMSService):

    def __init__(self, config: KaveNegarConfig) -> None:
        self.client = KavenegarAPI(config.api_key)
        self.otp_template = config.otp_template
        self.sign_contact_otp_template = config.sign_contact_otp_template
        self.invitation_to_landlord_template = config.invitation_to_landlord_template
        self.invitation_to_tenant_template = config.invitation_to_tenant_template
        self.counter_party_signed_template = config.counter_party_signed_template
        self.counter_party_rejected_template = config.counter_party_rejected_template
        self.edit_requested_template = config.edit_requested_template
        self.custom_payment_template = config.custom_payment_template
        self.wallet_change_template = config.wallet_charge_template

    async def _send(self, params: dict) -> None:
        try:
            response = await self.client.verify_lookup(params)
            response_status = response[0].get("status")
            logger.warning(f"SMS sent to {params['receptor']} | Status: {response_status}")
        except (APIException, HTTPException) as error:
            logger.error(f"Kavenegar API error: {error}")
            logger.error(f"params: {params}")

    async def send_otp(self, mobile: str, otp: str) -> None:
        params = {"receptor": mobile, "template": self.otp_template, "token": otp, "type": "sms"}
        await self._send(params)

    async def send_sms(self, mobile: str, message: str) -> None:
        await self.client.sms_send(params={"receptor": mobile, "message": message, "sender": "20006535"})

    async def send_sign_contract_otp(
        self,
        mobile,
        party_full_name: str,
        contract_id: int,
        otp: str,
    ) -> None:
        params = {
            "receptor": mobile,
            "template": self.sign_contact_otp_template,
            "token": otp,
            "token2": contract_id,
            "token10": party_full_name,
            "type": "sms",
        }

        await self._send(params)

    async def send_invitation_to_landlord(self, tenant_fullname: str, mobile: str, contract_id: int) -> None:
        params = {
            "receptor": mobile,
            "template": self.invitation_to_landlord_template,
            "token": contract_id,
            "token10": tenant_fullname,
            "type": "sms",
        }
        await self._send(params)

    async def send_invitation_to_tenant(self, landlord_fullname: str, mobile: str, contract_id: int) -> None:
        params = {
            "receptor": mobile,
            "template": self.invitation_to_tenant_template,
            "token": contract_id,
            "token10": landlord_fullname,
            "type": "sms",
        }
        await self._send(params)

    async def send_counter_party_signed(self, mobile: str, contract_id: int) -> None:
        params = {
            "receptor": mobile,
            "template": self.counter_party_signed_template,
            "token": contract_id,
            "type": "sms",
        }
        await self._send(params)

    async def send_counter_party_rejected(self, counter_party_name: str, mobile: str, contract_id: int) -> None:
        params = {
            "receptor": mobile,
            "template": self.counter_party_rejected_template,
            "token": contract_id,
            "token10": counter_party_name,
            "type": "sms",
        }
        await self._send(params)

    async def send_contract_edit_requested(self, current_party_name: str, mobile: str, contract_id: int) -> None:
        params = {
            "receptor": mobile,
            "template": self.edit_requested_template,
            "token": contract_id,
            "token10": current_party_name,
            "type": "sms",
        }
        await self._send(params)

    async def send_custom_payment(self, mobile: str, invoice_id: int) -> None:
        params = {
            "receptor": mobile,
            "template": self.custom_payment_template,
            "token": invoice_id,
            "type": "sms",
        }
        await self._send(params)

    async def send_wallet_charge(self, mobile: str, charged_amount: str, wallet_credit: str) -> None:
        params = {
            "receptor": mobile,
            "template": self.wallet_change_template,
            "token": charged_amount,
            "token2": wallet_credit,
            "type": "sms",
        }
        await self._send(params)
