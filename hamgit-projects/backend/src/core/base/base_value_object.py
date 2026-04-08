from abc import ABC, abstractmethod
from typing import Type


class BaseValueObject[T](ABC):

    @abstractmethod
    def dumps(self, **kwargs) -> dict:
        raise NotImplementedError

    @classmethod
    def loads(cls: Type[T], data: dict) -> T:
        raise NotImplementedError
