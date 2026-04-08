import dataclasses
from abc import ABC
from typing import Generic, Type, TypeVar

T = TypeVar("T", bound="BaseDto")


@dataclasses.dataclass
class BaseDto(Generic[T], ABC):
    def dumps(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def loads(cls: Type[T], data: dict) -> T:
        return cls(**data)

    def convert_empty_string_to_none(self) -> None:
        for field in dataclasses.fields(self):
            value = getattr(self, field.name)
            if isinstance(value, str) and value == "":
                setattr(self, field.name, None)
