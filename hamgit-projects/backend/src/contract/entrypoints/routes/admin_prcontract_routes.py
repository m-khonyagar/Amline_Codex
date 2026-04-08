from typing import Dict, List

from fastapi import APIRouter, BackgroundTasks, Depends, Query

import di
from account.domain.enums import RoleAccess
from contract.domain.enums import (
    PaymentSide,
    PaymentStatus,
    PaymentType,
    PRContractPaymentType,
)
from contract.domain.events import ContractPaymentsCompletedEvent
from contract.domain.types import TrackingCode
from contract.entrypoints import query_params, response_models, views
from contract.entrypoints.request_models import (
    AddPDFFileToContractRequest,
    CreateBaseContractClauseRequest,
    CreateCustomInvoiceLinkRequest,
    UpdateBaseContractClauseRequest,
    UpsertContractColorRequest,
)
from contract.service_layer import (
    admin_prcontract_service,
    dtos,
    event_handlers,
    handlers,
)
from contract.service_layer.handlers.generate_contract_pdf import (
    add_pdf_file_to_contract_handler,
)
from contract.service_layer.handlers.upsert_contract_color import (
    upsert_contract_color_handler,
)
from core.middlewares.access_checker import has_access
from core.types import OperationResult, PaginateParams
from financial.domain.enums import SettlementStatus
from financial.entrypoints.views.admin_settlements import get_all_wallet_settlements
from financial.service_layer.dtos import UpdateSettlementDto
from financial.service_layer.handlers.admin_update_settlement import (
    admin_update_settlement_handler,
)
from shared.entrypoints.response_models import PropertyResponse
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/admin", tags=["admin pr-contracts"])


# region prc FIXME -> fix response models and test
@router.post("/pr-contracts")
def create_prcontract(
    data: dtos.CreatePRContractDto,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return handlers.create_prcontract_handler(data, uow).dumps()


@router.get("/pr-contracts/list")
def get_prcontracts_list(
    current_user=Depends(di.get_admin_panel_user),
    paginate_params: PaginateParams = Depends(),
    query_params: query_params.PRContractQueryParams = Depends(),
    uow=Depends(di.get_uow),
):
    return views.get_prcontracts_list_view(
        paginate_params=paginate_params,
        query_params=query_params,
        uow=uow,
        current_user=current_user,
    )


@router.get("/pr-contracts/{contract_id}")
def get_prcontract_detail(
    contract_id: int,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    monthly_rent_service=Depends(di.get_monthly_rent_service),
):
    return views.get_prcontract_detail_view(contract_id, admin, uow, prc_service, monthly_rent_service)


@router.patch("/pr-contracts/{contract_id}/details")
def update_prcontract_details(
    contract_id: int,
    data: dtos.UpdatePRContractDatesAndAmountsDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    invoice_service=Depends(di.get_invoice_service),
):
    return handlers.update_prcontract_details_handler(
        contract_id=contract_id, data=data, uow=uow, invoice_service=invoice_service
    ).dumps()


@router.delete("/pr-contracts/{contract_id}", response_model=OperationResult)
def delete_prcontract(
    contract_id: int,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    handlers.delete_contract_handler(contract_id, uow)
    return OperationResult(success=True, message="Contract deleted successfully")


@router.get("/pr-contracts/{contract_id}/status", response_model=response_models.PRContractStatusResponse)
def get_prcontract_status(
    contract_id: int,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    return views.get_prcontract_status_view(contract_id=contract_id, user=admin, uow=uow, prc_service=prc_service)


@router.post("/pr-contracts/{contract_id}/color")
def upsert_prcontract_color(
    contract_id: int,
    data: UpsertContractColorRequest,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return upsert_contract_color_handler(uow=uow, contract_id=contract_id, color=data.color)


@router.patch("/pr-contracts/{contract_id}/status")
def update_prcontract_status(
    contract_id: int,
    data: dtos.UpdateContractStatusDto,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return handlers.update_prcontract_status_handler(contract_id, data, uow).dumps()


@router.patch("/pr-contracts/{contract_id}/tracking-code")
def update_prcontract_tracking_code(
    contract_id: int, data: TrackingCode, _=Depends(di.get_admin), uow=Depends(di.get_uow)
):
    return handlers.update_prcontract_tracking_code_handler(contract_id, data, uow).dumps()


@router.patch("/pr-contracts/{contract_id}/refer-to-parties")
def refer_prcontract_to_parties(
    contract_id: int,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
):
    handlers.refer_prcontract_to_parties_handler(contract_id, uow, prc_service)
    return {"message": "Contract referred to parties"}


@router.post("/contracts/{contract_id}/pdf-file")
def generate_contract_pdf(
    contract_id: int,
    uow=Depends(di.get_uow),
    pdf_generator=Depends(di.get_prc_pdf_generator_service),
    storage=Depends(di.get_storage_service),
    # _=Depends(di.get_admin),
):
    return handlers.generate_contract_pdf_handler(
        contract_id=contract_id, uow=uow, pdf_generator=pdf_generator, storage=storage
    )


@router.post("/contracts/{contract_id}/custom-pdf-file")
@has_access(RoleAccess.EMPTY_CONTRACT_CREATOR)
def add_pdf_file_to_contract(
    contract_id: int,
    data: AddPDFFileToContractRequest,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return add_pdf_file_to_contract_handler(contract_id=contract_id, uow=uow, file_id=data.file_id)


# endregion


# region parties
@router.get(
    "/pr-contracts/{contract_id}/parties", response_model=dict[str, response_models.ContractPartyAdminResponse | None]
)
def get_prcontract_parties(
    contract_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return views.get_prcontract_parties_list_admin_view(contract_id=contract_id, uow=uow)


@router.post("/pr-contracts/{contract_id}/parties", response_model=response_models.ContractPartyResponse)
def add_contract_party(
    contract_id: int,
    data: dtos.ContractPartyDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.add_prcontract_party_handler(contract_id=contract_id, data=data, uow=uow).dumps()


@router.put("/pr-contracts/{contract_id}/parties/{party_id}", response_model=response_models.ContractPartyResponse)
def update_prcontract_party(
    contract_id: int,
    party_id: int,
    data: dtos.UpdateContractPartyDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    verifier=Depends(di.get_user_verifier_service),
):
    return handlers.update_contract_party_handler(
        contract_id=contract_id, party_id=party_id, data=data, uow=uow, verifier=verifier
    ).dumps()


@router.put("/pr-contracts/{contract_id}/parties/{party_id}/accounts", response_model=List[Dict])
def upsert_prcontract_party_accounts(
    contract_id: int,
    party_id: int,
    data: dtos.UpsertPRContractAccountsDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    accounts = handlers.admin_upsert_prcontract_party_accounts_handler(
        uow=uow,
        data=data,
        party_id=party_id,
        contract_id=contract_id,
    )

    return [a.dumps() for a in accounts]


@router.post("/pr-contracts/{contract_id}/parties/{party_id}/otp-sign/send")
def send_contract_sign_otp(
    contract_id: int,
    party_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    sms=Depends(di.get_sms_service),
    cache=Depends(di.get_cache_service),
):
    handlers.send_contract_sign_otp_handler(contract_id, party_id, uow, sms, cache)
    return {"message": "otp_sent"}


@router.post("/pr-contracts/{contract_id}/parties/{party_id}/voip-otp-sign/send")
def voip_call_contract_sign_otp_handler(
    contract_id: int,
    party_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    voip=Depends(di.get_voip_service),
    cache=Depends(di.get_cache_service),
):
    handlers.send_contract_sign_otp_handler(contract_id, party_id, uow, voip, cache)
    return {"message": "voip_called"}


@router.post(
    "/pr-contracts/{contract_id}/parties/{party_id}/otp-sign/confirm",
    response_model=response_models.ContractPartyResponse,
)
def confirm_contract_sign_otp(
    contract_id: int,
    party_id: int,
    data: dtos.VerifyPRContractPartyOtpSignDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    cache=Depends(di.get_cache_service),
):
    return handlers.confirm_contract_sign_otp_handler(contract_id, party_id, data, uow, cache).dumps()


@router.post("/pr-contracts/{contract_id}/parties/{party_id}/sign")
def sign_contract_for_party(
    contract_id: int,
    party_id: int,
    data: dtos.SignContractForPartyDto,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return handlers.sign_contract_for_party_handler(contract_id, party_id, data, uow).dumps()


# endregion


# region property
@router.get("/pr-contracts/{contract_id}/property", response_model=PropertyResponse)
def get_prcontract_property_detail(
    contract_id: int,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return views.get_prcontract_property_detail_view(contract_id=contract_id, user=admin, uow=uow)


@router.put("/pr-contracts/{contract_id}/property", response_model=PropertyResponse)
def update_prcontract_property(
    contract_id: int,
    data: dtos.PRContractPropertyDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.update_prcontract_property_handler(contract_id=contract_id, data=data, uow=uow)


@router.post("/pr-contracts/{contract_id}/property", response_model=PropertyResponse)
def create_prcontract_property(
    contract_id: int,
    data: dtos.PRContractPropertyDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.create_prcontract_property_handler(contract_id=contract_id, data=data, uow=uow)


# endregion


# region contract clauses


@router.post("/contracts/base-clauses")
@has_access(RoleAccess.SUPERUSER)
def create_base_contract_clauses(
    data: CreateBaseContractClauseRequest, _=Depends(di.get_admin), uow=Depends(di.get_uow)
):
    return handlers.create_base_contract_clauses_handler(data, uow)


@router.put("/contracts/base-clauses/{base_contract_clauses_id}")
@has_access(RoleAccess.SUPERUSER)
def update_base_contract_clauses(
    base_contract_clauses_id: int,
    data: UpdateBaseContractClauseRequest,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return handlers.update_base_contract_clauses_handler(id=base_contract_clauses_id, data=data, uow=uow)


@router.get("/contracts/base-clauses")
@has_access(RoleAccess.SUPERUSER)
def read_base_contract_clauses(_=Depends(di.get_admin), uow=Depends(di.get_uow)):
    return handlers.read_base_contract_clauses_handler(uow)


@router.get("/contracts/{contract_id}/clauses", response_model=list[response_models.ContractClauseResponse])
def get_contract_clauses(contract_id: int, admin=Depends(di.get_contract_admin), uow=Depends(di.get_uow)):
    return views.get_contract_clauses_list_view(contract_id=contract_id, user=admin, uow=uow)


@router.get("/contracts/{contract_id}/clauses/{clause_id}", response_model=response_models.ContractClauseResponse)
def get_contract_clause(
    contract_id: int, clause_id: int, admin=Depends(di.get_contract_admin), uow=Depends(di.get_uow)
):
    return views.get_contract_clause_detail_view(contract_id=contract_id, clause_id=clause_id, user=admin, uow=uow)


@router.put("/contracts/{contract_id}/clauses/{clause_id}", response_model=response_models.ContractClauseResponse)
def update_contract_clause(
    contract_id: int,
    clause_id: int,
    data: dtos.UpdateContractClauseDto,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.update_contract_clause_handler(
        contract_id=contract_id, clause_id=clause_id, clause_body=data.body, user=admin, uow=uow
    ).dumps()


@router.delete("/contracts/{contract_id}/clauses/{clause_id}")
def delete_contract_clause(
    contract_id: int,
    clause_id: int,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.delete_contract_clause_handler(contract_id=contract_id, clause_id=clause_id, user=admin, uow=uow)


@router.post("/contracts/{contract_id}/clauses")
def create_contract_clause(
    contract_id: int,
    data: dtos.CreateContractClauseDto,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.create_contract_clause_handler(contract_id=contract_id, data=data, user=admin, uow=uow).dumps()


# endregion


# region contract-payments
@router.get("/contracts/{contract_id}/payments", response_model=list[response_models.ContractPaymentResponse])
def get_contract_payments(
    contract_id: int,
    payment_type: PRContractPaymentType | None = Query(None),
    payment_side: PaymentSide | None = Query(None),
    payment_status: PaymentStatus | None = Query(None),
    current_user=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return views.get_prcontract_payments_list_view(
        contract_id, payment_type, payment_side, payment_status, current_user, uow
    )


@router.get("/contracts/{contract_id}/payments/summary", response_model=response_models.ContractPaymentsSummaryResponse)
def get_contract_payments_summary(
    contract_id: int,
    # _=Depends(di.get_admin),
    rent_service=Depends(di.get_monthly_rent_service),
    uow=Depends(di.get_uow),
):
    return views.get_prcontract_payments_summary_view(contract_id=contract_id, uow=uow, rent_service=rent_service)


@router.put("/contracts/{contract_id}/payments/{payment_id}", response_model=response_models.ContractPaymentResponse)
def update_contract_payment(
    contract_id: int,
    payment_id: int,
    data: dtos.UpdateContractPaymentDto,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.update_prcontract_payment_handler(contract_id, payment_id, data, uow).dumps()


@router.delete("/contracts/{contract_id}/payments/{payment_id}")
def delete_contract_payment(
    contract_id: int,
    payment_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    invoice_service=Depends(di.get_invoice_service),
):
    handlers.delete_prcontract_payment_handler(
        contract_id=contract_id,
        payment_id=payment_id,
        user=_,
        uow=uow,
        prc_service=prc_service,
        invoice_service=invoice_service,
    ).dumps()

    return {"payment": payment_id, "contract_id": contract_id, "message": "Payment deleted successfully"}


@router.post("/contracts/{contract_id}/payments", response_model=response_models.ContractPaymentResponse)
def create_contract_payment(
    contract_id: int,
    data: dtos.CreateContractPaymentDto,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.create_prcontract_payment_handler(contract_id, data, uow, admin).dumps()


@router.post("/contracts/{contract_id}/payments/monthly-rent")
def create_prcontract_monthly_rent_payment(
    contract_id: int,
    data: dtos.PrContractMonthlyRentPaymentDto,
    admin=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    prc_service=Depends(di.get_prcontract_service),
    monthly_rent_service=Depends(di.get_monthly_rent_service),
    invoice_service=Depends(di.get_invoice_service),
):
    payments = handlers.create_prcontract_monthly_rent_payment_handler(
        contract_id=contract_id,
        data=data,
        user=admin,
        uow=uow,
        prc_service=prc_service,
        monthly_rent_service=monthly_rent_service,
        invoice_service=invoice_service,
    )
    return [payment.dumps() for payment in payments]


@router.post("/contracts/{contract_id}/payments/finalize")
def finalize_contract_payments(
    background_tasks: BackgroundTasks,
    contract_id: int,
    data: dtos.FinalizePrContractPaymentDto,
    current_user=Depends(di.get_contract_admin),
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
            event=ContractPaymentsCompletedEvent(contract_id),
            commission_service=prc_commission_service,
        )

    return OperationResult(message="payment_finalized")


@router.get("/contracts/{contract_id}/payments/commissions")
def get_contract_payment_commissions(
    contract_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    invoice_service=Depends(di.get_invoice_service),
):
    return views.get_contract_payment_commissions_view(contract_id, uow, invoice_service)


@router.post("/contract/{contract_id}/payments/commissions")
def generate_contract_payment_commissions(
    contract_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    invoice_service=Depends(di.get_invoice_service),
    prc_commission_service=Depends(di.get_prcontract_commission_service),
):
    return handlers.admin_generate_prcontract_commissions_handler(
        contract_id=contract_id, uow=uow, invoice_service=invoice_service, commission_service=prc_commission_service
    )


@router.post("/contracts/{contract_id}/payments/{payment_id}/mark-as-paid")
def mark_contract_payment_as_paid(
    contract_id: int,
    payment_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    invoice_service=Depends(di.get_invoice_service),
):
    handlers.mark_contract_payment_as_paid_handler(contract_id, payment_id, uow, invoice_service)
    return {"message": "Payment marked as paid"}


# endregion


# --------------------------create_complete_contract--------------------------------
@router.put("/contracts/new/user")
def create_or_update_user(
    data: dtos.UserInfo,
    admin=Depends(di.get_admin),
    user_verification_service=Depends(di.get_user_verifier_service),
    uow=Depends(di.get_uow),
):
    return admin_prcontract_service.upsert_user(data, user_verification_service, uow)


@router.post("/contracts/new/otp")
def send_otp(
    data: dtos.SendOtpDto,
    _=Depends(di.get_admin),
    sms_service=Depends(di.get_sms_service),
):
    return admin_prcontract_service.send_otp(data.mobile, sms_service)


@router.post("/contracts/new/{contract_id}/property")  # UNUSED
def create_property_for_contract(
    contract_id: int,
    data: dtos.PropertyInfo,
    admin=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return admin_prcontract_service.create_property(contract_id, data, uow).dumps()


# @router.post("/contracts/new/{contract_id}/finalize")
# def finalize_contract_creation(
#     contract_id: int,
#     admin=Depends(di.get_admin),
#     prc_pdf_generator=Depends(di.get_prc_pdf_generator_service),
#     uow=Depends(di.get_uow),
# ):
#     return admin_prcontract_service.finalize_contract_creation(contract_id, prc_pdf_generator, uow)


# --------------------------misc--------------------------------
@router.post("/custom_payment_link")
def send_custom_payment_link_via_sms(
    data: CreateCustomInvoiceLinkRequest,
    current_user=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return handlers.send_custom_payment_link_handler(data=data, admin_user=current_user, uow=uow)


@router.get("/custom-invoices/users")
def inquire_user_custom_invoices(
    uow: UnitOfWork = Depends(di.get_uow),
    _=Depends(di.get_admin),
    mobile: str = Query(""),
):
    with uow:
        user = uow.users.get_or_raise(mobile=mobile)
        invoices = uow.invoices.get_all_simple(payer_user_id=user.id)
        payments = uow.contract_payments.get_by_invoice_ids([i.id for i in invoices])
        filtered_invoice_ids = [
            p.invoice_id
            for p in payments
            if p.type == PaymentType.CUSTOM_PAYMENT.name or p.type == PaymentType.ERNEST_MONEY.name
        ]
        result = [invoice.dumps() for invoice in invoices if invoice.id in filtered_invoice_ids] if invoices else []
        return sorted(result, key=lambda x: x.get("created_at"))  # type:ignore


@router.patch("/settlements", response_model=OperationResult)
async def update_settlement_request_status(
    request_model: UpdateSettlementDto,
    current_user=Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    admin_update_settlement_handler(request_model, uow, current_user)
    return OperationResult(success=True, message="تغییرات با موفقیت اعمال شد")


@router.get("/settlements/users")
async def view_all_wallet_settlement_requests(
    status: SettlementStatus | None = None,
    paginate_params: PaginateParams = Depends(),
    search_text: str | None = Query(None),
    current_user=Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return get_all_wallet_settlements(uow, paginate_params, current_user, search_text, status)
