import abc
from datetime import UTC, datetime
from typing import Type, no_type_check

from sqlalchemy import ARRAY, String, cast, or_

from account.domain.enums import UserRole
from contract.domain.enums import PaymentType
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.exceptions import PermissionException
from core.translates import perm_trans
from financial.domain.entities.discount import Discount


class DiscountRepository(AbstractRepository[Discount], abc.ABC):

    def find_by_code(self, code: str) -> Discount | None:
        return self._find_by_code(code)

    def find_and_validate_code(
        self, code: str, resource_type: PaymentType, current_user_phone: str, roles: list[UserRole]
    ) -> Discount:
        promo = self._find_and_validate_code(
            code=code, resource_type=resource_type, current_user_phone=current_user_phone, roles=roles
        )
        if not promo:
            raise PermissionException(perm_trans.invalid_promo_code)
        return promo

    @abc.abstractmethod
    def _find_by_code(self, code: str) -> Discount | None: ...

    @abc.abstractmethod
    def _find_and_validate_code(
        self, code: str, resource_type: PaymentType, current_user_phone: str, roles: list[UserRole]
    ) -> Discount: ...


class SQLAlchemyDiscountRepository(AbstractSQLAlchemyRepository[Discount], DiscountRepository):

    @property
    def entity_type(self) -> Type[Discount]:
        return Discount

    def _find_by_code(self, code: str) -> Discount | None:
        return self.query.filter_by(code=code, deleted_at=None).one_or_none()

    @no_type_check
    def _find_and_validate_code(
        self, code: str, resource_type: PaymentType, current_user_phone: str, roles: list[UserRole]
    ) -> Discount | None:

        return self.query.filter(
            Discount.code == code,
            Discount.is_active.is_(True),
            Discount.deleted_at.is_(None),
            or_(Discount.ends_at >= datetime.now(UTC), Discount.ends_at.is_(None)),
            or_(Discount.resource_type == resource_type, Discount.resource_type.is_(None)),
            Discount.used_counts < Discount.usage_limit,
            or_(
                Discount.specified_roles.is_(None),
                Discount.specified_roles == [],
                cast(Discount.specified_roles, ARRAY(String)).op("&&")(cast([roles], ARRAY(String))),
            ),
            or_(Discount.specified_user_phone.is_(None), Discount.specified_user_phone == current_user_phone),
        ).one_or_none()
