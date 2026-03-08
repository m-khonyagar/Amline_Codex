import abc
from typing import Type, no_type_check

from contract.domain.entities import ContractPayment
from contract.domain.enums import PaymentType
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.exceptions import NotFoundException
from core.translates import not_found_trans


class ContractPaymentRepository(AbstractRepository[ContractPayment], abc.ABC):

    @property
    def entity_type(self) -> Type[ContractPayment]:
        return ContractPayment

    def get_user_commission_payment_or_raise(self, contract_id: int, user_id: int) -> ContractPayment:

        payment = self.get_user_commission_payment(contract_id, user_id)

        if not payment:
            raise NotFoundException(not_found_trans.contract_payment_not_found)

        return payment

    @abc.abstractmethod
    def get_by_contract_id(self, contract_id: int, payment_type: PaymentType | None = None) -> list[ContractPayment]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_invoice_id(self, invoice_id: int) -> ContractPayment | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_invoice_ids(self, invoice_ids: list[int]) -> list[ContractPayment]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_user_commission_payment(self, contract_id: int, user_id: int) -> ContractPayment | None:
        raise NotImplementedError

    def get_contract_commissions(self, contract_id: int) -> list[ContractPayment]:
        return self.get_by_contract_id(contract_id, PaymentType.COMMISSION)


class SQLAlchemyContractPaymentRepository(AbstractSQLAlchemyRepository[ContractPayment], ContractPaymentRepository):

    @no_type_check
    def get_by_contract_id(self, contract_id: int, payment_type: PaymentType | None = None) -> list[ContractPayment]:
        query = self.query.filter(
            ContractPayment.contract_id == contract_id,
            ContractPayment.deleted_at.is_(None),
        )

        if payment_type:
            query = query.filter(ContractPayment.type == payment_type)

        return query.all()

    @no_type_check
    def get_by_invoice_id(self, invoice_id: int) -> ContractPayment | None:
        return self.query.filter(
            ContractPayment.invoice_id == invoice_id,
            ContractPayment.deleted_at.is_(None),
        ).first()

    @no_type_check
    def get_by_invoice_ids(self, invoice_ids: list[int]) -> list[ContractPayment]:
        return self.query.filter(
            ContractPayment.invoice_id.in_(invoice_ids),
            ContractPayment.deleted_at.is_(None),
        ).all()

    @no_type_check
    def get_user_commission_payment(self, contract_id: int, user_id: int) -> ContractPayment | None:
        return self.query.filter(
            ContractPayment.contract_id == contract_id,
            ContractPayment.payer_id == user_id,
            ContractPayment.type == PaymentType.COMMISSION,
            ContractPayment.deleted_at.is_(None),
        ).first()
