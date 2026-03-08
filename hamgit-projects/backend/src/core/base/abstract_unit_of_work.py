import datetime as dt
from abc import ABC, abstractmethod
from typing import Any


class AbstractUnitOfWork(ABC):

    def __enter__(self) -> "AbstractUnitOfWork":
        return self

    def __exit__(self, *args) -> None:
        if any(args):
            self.rollback()
        self.session.close()

    def commit(self) -> None:
        self._commit()

    @abstractmethod
    def _commit(self): ...

    def flush(self) -> None:
        self._flush()

    @abstractmethod
    def _flush(self): ...

    @abstractmethod
    def rollback(self): ...

    @property
    @abstractmethod
    def session(self) -> Any: ...

    @abstractmethod
    def fetchone(self, query_string: str, **kwargs) -> dict | None: ...

    @abstractmethod
    def fetchall(self, query_string: str, **kwargs) -> list[dict]: ...

    @abstractmethod
    def execute(self, query_string: str, **kwargs) -> None: ...

    @property
    def now(self) -> dt.datetime:
        return dt.datetime.now(tz=dt.timezone.utc)
