import asyncio
import json

from aiormq import exceptions as aio_exceptions

from core.logger import Logger
from shared.service_layer.services.broker_service import RabbitMQClient

logger = Logger("MessagingWorker")


async def send_email(data: dict):
    try:
        logger.info(f"worker works{data}")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")


async def send_sms(data: dict):
    try:
        logger.info(f"worker works{data}")
    except Exception as e:
        logger.error(f"Failed to send SMS: {e}")


async def process_message(queue_name: str):
    connection = await RabbitMQClient().get_connection()
    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue(queue_name, durable=True)

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                try:
                    message_content = json.loads(message.body.decode())
                    if message_content["type"] == "email":
                        await send_email(message_content)
                    elif message_content["type"] == "sms":
                        await send_sms(message_content)
                    await message.ack()
                except Exception as e:
                    logger.error(f"Error processing message: {e}")
                    try:
                        await message.nack(requeue=True)
                    except aio_exceptions.ChannelClosed:
                        logger.error(f"Failed to nack message due to channel closure: {e}")
                    except Exception as nack_e:
                        logger.error(f"Failed to nack message: {nack_e}")


async def start_worker(queue_name: str):
    await asyncio.gather(process_message(queue_name))


async def run_all_workers():
    await asyncio.gather(start_worker("EMAIL"), start_worker("SMS"))


def messaging_worker():
    asyncio.run(run_all_workers())


# CMD ["gunicorn", "-c", "gunicorn.conf.py", "main:app", "--workers", "2", "--worker-class",
# "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--timeout", "120"]
