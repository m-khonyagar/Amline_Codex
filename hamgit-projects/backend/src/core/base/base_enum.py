from enum import StrEnum
from typing import Type, TypeVar

from core.exceptions import ValidationException

T = TypeVar("T", bound="BaseEnum")


class BaseEnum(StrEnum):

    @classmethod
    def resolve(cls: Type[T], value: str) -> T:
        """Resolve an enum value from a string."""
        try:
            return cls(value)
        except (KeyError, ValueError):
            raise ValidationException(
                "invalid_enum_value",
                context={"ENUM": cls.__name__, "VALUE": value},
            )

    @classmethod
    def safe_resolve(cls: Type[T], value: str | None) -> T | None:
        """Safely resolve an enum value from a string."""
        if value is None:
            return None
        return cls.resolve(value)

    def to_dict(self) -> dict:
        return {"name": self.name, "value": self.value}
