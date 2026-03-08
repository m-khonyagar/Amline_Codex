from abc import ABC, abstractmethod

from core.logger import Logger
from shared.domain.enums import SMSTemplates

logger = Logger("sms-service")


class SMSService(ABC):

    @abstractmethod
    def send_sms(self, mobile: str, message: str) -> bool:
        raise NotImplementedError

    @abstractmethod
    def send_ding_sms(self, mobile: str, message: str) -> bool:
        raise NotImplementedError

    @abstractmethod
    def send_sms_with_pattern(self, mobile: str, pattern: SMSTemplates, params: dict) -> bool:
        raise NotImplementedError

    def send_otp(self, mobile: str, otp: str) -> bool:
        params = {"token": otp}
        return self.send_sms_with_pattern(mobile=mobile, pattern=SMSTemplates.OTP_TEMPLATE, params=params)

    def send_sign_contract_otp(self, mobile: str, party_full_name: str, contract_id: int, otp: str) -> bool:
        params = {"token": otp, "token2": contract_id, "token10": party_full_name}
        return self.send_sms_with_pattern(mobile=mobile, pattern=SMSTemplates.SIGN_CONTRACT_OTP_TEMPLATE, params=params)

    def send_invitation_to_landlord(self, mobile: str, tenant_fullname: str, contract_id: int) -> bool:
        params = {"token": contract_id, "token10": tenant_fullname}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.INVITATION_TO_LANDLORD_TEMPLATE, params=params
        )

    def send_invitation_to_tenant(self, mobile: str, landlord_fullname: str, contract_id: int) -> bool:
        params = {"token": contract_id, "token10": landlord_fullname}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.INVITATION_TO_TENANT_TEMPLATE, params=params
        )

    def send_counter_party_signed(self, mobile: str, contract_id: int) -> bool:
        params = {"token": contract_id}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.COUNTER_PARTY_SIGNED_TEMPLATE, params=params
        )

    def send_counter_party_rejected(self, counter_party_name: str, mobile: str, contract_id: int) -> bool:
        params = {"token": contract_id, "token10": counter_party_name}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.COUNTER_PARTY_REJECTED_TEMPLATE, params=params
        )

    def send_contract_edit_requested(self, current_party_name: str, mobile: str, contract_id: int) -> bool:
        params = {"token": contract_id, "token10": current_party_name}
        return self.send_sms_with_pattern(mobile=mobile, pattern=SMSTemplates.EDIT_REQUESTED_TEMPLATE, params=params)

    def send_custom_payment(self, mobile: str, invoice_id: int) -> bool:
        params = {"token": invoice_id}
        return self.send_sms_with_pattern(mobile=mobile, pattern=SMSTemplates.CUSTOM_PAYMENT_TEMPLATE, params=params)

    def send_wallet_charge(self, mobile: str, charged_amount: str, wallet_credit: str) -> bool:
        params = {"token": charged_amount, "token2": wallet_credit}
        return self.send_sms_with_pattern(mobile=mobile, pattern=SMSTemplates.WALLET_CHARGE_TEMPLATE, params=params)

    def send_invoice_link(self, mobile: str, payment_type: str, link: str, amount: str) -> bool:
        params = {"token": payment_type, "token2": amount, "token3": link}
        return self.send_sms_with_pattern(mobile=mobile, pattern=SMSTemplates.INVOICE_LINK_TEMPLATE, params=params)

    def send_payment_before_alert(self, mobile: str, amount: str, type: str, link: str, due_date: str) -> bool:
        params = {"token": due_date, "token2": amount, "token3": link, "token4": type}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.PAYMENT_BEFORE_ALERT_TEMPLATE, params=params
        )

    def send_payment_before_alert_regular_contract(
        self, mobile: str, amount: str, type: str, link: str, due_date: str
    ) -> bool:
        params = {"token": due_date, "token2": amount, "token3": link, "token4": type}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.PAYMENT_BEFORE_ALERT_REGULAR_CONTRACT_TEMPLATE, params=params
        )

    def send_payment_after_alert(self, mobile: str, type: str, link: str) -> bool:
        params = {"token3": link, "token4": type}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.PAYMENT_AFTER_ALERT_TEMPLATE, params=params
        )

    def send_both_commissions_paid(self, mobile: str, contract_id: str, link: str) -> bool:
        params = {"token": contract_id, "token2": link}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.BOTH_COMMISSIONS_PAID_TEMPLATE, params=params
        )

    def send_landlord_commission_paid(self, mobile: str, contract_id: str, link: str) -> bool:
        params = {"token": contract_id, "token2": link}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.LANDLORD_COMMISSION_PAID_TEMPLATE, params=params
        )

    def send_tenant_commission_paid(self, mobile: str, contract_id: str, link: str) -> bool:
        params = {"token": contract_id, "token2": link}
        return self.send_sms_with_pattern(
            mobile=mobile, pattern=SMSTemplates.TENANT_COMMISSION_PAID_TEMPLATE, params=params
        )
