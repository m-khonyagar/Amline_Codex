from requests import Session
from core import settings

from account.domain.entities.user import User
from contract.domain.entities.contract_party import ContractParty
from contract.domain.enums import PartyType as PartyTypeEnum

from shared.domain.enums import EitaaTemplates, PartyType


session = Session()


def notify_signs(contract_party: ContractParty, user: User) -> None:
    if settings.EITAA_YAR_TOKEN and settings.EITAA_SIGN_NOTIFY_CHANNEL.isdecimal():
        session.post(
            f"https://eitaayar.ir/api/bot{settings.EITAA_YAR_TOKEN}/sendMessage",
            data={
                "chat_id": int(settings.EITAA_SIGN_NOTIFY_CHANNEL),
                "title": EitaaTemplates.EITAA_YAR_INFORMING_TITLE.text.format(
                    contract_id=contract_party.contract_id
                ),
                "text": EitaaTemplates.EITAA_YAR_INFORMING_TEXT.text.format(
                    contract_id=contract_party.contract_id,
                    contract_party=(
                        PartyType.LANDLORD if contract_party.party_type == PartyTypeEnum.LANDLORD else PartyType.TENANT
                    ).text,
                    signature_type=contract_party.signature_type,
                    user_full_name=user.fullname,
                    user_mobile=user.mobile,
                ),
                "parse_mode": "html"
            }
        )
