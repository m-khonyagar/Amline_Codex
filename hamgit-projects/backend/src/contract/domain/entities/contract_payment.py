import datetime as dt

from contract.domain import enums
from contract.domain.entities.cheque import Cheque
from core.base.base_entity import BaseEntity
from core.exceptions import ValidationException
from core.translates import validation_trans


class ContractPayment(BaseEntity):
    id: int
    cheque: Cheque | None
    contract_id: int
    owner_id: int  # user_id who created the payment
    payer_id: int  # user_id who pays
    payee_id: int  # user_id who receives
    invoice_id: int | None

    amount: int
    method: enums.PaymentMethod  # cash, cheque
    type: enums.PaymentType  # deposit, rent, commission, ...
    due_date: dt.date  # date when payment should be made
    status: enums.PaymentStatus  # paid, not_paid, overdue, cancelled
    paid_at: dt.datetime | None
    description: str | None

    is_bulk: bool  # if payment was created in bulk, it should be true

    created_at: dt.datetime
    updated_at: dt.datetime
    deleted_at: dt.datetime

    _invoice: dict | None = None

    def __init__(
        self,
        contract_id: int,
        owner_id: int,
        payer_id: int,
        payee_id: int,
        amount: int,
        method: enums.PaymentMethod,
        type: enums.PaymentType,
        due_date: dt.date,
        invoice_id: int | None = None,
        status: enums.PaymentStatus = enums.PaymentStatus.UNPAID,
        paid_at: dt.datetime | None = None,
        description: str | None = None,
        is_bulk: bool = False,
    ) -> None:
        self._validate_amount(amount)
        self.id = self.next_id
        self.contract_id = contract_id
        self.owner_id = owner_id
        self.payee_id = payee_id
        self.payer_id = payer_id
        self.invoice_id = invoice_id
        self.amount = amount
        self.method = method
        self.type = type
        self.due_date = due_date
        self.status = status
        self.paid_at = paid_at
        self.description = description
        self.is_bulk = is_bulk

    @property
    def invoice(self) -> dict | None:
        if not self.invoice_id:
            return None
        if self.invoice_id and not self._invoice:
            return {"id": self.invoice_id}
        return self._invoice

    @invoice.setter
    def invoice(self, invoice: dict | None) -> None:
        self._invoice = invoice

    def delete(self) -> None:
        self.deleted_at = dt.datetime.now(tz=dt.timezone.utc)

    def mark_as_paid(self, paid_at: dt.datetime) -> None:
        self.status = enums.PaymentStatus.PAID
        self.paid_at = paid_at

    def update(
        self, amount: int, due_date: dt.date, description: str | None, type: enums.PaymentType | None = None
    ) -> None:
        self._validate_amount(amount)
        self.amount = amount
        self.due_date = due_date
        self.description = description
        self.type = type or self.type

    def set_cheque(
        self,
        serial: str,
        series: str,
        sayaad_code: str,
        image_file_id: int,
        category: enums.ChequeCategory,
        payee_type: enums.ChequePayeeType,
        payee_national_code: str,
        status: enums.ChequeStatus = enums.ChequeStatus.PENDING,
    ) -> None:

        if self.cheque is None:
            self.cheque = Cheque(
                payment_id=self.id,
                serial=serial,
                series=series,
                sayaad_code=sayaad_code,
                image_file_id=image_file_id,
                category=category,
                payee_type=payee_type,
                payee_national_code=payee_national_code,
                status=status,
            )
        else:
            self.cheque.update(
                serial=serial,
                series=series,
                sayaad_code=sayaad_code,
                image_file_id=image_file_id,
                category=category,
                payee_type=payee_type,
                payee_national_code=payee_national_code,
                status=status,
            )

    def _validate_amount(self, amount: int) -> None:
        if amount <= 0:
            raise ValidationException(validation_trans.amount_must_be_positive)

    def dumps(self, **kwargs) -> dict:
        return {
            "id": str(self.id),
            "contract": kwargs.get("contract", {"id": str(self.contract_id)}),
            "cheque": self.cheque.dumps(**kwargs) if self.cheque else None,
            "payer": kwargs.get("payer", {"user_id": str(self.payer_id)}),
            "payee": kwargs.get("payee", {"user_id": str(self.payee_id)}),
            "type": enums.PaymentType.resolve(self.type),
            "amount": self.amount,
            "method": enums.PaymentMethod.resolve(self.method),
            "status": enums.PaymentStatus.resolve(self.status),
            "due_date": self.due_date,
            "paid_at": self.paid_at,
            "description": self.description,
            "is_bulk": self.is_bulk,
            "invoice": self.invoice,
            **kwargs,
        }
