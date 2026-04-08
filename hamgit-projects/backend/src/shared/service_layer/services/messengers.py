import httpx

from core import settings


def send_telegram_message(message):
    url = settings.telegram_urls.send_message.format(token=settings.TELEGRAM_BOT_TOKEN)
    payload = {"chat_id": settings.TELEGRAM_CHANNEL_ID, "text": message}
    response = httpx.post(url, json=payload)
    print(response.json())
