import os

from snowflake import SnowflakeGenerator


class SnowflakeIDGenerator:

    def __init__(self):
        self.generator = SnowflakeGenerator(self._get_machine_id())

    def _get_machine_id(self):
        return hash(f"{os.uname().nodename}-{os.getppid()}-{os.getpid()}") & 0x1F

    def get_next_id(self) -> int:
        id = next(self.generator)
        if not id:
            raise NotImplementedError("ID generation failed")
        return id
