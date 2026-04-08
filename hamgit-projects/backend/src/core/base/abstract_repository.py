import abc
from typing import Generic, Type, TypeVar

import sqlalchemy as sa
from sqlalchemy.orm import Query, Session

from core.base.base_entity import BaseEntity
from core.exceptions import NotFoundException, ProcessingException
from core.translates import not_found_trans
from core.types import FilterCriteria, PaginateParams

T = TypeVar("T", bound="BaseEntity")


class AbstractRepository(Generic[T], abc.ABC):

    @property
    @abc.abstractmethod
    def entity_type(self) -> Type[T]:
        """
        Return the entity type that the repository is responsible for.
        """
        raise NotImplementedError

    def get_or_raise(self, **kwargs) -> T:
        """
        Return the entity if it is found, otherwise raise NotFoundException.
        """
        entity = self.get(**kwargs)
        if not entity:
            raise NotFoundException(detail=getattr(not_found_trans, self.entity_type.entity_name()))
        return entity

    @abc.abstractmethod
    def get_with_lock(self, **kwargs) -> T:
        """
        Return the entity with lock for race conditions.
        """
        raise NotImplementedError

    @abc.abstractmethod
    def add(self, entity: T) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_all(self, entities: list[T]) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def refresh(self, entity: T) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def refresh_all(self, entities: list[T]) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_id(self, entity_id: int) -> T | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_ids(self, entity_ids: list[int]) -> list[T]:
        raise NotImplementedError

    @abc.abstractmethod
    def get(self, **kwargs) -> T | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all(self, params: PaginateParams, filters: list[FilterCriteria] = list()) -> tuple[int, list[T]]:
        """
        Return a list of entities with pagination, sorting and filtering.
        """
        raise NotImplementedError

    @abc.abstractmethod
    def get_random_object(self) -> T:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all_simple(self, **kwargs) -> list[T]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all_count(self) -> int:
        raise NotImplementedError


class AbstractSQLAlchemyRepository(AbstractRepository[T], abc.ABC):

    def __init__(self, session: Session, *args, **kwargs) -> None:
        self.session = session

    @property
    def query(self) -> Query:
        return self.session.query(self.entity_type)

    def add(self, entity: T) -> None:
        self.session.add(entity)

    def add_all(self, entities: list[T]) -> None:
        self.session.add_all(entities)

    def refresh(self, entity: T) -> None:
        self.session.refresh(entity)

    def refresh_all(self, entities: list[T]) -> None:
        for obj in entities:
            self.session.refresh(obj)

    def get_by_id(self, entity_id: int) -> T | None:
        return self.query.get(entity_id)

    def get_by_ids(self, entity_ids: list[int]) -> list[T]:
        return self.query.filter(
            self.entity_type.id.in_(entity_ids),  # type: ignore
            self.entity_type.deleted_at.is_(None),  # type: ignore
        ).all()

    def get(self, **kwargs) -> T | None:
        deleted_at = kwargs.pop("deleted_at", None)
        try:
            return self.query.filter_by(**kwargs, deleted_at=deleted_at).first()
        except Exception as e:
            print(e)
            raise ProcessingException(
                detail="wrong_query_params_for_get_method",
                context={"repo": self.__class__.__name__, "kwargs": kwargs},
            )

    def get_with_lock(self, **kwargs) -> T:
        deleted_at = kwargs.pop("deleted_at", None)
        result = self.query.with_for_update(key_share=True).filter_by(**kwargs, deleted_at=deleted_at).first()
        if result:
            return result
        raise NotFoundException(detail=f"{self.entity_type.entity_name()}.NotFound")

    def get_all(self, params: PaginateParams, filters: list[FilterCriteria] = list()) -> tuple[int, list[T]]:
        order_clause = params.get_order(entity_type=self.entity_type)
        filter_expressions = [self._build_filter_expressions(criteria) for criteria in filters]

        # Base query with filters applied
        base_query = self.query.filter(sa.or_(*filter_expressions))

        # Get total count of records
        total_count = base_query.count()

        # Apply ordering, limit, and offset for the paginated query
        paginated_query = base_query.order_by(order_clause).limit(params.limit).offset(params.offset)
        entities = paginated_query.all()

        return total_count, entities

    def _build_filter_expressions(self, criteria: FilterCriteria) -> sa.ColumnElement:
        """
        Build filter expressions based on the field names and value in the criteria.
        """
        expressions = []
        value = criteria["value"]
        for field_name in criteria["field_names"]:
            column: sa.Column = getattr(self.entity_type, field_name)
            if isinstance(column.type, sa.String):
                expressions.append(column.ilike(f"%{value}%"))
            elif isinstance(column.type, sa.Integer):
                try:
                    expressions.append(column == int(value))
                except ValueError:
                    pass
            else:
                expressions.append(column == value)

        return sa.or_(*expressions)

    def get_random_object(self) -> T:
        result = self.query.order_by(sa.func.random()).first()
        if result:
            return result
        raise NotFoundException(detail=f"{self.entity_type.entity_name()}.NotFound")

    def get_all_simple(self, **kwargs) -> list[T]:
        return self.query.filter_by(**kwargs, deleted_at=None).all()

    def get_all_count(self) -> int:
        return self.query.filter_by(deleted_at=None).count()
