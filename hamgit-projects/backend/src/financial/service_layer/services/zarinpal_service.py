from typing import Dict

import requests

from core import settings
from core.exceptions import ProcessingException
from core.types import CurrentUser
from financial.domain.entities.transaction import Transaction


class ZarinpalService:
    ENDPOINT = settings.ZARINPAL_ENDPOINT
    TOKEN = settings.ZARINPAL_TOKEN
    HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}

    def _req(self, method: str, action_path: str, data):
        url = self.ENDPOINT + action_path
        if method == "post":
            response = requests.post(url, headers=self.HEADERS, json=data)
        else:
            response = requests.get(url, headers=self.HEADERS, params=data)

        return response

    def request(self, transaction: Transaction, return_url: str, user_mobile: str) -> dict:
        data: Dict[str, str] = {}
        response = self._req(
            "post",
            "/v4/payment/request.json",
            {
                "merchant_id": self.TOKEN,
                "amount": (transaction.amount) * 10,
                "currency": "IRR",
                "description": transaction.description or "amline_payment",
                "callback_url": return_url,
                "mobile": user_mobile,
            },
        )
        response_data = response.json()
        if response_data.get("errors"):
            if isinstance(response_data["errors"], list):
                status = True
                data = {
                    "authority_code": response_data["data"]["authority"],
                    "link": f'{settings.ZARINPAL_ENDPOINT}/StartPay/{response_data["data"]["authority"]}',
                }
            else:
                data = response_data["errors"]
                status = False
        else:
            data = response_data
            status = True

        return {"status": status, "data": data}

    def verify(self, transaction: Transaction):
        response = self._req(
            "post",
            "/v4/payment/verify.json",
            {"merchant_id": self.TOKEN, "amount": (transaction.amount) * 10, "authority": transaction.authority_code},
        )
        data = response.json()
        if isinstance(data["errors"], list):
            verify = True
            data = data["data"]
            ref_id = data["ref_id"]
        else:
            verify = False
            data = data["errors"]
            ref_id = transaction.reference_id

        return {"verify": verify, "details": data, "ref_id": str(ref_id)}

    def get_purchase_url(self, transaction: Transaction, current_user: CurrentUser) -> str:
        data = self.request(
            transaction,
            settings.ZARINPAL_CALL_BACK_URL,
            current_user.mobile,
        )
        if data.get("status"):
            response: dict = data.get("data", {})
            response_data: dict = response.get("data", {})
            transaction.authority_code = response_data.get("authority")
            return f"https://www.zarinpal.com/pg/StartPay/{response_data['authority']}"
        else:
            raise ProcessingException(str(data))
