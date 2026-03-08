from contract.service_layer.handlers.admin_delete_contract import (
    delete_contract_handler,
)
from contract.service_layer.handlers.send_custom_payment_link import (
    send_custom_payment_link_handler,
)

from .add_prcontract_counter_party import add_prcontract_counter_party_handler
from .add_prcontract_party import add_prcontract_party_handler
from .admin_generate_prcontract_commissions import (
    admin_generate_prcontract_commissions_handler,
)
from .admin_start_contract import admin_start_contract_handler
from .admin_upsert_prcontract_party_accounts import (
    admin_upsert_prcontract_party_accounts_handler,
)
from .base_contract_clauses.create_base_contract_clauses import (
    create_base_contract_clauses_handler,
)
from .base_contract_clauses.read_base_contract_clauses import (
    read_base_contract_clauses_handler,
)
from .base_contract_clauses.update_base_contract_clauses import (
    update_base_contract_clauses_handler,
)
from .calculate_rent_commission import calculate_rent_commission_handler
from .calculate_sale_commission import calculate_sale_commission_handler
from .create_contract_clause import create_contract_clause_handler
from .create_contract_description import create_contract_description_handler
from .create_prcontract import create_prcontract_handler
from .create_prcontract_cash_payment import create_prcontract_cash_payment_handler
from .create_prcontract_cheque_payment import create_prcontract_cheque_payment_handler
from .create_prcontract_monthly_rent_payment import (
    create_prcontract_monthly_rent_payment_handler,
)
from .create_prcontract_payment import create_prcontract_payment_handler
from .create_prcontract_property import create_prcontract_property_handler
from .delete_contract_clause import delete_contract_clause_handler
from .delete_prcontract_payment import delete_prcontract_payment_handler
from .delete_prcontract_payments import delete_prcontract_payments_handler
from .finalize_prcontract_payment import finalize_prcontract_payment_handler
from .generate_contract_pdf import generate_contract_pdf_handler
from .get_contract_descriptions import get_contract_descriptions_handler
from .mark_contract_payment_as_paid import mark_contract_payment_as_paid_handler
from .party_signature import (
    confirm_contract_sign_otp_handler,
    send_contract_sign_otp_handler,
    sign_contract_for_party_handler,
)
from .payee_confirmed_receipt import payee_confirmed_receipt_handler
from .payee_denied_receipt import payee_denied_receipt_handler
from .payer_claimed_to_have_paid import payer_claimed_to_have_paid_handler
from .prcontract_edit_request import prcontract_edit_request_handler
from .property.upsert_prcontract_property_details import (
    upsert_prcontract_property_details_handler,
)
from .property.upsert_prcontract_property_facilities import (
    upsert_prcontract_property_facilities_handler,
)
from .property.upsert_prcontract_property_specifications import (
    upsert_prcontract_property_specifications_handler,
)
from .realtor_start_contract import realtor_start_contract_handler
from .refer_prcontract_to_parties import refer_prcontract_to_parties_handler
from .reject_prcontract import reject_prcontract_handler
from .send_prcontract_otp_sign import (
    send_prcontract_otp_sign_handler ,
    call_prcontract__voip_otp_sign_handler
    )
from .start_contract import start_contract_handler
from .tenant_approve_prcontract import tenant_approve_prcontract_handler
from .update_contract_clause import update_contract_clause_handler
from .update_contract_party import update_contract_party_handler
from .update_prcontract_cash_payment import update_prcontract_cash_payment_handler
from .update_prcontract_cheque_payment import update_prcontract_cheque_payment_handler
from .update_prcontract_dates_and_penalties import (
    update_prcontract_dates_and_penalties_handler,
)
from .update_prcontract_deposit import update_prcontract_deposit_handler
from .update_prcontract_details import update_prcontract_details_handler
from .update_prcontract_monthly_rent import update_prcontract_monthly_rent_handler
from .update_prcontract_payment import update_prcontract_payment_handler
from .update_prcontract_property import update_prcontract_property_handler
from .update_prcontract_status import update_prcontract_status_handler
from .update_prcontract_tracking_code import update_prcontract_tracking_code_handler
from .upsert_prcontract_landlord_information import (
    upsert_prcontract_landlord_information_handler,
)
from .upsert_prcontract_tenant_information import (
    upsert_prcontract_tenant_information_handler,
)
from .verify_prcontract_otp_sign import verify_prcontract_otp_sign_handler

__all__ = [
    "start_contract_handler",
    "admin_start_contract_handler",
    "admin_upsert_prcontract_party_accounts_handler",
    "admin_generate_prcontract_commissions_handler",
    "add_prcontract_party_handler",
    "upsert_prcontract_tenant_information_handler",
    "add_prcontract_counter_party_handler",
    "update_prcontract_dates_and_penalties_handler",
    "upsert_prcontract_landlord_information_handler",
    "update_prcontract_monthly_rent_handler",
    "update_prcontract_deposit_handler",
    "create_contract_clause_handler",
    "reject_prcontract_handler",
    "send_prcontract_otp_sign_handler",
    "verify_prcontract_otp_sign_handler",
    "realtor_start_contract_handler",
    "tenant_approve_prcontract_handler",
    "update_contract_clause_handler",
    "delete_contract_clause_handler",
    "create_prcontract_cash_payment_handler",
    "create_prcontract_cheque_payment_handler",
    "update_prcontract_cash_payment_handler",
    "update_prcontract_cheque_payment_handler",
    "finalize_prcontract_payment_handler",
    "delete_prcontract_payment_handler",
    "create_prcontract_monthly_rent_payment_handler",
    "delete_prcontract_payments_handler",
    "payee_confirmed_receipt_handler",
    "payee_denied_receipt_handler",
    "payer_claimed_to_have_paid_handler",
    "prcontract_edit_request_handler",
    "calculate_rent_commission_handler",
    "calculate_sale_commission_handler",
    "update_prcontract_status_handler",
    "update_prcontract_tracking_code_handler",
    "update_prcontract_details_handler",
    "generate_contract_pdf_handler",
    "update_prcontract_property_handler",
    "update_prcontract_payment_handler",
    "create_prcontract_payment_handler",
    "update_contract_party_handler",
    "create_prcontract_handler",
    "create_prcontract_property_handler",
    "send_contract_sign_otp_handler",
    "confirm_contract_sign_otp_handler",
    "sign_contract_for_party_handler",
    "refer_prcontract_to_parties_handler",
    "delete_contract_handler",
    "mark_contract_payment_as_paid_handler",
    "send_custom_payment_link_handler",
    "upsert_prcontract_property_specifications_handler",
    "upsert_prcontract_property_details_handler",
    "upsert_prcontract_property_facilities_handler",
    "create_base_contract_clauses_handler",
    "update_base_contract_clauses_handler",
    "read_base_contract_clauses_handler",
    "create_contract_description_handler",
    "get_contract_descriptions_handler",
    "call_prcontract__voip_otp_sign_handler"
]
