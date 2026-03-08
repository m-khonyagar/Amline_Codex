from sqlalchemy import desc, or_

from account.domain.entities.user import User
from contract.adapters.orm.read_only_models.contract_payments_roms import (
    ContractPaymentROM,
)
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import PaymentSide, PaymentStatus
from core.types import PaginatedList, PaginateParams
from unit_of_work import UnitOfWork


def get_user_payments_list_view(
    payment_side: PaymentSide | None, params: PaginateParams, user: User, uow: UnitOfWork
) -> PaginatedList:
    with uow:
        query = uow.session.query(ContractPaymentROM).filter(
            ContractPaymentROM.deleted_at.is_(None),  # type: ignore
            or_(  # type: ignore
                ContractPaymentROM.status == PaymentStatus.PAID.name,  # type: ignore
                ContractPaymentROM.status == PaymentStatus.PAYEE_CONFIRMED_RECEIPT.name,  # type: ignore
            ),
        )

        if payment_side and payment_side == PaymentSide.PAYER:
            query = query.filter(ContractPaymentROM.payer_id == user.id)
        elif payment_side and payment_side == PaymentSide.PAYEE:
            query = query.filter(ContractPaymentROM.payee_id == user.id)
        else:
            query = query.filter(
                or_(
                    ContractPaymentROM.payer_id == user.id,  # type: ignore
                    ContractPaymentROM.payee_id == user.id,  # type: ignore
                )
            )

        # order_by_clause = params.get_order(ContractPaymentROM)

        total_count = query.count()

        payments: list[ContractPaymentROM] = (
            query.order_by(desc(ContractPaymentROM.paid_at or ContractPayment.created_at))  # type: ignore
            .limit(params.limit)
            .all()
        )

        data = [payment.dumps() for payment in payments]

        return PaginatedList(
            total_count=total_count,
            start_index=params.offset,
            end_index=params.offset + len(data),
            data=data,
        )
