import abc
from typing import Type

from sqlalchemy import desc

from advertisement.domain.entities.swap_ad import SwapAd
from advertisement.domain.enums import AdStatus
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.types import PaginateParams


class SwapAdRepository(AbstractRepository[SwapAd], abc.ABC):
    def find_all(self, params: PaginateParams) -> list[SwapAd]:
        return self._find_all(params)

    def find_all_published(self, params: PaginateParams) -> list[SwapAd]:
        return self._find_all_published(params)

    def find_by_user_id(self, user_id: int) -> list[SwapAd] | None:
        return self._find_by_user_id(user_id)

    @abc.abstractmethod
    def _find_by_user_id(self, user_id: int) -> list[SwapAd] | None: ...

    @abc.abstractmethod
    def _find_all(self, params: PaginateParams) -> list[SwapAd]: ...

    @abc.abstractmethod
    def _find_all_published(self, params: PaginateParams) -> list[SwapAd]: ...


class SQLALchemySwapAdRepository(AbstractSQLAlchemyRepository[SwapAd], SwapAdRepository):

    @property
    def entity_type(self) -> Type[SwapAd]:
        return SwapAd

    def _find_by_user_id(self, user_id: int) -> list[SwapAd] | None:
        return self.query.filter_by(user_id=user_id, deleted_at=None).one_or_none()

    def _find_all(self, params: PaginateParams) -> list[SwapAd]:
        return self.query.filter_by(deleted_at=None).offset(params.offset).limit(params.limit).all()

    def _find_all_published(self, params: PaginateParams) -> list[SwapAd]:
        return (
            self.query.filter_by(status=AdStatus.PUBLISHED, deleted_at=None)
            .order_by(desc(SwapAd.accepted_at))  # type: ignore
            .offset(params.offset)
            .limit(params.limit)
            .all()
        )
