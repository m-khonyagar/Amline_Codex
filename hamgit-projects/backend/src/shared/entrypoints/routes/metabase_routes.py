from pprint import pprint
from typing import Dict

import httpx
from fastapi import APIRouter, Body, Request

from core.settings import TELEGRAM_BOT_TOKEN

router = APIRouter(prefix="/admin", tags=["admin-metabase"])


@router.post("/metabase-alert")
def get_file_detail(
    request: Request,
    data: Dict = Body(embed=True, default={}),
):
    r = httpx.post(
        f"https://api.telegram.org/{TELEGRAM_BOT_TOKEN}/sendMessage",
        data={"chat_id": -1002284702439, "text": "Hello, how are you?"},
    )

    pprint(data)
    pprint(r.json())
    return "test"
