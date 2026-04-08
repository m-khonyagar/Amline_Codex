# flake8: noqa E501

from contract.domain.enums import PaymentType
from contract.domain.prcontract.prcontract_commission_service import (
    PRContractCommissionService,
)
from core import settings
from core.exceptions import PermissionException
from core.translates import perm_trans
from core.types import CurrentUser
from financial.domain.entities.invoice_items import InvoiceItem
from financial.domain.enums import DiscountType, InvoiceItemType
from financial.service_layer.dtos import ApplyPromoCodeDto
from unit_of_work import UnitOfWork


class DiscountCalculator:
    PERCENTAGE = lambda amount, discount: amount * (discount / 100)
    STATIC = lambda amount, discount: discount if amount - discount >= 0 else amount
    FORCE = lambda amount, discount: amount - discount if amount - discount >= 0 else 0
    MAPPER = {DiscountType.PERCENTAGE: PERCENTAGE, DiscountType.STATIC: STATIC, DiscountType.FORCE: FORCE}

    @classmethod
    def calculate(cls, discount_type: DiscountType, amount: int, discount: int):
        calculator = cls.MAPPER.get(discount_type)
        return int(calculator(amount, discount)) * -1  # type: ignore


def apply_promo_code_handler(command: ApplyPromoCodeDto, uow: UnitOfWork, current_user: CurrentUser):
    with uow:
        promo_code = command.promo_code

        invoice = uow.invoices.get_or_raise(id=command.invoice_id)
        payment = uow.contract_payments.get_or_raise(invoice_id=invoice.id)

        # exclude non commission payments
        prcontract = uow.prcontracts.get_by_contract_id(payment.contract_id)
        if (prcontract and prcontract.is_guaranteed) or payment.type != PaymentType.COMMISSION:
            raise PermissionException(perm_trans.forbidden_action)

        # check if there is already a discount
        if invoice.items and next(
            (i for i in invoice.items if i.type == InvoiceItemType.DISCOUNT and i.deleted_at is None), None
        ):
            raise PermissionException(perm_trans.only_one_promo_code_per_invoice)

        # get discount object and calculate discount amount
        discount_obj = uow.discounts.find_and_validate_code(
            code=promo_code,
            resource_type=payment.type,
            current_user_phone=current_user.mobile,
            roles=current_user.roles,
        )
        discount_amount = DiscountCalculator.calculate(
            discount_type=discount_obj.type, amount=invoice.initial_amount, discount=discount_obj.value
        )
        if discount_amount == 0:
            raise PermissionException(perm_trans.forbidden_action)

        invoice_item = InvoiceItem.create(
            invoice_id=command.invoice_id,
            type=InvoiceItemType.DISCOUNT,
            amount=discount_amount,
            extra_info=promo_code,
        )

        # update tax based on updated commission amount
        commission_service = PRContractCommissionService(amline_user_id=int(settings.AMLINE_UID))
        tax_item: InvoiceItem | None = (
            next(item for item in invoice.items if item.type == InvoiceItemType.TAX) if invoice.items else None
        )
        if tax_item:
            tax_item.amount = commission_service.calculate_tax(total_amount=invoice.initial_amount + discount_amount)

        uow.invoice_items.add(invoice_item)
        uow.commit()
        uow.invoices.refresh(invoice)

        return invoice.dumps()
