from fastapi import APIRouter, BackgroundTasks, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse

import di
from account.domain.enums import RoleAccess
from core.middlewares.access_checker import has_access
from core.middlewares.rate_limiter import async_rate_limiter
from core.types import CurrentUser, OperationResult, PaginateParams
from financial.entrypoints import request_models, response_models, views
from financial.service_layer import dtos, handlers
from financial.service_layer.handlers.pay_contract_invoices import (
    _process_gateway_payment,
)
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/financials", tags=["Financial"])

# -------------------invoices----------------------


@router.get("/invoices/{invoice_id}", response_model=response_models.InvoiceResponseModel)
async def get_invoice(
    invoice_id: str,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_single_invoice(uow, int(invoice_id), current_user)


@router.get("/promos")
@has_access(RoleAccess.SUPERUSER)
def get_promo_codes(
    uow: UnitOfWork = Depends(di.get_uow),
    paginate_params: PaginateParams = Depends(),
    _: CurrentUser = Depends(di.get_current_user),
    mobile: str | None = Query(None),
):
    return views.get_promo_codes_handler(uow, paginate_params, mobile)


@router.post("/promos/generate")
@has_access(RoleAccess.SUPERUSER)
def generate_promo_code(
    request_model: request_models.GeneratePromoCodeRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.GeneratePromoCodeDto(**request_model.model_dump())
    return handlers.generate_promo_code_handler(command, uow, current_user)


@router.post("/promos/bulk-generate")
@has_access(RoleAccess.SUPERUSER)
def generate_bulk_promo_code(
    data: request_models.GenerateBulkPromoCodeRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return handlers.generate_bulk_promo_code_handler(data, uow, current_user)


@router.post("/invoices/apply-promo", response_model=response_models.InvoiceResponseModel)
@async_rate_limiter(5, 30)
async def apply_promo_code_to_invoice(
    request: Request,
    request_model: request_models.ApplyPromoCodeRequet,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.ApplyPromoCodeDto(**request_model.model_dump())
    return handlers.apply_promo_code_handler(command, uow, current_user)


@router.delete("/invoices/items/{invoice_item_id}", response_model=OperationResult)
async def delete_invoice_item(
    invoice_item_id: int,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.DeleteInvoiceItemDto(invoice_item_id)
    handlers.delete_invoice_item_handler(command, uow, current_user)
    return OperationResult(success=True, message="Item deleted successfully.")


# -------------------bank_transactions----------------------


@router.post("/bank/gateway", response_model=OperationResult, tags=["Bank Gateway"])
# @async_rate_limiter(1, 5)
async def pay_invoice(
    request: Request,
    request_model: dtos.PayInvoiceDto,
    bg_tasks: BackgroundTasks,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    data = handlers.pay_contract_invoice_handler(request_model, uow, bg_tasks, current_user)
    return OperationResult(success=True, message=data)


@router.post("/bank/gateway/message-user")
async def send_message_invoice_pay_link(
    request_model: dtos.MessageToUserDto,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
    sms_service: SMSService = Depends(di.get_sms_service),
):
    handlers.pay_contract_invoice_message_to_user_handler(request_model, uow, sms_service)
    return OperationResult(success=True, message="Message sent successfully.")


@router.get("/bank/gateway/verify", tags=["Bank Gateway"])
async def verify_zarinpal_gateway(
    bg_tasks: BackgroundTasks,
    uow: UnitOfWork = Depends(di.get_uow),
    Authority: str = Query(""),
    Status: str = Query(""),
):
    command = dtos.GetBankGatewayDto(
        **request_models.GetBankGatewayRequest(authority_code=Authority, status=Status).model_dump()
    )
    redirect_link = handlers.verify_gateway_handler(command, uow, bg_tasks)
    return RedirectResponse(redirect_link)


@router.post("/bank/gateway/parsian-verify", tags=["Bank Gateway"])
async def verify_parsian_gateway(
    bg_tasks: BackgroundTasks,
    uow: UnitOfWork = Depends(di.get_uow),
    Token: int = Form(...),
    OrderId: int = Form(...),
    TerminalNo: int = Form(0),
    RRN: int = Form(0),
    status: int = Form(...),
    Amount: str = Form("0"),
    STraceNo: str = Form("0"),
    DiscoutedProduct: str = Form("0"),
    SwAmount: str = Form("0"),
    HashCardNumber: str = Form("0"),
):
    token_int = str(Token)
    order_id_int = int(OrderId)
    terminal_no_int = int(TerminalNo)
    rrn_int = int(RRN)
    status_int = int(status)
    amount = int(Amount.replace(",", ""))
    trace_number = float(STraceNo)
    sw_amount = SwAmount
    hashed_card_number = HashCardNumber
    discount_float = DiscoutedProduct
    redirect_link = handlers.verify_parsian_gateway_handler(
        {
            "token": token_int,
            "orderId": order_id_int,
            "terminalNumber": terminal_no_int,
            "RRN": rrn_int,
            "status": status_int,
            "amount": amount,
            "discountAmount": discount_float,
            "sw_amount": sw_amount,
            "card_number_hashed": hashed_card_number,
            "trace_number": trace_number,
        },
        uow,
        bg_tasks,
    )
    return RedirectResponse(redirect_link)


@router.get("/cp/{invoice_id}", tags=["Bank Gateway"], response_class=HTMLResponse)
def user_sms_generated_custom_payment_bank_gateway_link(
    invoice_id: int | str,
    uow: UnitOfWork = Depends(di.get_uow),
):
    with uow:
        invoice = uow.invoices.get_or_raise(id=int(invoice_id))
        transaction = uow.transactions.get_or_raise(invoice_id=invoice.id)
        redirect_link = _process_gateway_payment(
            bank_gateway=transaction.gateway, transaction=transaction, current_user=invoice.payer
        )
        uow.commit()
        return f"""<!DOCTYPE html>
                <html>
                    <body>
                        <script>window.location.href = '{redirect_link}'</script>
                    </body>
                </html>
                """


@router.get("/test-bank-gateway/{order_id}")
def test_new_bank_gateway(order_id: int):
    return handlers.test_new_gateway(order_id)


@router.get("/test-bank-gateway-confirm/{token}")
def test_new_bank_gateway_confirm(token: int):
    return handlers.test_new_gateway_confirm_handler(token)
