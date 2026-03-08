import abc
from typing import Type, no_type_check

from sqlalchemy import desc

from advertisement.domain.entities.visit_request import VisitRequest
from advertisement.domain.enums import VisitRequestStatus
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class VisitRequestRepository(AbstractRepository[VisitRequest], abc.ABC):
    def find_by_advertisement_id(self, advertisement_id: int) -> list[VisitRequest] | None:
        return self._find_by_advertisement_id(advertisement_id)

    @abc.abstractmethod
    def _find_by_advertisement_id(self, advertisement_id: int) -> list[VisitRequest] | None: ...

    def find_by_requester_user_id(self, requester_user_id: int) -> list[VisitRequest] | None:
        return self._find_by_requester_user_id(requester_user_id)

    @abc.abstractmethod
    def _find_by_requester_user_id(self, requester_user_id: int) -> list[VisitRequest] | None: ...

    def find_by_status(self, status: VisitRequestStatus | None) -> list[VisitRequest] | None:
        return self._find_by_status(status)

    @abc.abstractmethod
    def _find_by_status(self, status: VisitRequestStatus | None) -> list[VisitRequest] | None: ...

    def find_by_requester_and_ad(self, requester_user_id: int, ad_id: int) -> VisitRequest | None:
        return self._find_by_requester_and_ad(requester_user_id, ad_id)

    @abc.abstractmethod
    def _find_by_requester_and_ad(self, requester_user_id: int, ad_id: int) -> VisitRequest | None: ...


class SQLALchemyVisitRequestRepository(AbstractSQLAlchemyRepository[VisitRequest], VisitRequestRepository):
    @property
    def entity_type(self) -> Type[VisitRequest]:
        return VisitRequest

    def _find_by_advertisement_id(self, advertisement_id: int) -> list[VisitRequest] | None:
        return self.query.filter_by(advertisement_id=advertisement_id, deleted_at=None).all()

    def _find_by_requester_user_id(self, requester_user_id: int) -> list[VisitRequest] | None:
        return self.query.filter_by(requester_user_id=requester_user_id, deleted_at=None).all()

    @no_type_check
    def _find_by_status(self, status: VisitRequestStatus | None) -> list[VisitRequest] | None:
        return (
            self.query.filter_by(status=status.value, deleted_at=None).order_by(desc(VisitRequest.created_at)).all()
            if status
            else self.query.filter_by(deleted_at=None).order_by(desc(VisitRequest.created_at)).all()
        )

    def _find_by_requester_and_ad(self, requester_user_id: int, ad_id: int) -> VisitRequest | None:
        return self.query.filter_by(
            requester_user_id=requester_user_id, advertisement_id=ad_id, deleted_at=None
        ).one_or_none()
