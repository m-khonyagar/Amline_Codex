from fastapi import APIRouter, BackgroundTasks, Depends, Query

import di
from contract.domain.enums import (
    PartyType,
    PaymentSide,
    PaymentStatus,
    PRContractPaymentType,
)
from contract.domain.events import (
    ContractPaymentsCompletedEvent,
    TenantSignedContractEvent,
)
from contract.entrypoints import response_models, views
from contract.service_layer import dtos, event_handlers, handlers
from contract.service_layer.event_handlers import tenant_signed_event_handler
from contract.service_layer.handlers.invoice.create_invoice_manually import (
    create_invoice_manually_handler,
)
from core.translates import expressions_trans
from core.types import OperationResult
from shared.service_layer.services.eitaa.notify_signs import notify_signs
from shared.entrypoints.response_models import FileResponseModel, PropertyResponse

router = APIRouter(prefix="/pr-contracts", tags=["property rental contracts"])


@router.get("/{contract_id}", response_model=response_models.PRContractsResponse)
def get_prcontract_detail(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    monthly_rent_service=Depends(di.get_monthly_rent_service),
):
    return views.get_prcontract_detail_view(contract_id, current_user, uow, prc_service, monthly_rent_service)


@router.delete("/{contract_id}/reject", response_model=response_models.ContractResponse)
def reject_prcontract(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    sms_service=Depends(di.get_sms_service),
):
    return handlers.reject_prcontract_handler(
        contract_id=contract_id, user=current_user, uow=uow, prc_service=prc_service, sms_service=sms_service
    ).dumps()


@router.patch("/{contract_id}/edit-request")
def edit_prcontract_request(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    sms_service=Depends(di.get_sms_service),
):
    handlers.prcontract_edit_request_handler(
        contract_id=contract_id, user=current_user, uow=uow, prc_service=prc_service, sms_service=sms_service
    )


@router.get("/{contract_id}/status", response_model=response_models.PRContractStatusResponse)
def get_prcontract_status(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return views.get_prcontract_status_view(
        contract_id=contract_id, user=current_user, uow=uow, prc_service=prc_service
    )


@router.patch("/{contract_id}/dates-and-penalties", response_model=response_models.PRContractsResponse)
def update_prcontract_dates_and_penalties(
    contract_id: int,
    data: dtos.UpdatePRContractDatesAndPenaltiesDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    invoice_service=Depends(di.get_invoice_service),
    monthly_rent_service=Depends(di.get_monthly_rent_service),
):
    return handlers.update_prcontract_dates_and_penalties_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        uow=uow,
        prc_service=prc_service,
        invoice_service=invoice_service,
        monthly_rent_service=monthly_rent_service,
    ).dumps()


@router.patch("/{contract_id}/deposit", response_model=response_models.PRContractsResponse)
def update_prcontract_deposit(
    contract_id: int,
    data: dtos.UpdatePrContractDepositDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.update_prcontract_deposit_handler(
        contract_id=contract_id, data=data, user=current_user, uow=uow, prc_service=prc_service
    ).dumps()


@router.patch("/{contract_id}/monthly-rent", response_model=response_models.PRContractsResponse)
def update_prcontract_monthly_rent(
    contract_id: int,
    data: dtos.UpdatePRContractMonthlyRentDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    monthly_rent_service=Depends(di.get_monthly_rent_service),
):
    return handlers.update_prcontract_monthly_rent_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        uow=uow,
        prc_service=prc_service,
        monthly_rent_service=monthly_rent_service,
    ).dumps()


@router.put("/{contract_id}/parties/tenant", response_model=response_models.ContractPartyResponse)
def upsert_prcontract_tenant_information(
    contract_id: int,
    data: dtos.UpsertPRContractTenantDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    user_verification_service=Depends(di.get_user_verifier_service),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.upsert_prcontract_tenant_information_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        uow=uow,
        user_verifier_service=user_verification_service,
        prc_service=prc_service,
    ).dumps()


@router.get("/{contract_id}/parties/tenant", response_model=response_models.PRContractTenantResponse)
def get_prcontract_tenant_information(
    contract_id: int, current_user=Depends(di.get_current_user), uow=Depends(di.get_uow)
):
    return views.get_prcontract_tenant_view(contract_id, current_user, uow)


@router.post("/{contract_id}/tenant-approve", response_model=OperationResult)
def tenant_approve_prcontract(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    prc_service=Depends(di.get_prcontract_service),
    uow=Depends(di.get_uow),
    sms_service=Depends(di.get_sms_service),
):
    handlers.tenant_approve_prcontract_handler(
        contract_id=contract_id,
        uow=uow,
        sms_service=sms_service,
        prc_service=prc_service,
        user=current_user,
    )
    return OperationResult(success=True, message=expressions_trans.APPROVEMENT_SENT_TO_LANDLORD)


@router.put("/{contract_id}/parties/landlord", response_model=response_models.PRContractLandlordResponse)
def upsert_prcontract_landlord_information(
    contract_id: int,
    data: dtos.UpsertPRContractLandlordDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    user_verification_service=Depends(di.get_user_verifier_service),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.upsert_prcontract_landlord_information_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        uow=uow,
        user_verifier_service=user_verification_service,
        prc_service=prc_service,
    )


@router.get("/{contract_id}/parties/landlord", response_model=response_models.PRContractLandlordResponse)
def get_prcontract_landlord_information(
    contract_id: int, current_user=Depends(di.get_current_user), uow=Depends(di.get_uow)
):
    return views.get_prcontract_landlord_view(contract_id, current_user, uow)


@router.post("/{contract_id}/counter-party", response_model=response_models.PRContractCounterPartyResponse)
def add_prcontract_counter_party(
    contract_id: int,
    data: dtos.AddPRContractCounterPartyDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    user_verification_service=Depends(di.get_user_verifier_service),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.add_prcontract_counter_party_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        uow=uow,
        user_verifier_service=user_verification_service,
        prc_service=prc_service,
    )


@router.get("/{contract_id}/counter-party", response_model=response_models.PRContractCounterPartyResponse)
def get_prcontract_counter_party(contract_id: int, current_user=Depends(di.get_current_user), uow=Depends(di.get_uow)):
    return views.get_prcontract_counter_party_view(contract_id, current_user, uow)


@router.get("/{contract_id}/parties", response_model=list[response_models.ContractPartyROMResponse])
def get_prcontract_parties(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return views.get_prcontract_parties_view(contract_id, current_user, uow)


@router.post("/{contract_id}/parties/otp-sign/send", response_model=OperationResult)
def send_prcontract_otp_sign(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    cache_service=Depends(di.get_cache_service),
    sms_service=Depends(di.get_sms_service),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    handlers.send_prcontract_otp_sign_handler(
        contract_id=contract_id,
        user=current_user,
        cache_service=cache_service,
        sms_service=sms_service,
        uow=uow,
        prc_service=prc_service,
    )

    return OperationResult(success=True, message="opt_sent")


@router.post("/{contract_id}/parties/voip-otp-sign/called", response_model=OperationResult)
def call_prcontract_voip_otp_sign(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    cache_service=Depends(di.get_cache_service),
    voip_service=Depends(di.get_voip_service),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    handlers.call_prcontract__voip_otp_sign_handler(
        contract_id=contract_id,
        user=current_user,
        cache_service=cache_service,
        voip_service=voip_service,
        uow=uow,
        prc_service=prc_service,
    )

    return OperationResult(success=True, message="voip_called")


@router.post("/{contract_id}/parties/otp-sign/verify", response_model=response_models.ContractPartyResponse)
def verify_prcontract_party_otp_sign(
    background_tasks: BackgroundTasks,
    contract_id: int,
    data: dtos.VerifyPRContractPartyOtpSignDto,
    current_user=Depends(di.get_current_user),
    cache_service=Depends(di.get_cache_service),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    sms_service=Depends(di.get_sms_service),
    invoice_service=Depends(di.get_invoice_service),
):
    party = handlers.verify_prcontract_otp_sign_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        cache_service=cache_service,
        uow=uow,
        prc_service=prc_service,
        sms_service=sms_service,
    )

    if party.party_type == PartyType.TENANT:
        background_tasks.add_task(
            tenant_signed_event_handler,
            event=TenantSignedContractEvent(contract_id=contract_id),
        )

    notify_signs(party, current_user)
    cache_service.delete_cached_contract(contract_id, current_user.id)

    return party.dumps()


@router.get("/{contract_id}/add_invoice_manual")
def add_invoice_manual(
    contract_id: int,
    invoice_service=Depends(di.get_invoice_service),
    uow=Depends(di.get_uow),
):
    return create_invoice_manually_handler(contract_id, uow, invoice_service)


@router.patch("/{contract_id}/property/specifications", response_model=PropertyResponse)
def upsert_prcontract_property_specifications(
    contract_id: int,
    data: dtos.UpsertPRContractPropertySpecificationsDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.upsert_prcontract_property_specifications_handler(
        contract_id=contract_id,
        data=data,
        current_user=current_user,
        uow=uow,
        prc_service=prc_service,
    )


@router.patch("/{contract_id}/property/details", response_model=PropertyResponse)
def upsert_prcontract_property_details(
    contract_id: int,
    data: dtos.UpsertPRContractPropertyDetailsDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.upsert_prcontract_property_details_handler(
        contract_id=contract_id,
        data=data,
        current_user=current_user,
        uow=uow,
        prc_service=prc_service,
    )


@router.patch("/{contract_id}/property/facilities", response_model=PropertyResponse)
def upsert_prcontract_property_facilities(
    contract_id: int,
    data: dtos.UpsertPRContractPropertyFacilitiesDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.upsert_prcontract_property_facilities_handler(
        contract_id=contract_id,
        data=data,
        current_user=current_user,
        uow=uow,
        prc_service=prc_service,
    )


@router.get("/{contract_id}/property", response_model=PropertyResponse)
def get_prcontract_property_detail(
    contract_id: int, current_user=Depends(di.get_current_user), uow=Depends(di.get_uow)
):
    return views.get_prcontract_property_detail_view(contract_id, current_user, uow)


@router.delete("/{contract_id}/payments/{payment_id}", response_model=OperationResult)
def delete_prcontract_payment(
    contract_id: int,
    payment_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    invoice_service=Depends(di.get_invoice_service),
):
    handlers.delete_prcontract_payment_handler(
        contract_id=contract_id,
        payment_id=payment_id,
        user=current_user,
        uow=uow,
        prc_service=prc_service,
        invoice_service=invoice_service,
    )
    return OperationResult(success=True, message="payment_deleted")


@router.delete("/{contract_id}/payments", response_model=OperationResult)
def delete_prcontract_payments(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    payment_type: PRContractPaymentType = Query(PRContractPaymentType.RENT),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    invoice_service=Depends(di.get_invoice_service),
):
    handlers.delete_prcontract_payments_handler(
        contract_id=contract_id,
        user=current_user,
        uow=uow,
        payment_type=payment_type,
        prc_service=prc_service,
        invoice_service=invoice_service,
    )
    return OperationResult(success=True, message="payments_deleted")


@router.get("/{contract_id}/payments/{payment_id}", response_model=response_models.ContractPaymentResponse)
def get_prcontract_payment(
    contract_id: int,
    payment_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    storage=Depends(di.get_storage_service),
):
    return views.get_prcontract_payment_detail_view(contract_id, payment_id, current_user, uow, storage)


@router.post("/{contract_id}/payments/finalize", response_model=OperationResult)
def finalize_prcontract_payment(
    background_tasks: BackgroundTasks,
    contract_id: int,
    data: dtos.FinalizePrContractPaymentDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    prc_commission_service=Depends(di.get_prcontract_commission_service),
    invoice_service=Depends(di.get_invoice_service),
    monthly_rent_service=Depends(di.get_monthly_rent_service),
):
    payments_completed = handlers.finalize_prcontract_payment_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        uow=uow,
        prc_service=prc_service,
        monthly_rent_service=monthly_rent_service,
        invoice_service=invoice_service,
    )
    if payments_completed:
        background_tasks.add_task(
            event_handlers.contract_payments_completed_event_handler,
            event=ContractPaymentsCompletedEvent(contract_id=contract_id),
            commission_service=prc_commission_service,
        )
    return OperationResult(success=True, message="payment_finalized")


@router.get("/{contract_id}/payments")
def get_prcontract_payments(
    contract_id: int,
    payment_type: PRContractPaymentType | None = Query(None),
    payment_side: PaymentSide | None = Query(None),
    payment_status: PaymentStatus | None = Query(None),
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return views.get_prcontract_payments_list_view(
        contract_id, payment_type, payment_side, payment_status, current_user, uow
    )


@router.post("/{contract_id}/payments/cash/monthly-rent", response_model=list[response_models.ContractPaymentResponse])
def create_prcontract_monthly_rent_payment(
    contract_id: int,
    data: dtos.PrContractMonthlyRentPaymentDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    monthly_rent_service=Depends(di.get_monthly_rent_service),
    invoice_service=Depends(di.get_invoice_service),
):
    payments = handlers.create_prcontract_monthly_rent_payment_handler(
        contract_id=contract_id,
        data=data,
        user=current_user,
        uow=uow,
        prc_service=prc_service,
        monthly_rent_service=monthly_rent_service,
        invoice_service=invoice_service,
    )
    return [payment.dumps() for payment in payments]


@router.post("/{contract_id}/payments/cash", response_model=response_models.ContractPaymentResponse)
def create_cash_prcontract_cash_payment(
    contract_id: int,
    data: dtos.PrContractCashPaymentDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.create_prcontract_cash_payment_handler(
        contract_id=contract_id, data=data, user=current_user, uow=uow, prc_service=prc_service
    ).dumps()


@router.post("/{contract_id}/payments/cheque", response_model=response_models.ContractPaymentResponse)
def create_prcontract_cheque_payment(
    contract_id: int,
    data: dtos.PrContractChequePaymentDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.create_prcontract_cheque_payment_handler(
        contract_id=contract_id, data=data, user=current_user, uow=uow, prc_service=prc_service
    ).dumps()


@router.put("/{contract_id}/payments/cash/{payment_id}/", response_model=response_models.ContractPaymentResponse)
def update_prcontract_cash_payment(
    contract_id: int,
    payment_id: int,
    data: dtos.PrContractCashPaymentDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    payment = handlers.update_prcontract_cash_payment_handler(
        contract_id=contract_id, payment_id=payment_id, data=data, user=current_user, uow=uow, prc_service=prc_service
    )
    return payment.dumps()


@router.put("/{contract_id}/payments/cheque/{payment_id}", response_model=response_models.ContractPaymentResponse)
def update_prcontract_cheque_payment(
    contract_id: int,
    payment_id: int,
    data: dtos.PrContractChequePaymentDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return handlers.update_prcontract_cheque_payment_handler(
        contract_id=contract_id, payment_id=payment_id, data=data, user=current_user, uow=uow, prc_service=prc_service
    ).dumps()


@router.patch(
    "/{contract_id}/payments/{payment_id}/payer-claimed-to-have-paid",
    response_model=response_models.ContractPaymentResponse,
)
def payer_claimed_to_have_paid(
    contract_id: int,
    payment_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return handlers.payer_claimed_to_have_paid_handler(
        contract_id=contract_id, payment_id=payment_id, user=current_user, uow=uow
    ).dumps()


@router.patch(
    "/{contract_id}/payments/{payment_id}/payee-confirmed-receipt",
    response_model=response_models.ContractPaymentResponse,
)
def payee_confirmed_receipt(
    contract_id: int,
    payment_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return handlers.payee_confirmed_receipt_handler(
        contract_id=contract_id, payment_id=payment_id, user=current_user, uow=uow
    ).dumps()


@router.patch(
    "/{contract_id}/payments/{payment_id}/payee-denied-receipt", response_model=response_models.ContractPaymentResponse
)
def payee_denied_receipt(
    contract_id: int,
    payment_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return handlers.payee_denied_receipt_handler(
        contract_id=contract_id, payment_id=payment_id, user=current_user, uow=uow
    ).dumps()


@router.get("/{contract_id}/commission")
def get_user_prcontract_commission(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    invoice_service=Depends(di.get_invoice_service),
):
    return views.get_user_commission_invoice_view(
        contract_id=contract_id, user=current_user, uow=uow, invoice_service=invoice_service
    )


@router.get("/{contract_id}/preview")
def get_prcontract_preview(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return views.get_prcontract_preview_view(contract_id, current_user, uow, prc_service)


@router.get("/{contract_id}/inquire")
def inquire_prcontract_preview(
    contract_id: int,
    password: str = Query(None),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return views.inquire_contract_handler(contract_id=contract_id, password=password, uow=uow, prc_service=prc_service)


@router.get("/{contract_id}/pdf", response_model=FileResponseModel)
def get_prcontract_pdf(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    storage=Depends(di.get_storage_service),
):
    return views.get_prcontract_pdf_view(contract_id, current_user, uow, storage)
