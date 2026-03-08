import abc
import json
from typing import Any, Type

import aio_pika
from pydantic import BaseModel
from redis import Redis, RedisError
from redis.client import PubSub

from core import settings
from core.base.base_event import BaseEvent
from core.logger import Logger
from core.types import RedisConfig

logger = Logger("broker-service")


class BrokerService(abc.ABC):
    def __enter__(self) -> "BrokerService":
        return self

    def __exit__(self, *_) -> None:
        self.close()

    @abc.abstractmethod
    def close(self) -> None:
        """Close the connection to the broker."""

    @abc.abstractmethod
    def publish(self, event: BaseEvent) -> None:
        """Publish a message to a destination."""

    @abc.abstractmethod
    def get_next_event(self, event_cls: Type[BaseEvent]) -> BaseEvent | None:
        """Get the next event of the specified type from the destination."""


class RedisBroker(BrokerService):
    _client: Redis | None
    _pubsub: PubSub | None

    def __init__(self, config: RedisConfig) -> None:
        self.config = config
        self._client = None
        self._pubsub = None

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
        return self._client

    @property
    def pubsub(self) -> PubSub:
        if not self._pubsub:
            self._pubsub = self.client.pubsub()
            logger.debug("Redis PubSub created")
        return self._pubsub

    def publish(self, event: BaseEvent) -> None:
        try:
            self.client.publish(channel=event.get_name(), message=event.dumps())
        except RedisError:
            pass

    def get_next_event(self, event_cls: Type[BaseEvent]) -> BaseEvent | None:
        self._subscribe(event_cls)  # Ensure subscription

        try:
            message = self.pubsub.get_message()
            if message and message["type"] == "message":
                return event_cls.loads(message["data"])

        except RedisError:
            pass

        return None

    def close(self) -> None:
        self.pubsub.close()
        self.client.close()

    def _subscribe(self, event_cls: Type[BaseEvent]) -> None:
        """Subscribe to the specified event class."""
        try:
            self.pubsub.subscribe(event_cls.get_name())
        except RedisError:
            pass


class RabbitMQClient:
    uri = settings.RABBITMQ_URI

    @classmethod
    async def get_connection(cls):
        return await aio_pika.connect_robust(cls.uri)

    @classmethod
    async def send_message(cls, queue_name: str, message: BaseModel):
        connection = await cls.get_connection()
        async with connection:
            channel = await connection.channel(publisher_confirms=True)
            await channel.declare_queue(queue_name, durable=True)
            await channel.default_exchange.publish(
                aio_pika.Message(
                    body=message.model_dump_json().encode(), delivery_mode=aio_pika.DeliveryMode.PERSISTENT
                ),
                routing_key=queue_name,
            )

    @classmethod
    async def consume_messages(cls, queue_name: str, handler: Any):
        connection = await cls.get_connection()
        async with connection:
            channel = await connection.channel()
            queue = await channel.declare_queue(queue_name, durable=True)

            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    async with message.process(ignore_processed=True):
                        try:
                            data = json.loads(message.body.decode())
                            await handler(data)
                        except Exception as e:
                            logger.error(f"Error processing message: {e}")
                            await message.reject(requeue=True)
