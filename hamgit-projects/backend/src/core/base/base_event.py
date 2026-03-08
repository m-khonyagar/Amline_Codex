import dataclasses
import json
from typing import Type, TypeVar

T = TypeVar("T", bound="BaseEvent")


@dataclasses.dataclass
class BaseEvent:

    def dumps(self) -> str:
        return json.dumps(dataclasses.asdict(self))

    @classmethod
    def loads(cls: Type[T], data: str) -> T:
        return cls(**json.loads(data))

    @classmethod
    def get_name(cls) -> str:
        return cls.__name__
