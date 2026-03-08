import abc
import json
from datetime import timedelta, datetime
from typing import Optional

import di
import redis
from redis import Redis

from core import settings
from core.exceptions import ValidationException
from core.logger import Logger
from core.translates import validation_trans
from core.types import RedisConfig

from contract.service_layer.send_reminder_sms import send_reminder

from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.schedulers.background import BackgroundScheduler

logger = Logger("cache-service")


class CacheService(abc.ABC):

    def pop(self, key: str) -> str | None:
        value = self.get(key)
        if value:
            self.delete(key)
        return value

    @abc.abstractmethod
    def get(self, key: str) -> str | None: ...

    @abc.abstractmethod
    def set(self, key: str, value: str, exp: timedelta) -> None: ...

    @abc.abstractmethod
    def delete(self, key: str) -> None: ...

    @abc.abstractmethod
    def set_object(self, key: str, value: dict, exp: timedelta | None = None) -> None: ...

    @abc.abstractmethod
    def get_object(self, key: str) -> dict | None: ...


class RedisCacheService(CacheService):
    _client: Redis | None
    _scheduler: BackgroundScheduler | None

    def __init__(self, config: RedisConfig) -> None:
        self._client = None
        self.config = config

    @property
    def client(self) -> Redis:
        if not self._client:
            self._client = Redis(
                host=self.config.host,
                port=self.config.port,
                password=self.config.password,
                db=self.config.db,
                decode_responses=True,
            )

            self._scheduler = BackgroundScheduler()

            self._scheduler.add_job(
                lambda: send_reminder(
                    self.get_cached_contracts(timedelta(hours=1)), 
                    di.get_sms_service()
                ),
                trigger=IntervalTrigger(minutes=15),
            )

            self._scheduler.start()

        return self._client

    def get(self, key: str) -> str | None:
        return self.client.get(key)  # type: ignore

    def set(self, key: str, value: str, exp: timedelta) -> None:
        if exp:
            self.client.setex(name=key, time=exp, value=value)
        else:
            self.client.set(name=key, value=value)

    def delete(self, key: str) -> None:
        self.client.delete(key)

    def set_object(self, key: str, value: dict, exp: timedelta | None = None) -> None:
        try:
            self.client.set(key, json.dumps(value))
            if exp:
                self.client.expire(key, exp)

        except json.JSONDecodeError as err:
            logger.error(f"Error in setting object in cache: {err}")
            raise ValidationException(validation_trans.invalid_value_for_caching)

    def get_object(self, key: str) -> dict | None:
        value = self.client.get(key)
        if value:
            return json.loads(str(value))
        return None

    def cache_contract_start(self, contract_id: int, user_mobile: str) -> None:
        self.client.hsetnx("contract_schedular", f"{contract_id}-{user_mobile}", datetime.now().timestamp().__int__())

    def get_cached_contracts(self, exp: timedelta, delete_before_return: bool = True) -> list[tuple[str, str]]:
        results = self.client.hgetall("contract_schedular")

        results = {
            constract_detail
            for constract_detail, cached_time in results.items()
            if datetime.fromtimestamp(int(cached_time)) + exp < datetime.now()
        }

        if delete_before_return and results:
            self.client.hdel("contract_schedular", *results)

        return list(
            map(
                lambda x: tuple(x.split("-")), results
            )
        )

    def delete_cached_contract(self, contract_id: int, user_mobile: str):
        self.client.hdel("contract_schedular", f"{contract_id}-{user_mobile}")

    # def cache_otp(self, key: str, otp: int, exp: timedelta = timedelta(minutes=2)):
    #     with self.client.pipeline() as pipe:
    #         pipe.hset("account_user_otp", key, otp)
    #         pipe.hexpire("account_user_otp", exp, key)

    #         pipe.execute()

    # def check_otp(self, key: str, user_otp: str):
    #     result = self.client.hget("account_user_otp", key)

    #     if result == user_otp:
    #         self.client.hdel("account_user_otp", key)

    #     else:
    #         raise ValueError(user_otp)

    def cache_otp(self, key: str, otp: int, exp: timedelta = timedelta(minutes=2)):
        self.client.setex(key, exp, otp)

    def check_otp(self, key: str, user_otp: str) -> str | None:
        result = self.client.get(key)

        if result == user_otp:
            self.client.hdel("account_user_otp", key)

        else:
            raise ValueError(user_otp)

        return result                


class RedisClient:
    _connection: Redis | None = None

    @classmethod
    def _get_connection(cls):
        if not cls._connection:
            config = settings.redis_config
            cls._connection = redis.Redis(
                host=config.host,
                port=config.port,
                password=config.password,
                encoding="utf-8", decode_responses=True
            )

        return cls._connection

    @classmethod
    def get_value(cls, key: str) -> str | None:
        return cls._get_connection().get(key)  # type: ignore

    @classmethod
    def set_value(cls, key: str, value: str | int, exp: Optional[int] = None) -> None:
        connection = cls._get_connection()
        with connection.pipeline() as pipe:
            pipe.set(key, value)
            if exp:
                pipe.expire(key, time=exp)
            pipe.execute()

    @classmethod
    def delete_key(cls, key: str) -> None:
        cls._get_connection().delete(key)

    @classmethod
    def get_ttl(cls, key: str):
        return cls._get_connection().ttl(key)

    @classmethod
    def increment_with_ttl(cls, key: str, exp: Optional[int] = None):
        connection = cls._get_connection()
        with connection.pipeline() as pipe:
            pipe.incr(key)
            if exp is not None:
                pipe.expire(key, exp)
            pipe.execute()
