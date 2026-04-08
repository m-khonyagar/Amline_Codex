import datetime as dt
from abc import ABC, abstractmethod

import requests

from core.exceptions import ValidationException
from core.helpers import arabic_to_persian, gregorian_to_jalali
from core.logger import Logger
from core.translates import validation_trans
from core.types import ZohalConfig
from shared.service_layer.exceptions import ZohalServiceUnavailableException


class UserVerifierService(ABC):
    def verify_user_info(self, national_code: str, birth_date: dt.date, mobile: str) -> dict:
        self.verify_mobile_ownership(mobile, national_code)
        return self.retrieve_user_details(national_code, birth_date)

    @abstractmethod
    def retrieve_user_details(self, national_code: str, birth_date: dt.date) -> dict:
        raise NotImplementedError

    @abstractmethod
    def verify_mobile_ownership(self, mobile: str, national_code: str) -> None:
        raise NotImplementedError


class ZohalVerifier(UserVerifierService):
    def __init__(self, configs: ZohalConfig):
        self.base_url = configs.uri
        self.secret = configs.secret
        self.logger = Logger("Zohal")

    def verify_mobile_ownership(self, mobile: str, national_code: str) -> None:
        url = f"{self.base_url}/services/inquiry/shahkar"
        headers = {"Authorization": f"Bearer {self.secret}"}
        data = {"mobile": mobile, "national_code": national_code}

        try:
            response = self._make_request(url, "POST", headers, data)

        except ZohalServiceUnavailableException:
            return

        is_valid = response.get("response_body", {}).get("data", {}).get("matched", False)

        if not is_valid:
            raise ValidationException(validation_trans.mobile_and_national_code_dont_match)

    def retrieve_user_details(self, national_code: str, birth_date: dt.date) -> dict:
        jbd = gregorian_to_jalali(birth_date).isoformat()
        str_jbd = jbd.replace("-", "/")

        url = f"{self.base_url}/services/inquiry/national_identity_inquiry"
        headers = {"Authorization": f"Bearer {self.secret}"}
        data = {"birth_date": str_jbd, "national_code": national_code}

        try:
            response = self._make_request(url, "POST", headers, data)

        except ZohalServiceUnavailableException:
            return {"national_code": national_code, "birth_date": birth_date, "is_verified": False}

        if response.get("response_body", {}).get("error_code"):
            raise ValidationException(validation_trans.mobile_and_national_code_dont_match)

        if response.get("response_body", {}).get("is_dead"):
            raise ValidationException(validation_trans.cant_create_condtract_for_a_dead_person)

        res = response.get("response_body", {}).get("data", {})

        try:
            return {
                "national_code": national_code,
                "birth_date": birth_date,
                "first_name": arabic_to_persian(res["first_name"]),
                "last_name": arabic_to_persian(res["last_name"]),
                "father_name": res["father_name"],
                "is_verified": True,
            }

        except KeyError:
            raise ValidationException(validation_trans.birthdate_and_national_code_dont_match)

    def _make_request(self, url: str, method: str, headers: dict, data: dict | None = None) -> dict:
        try:
            response = requests.request(method, url, json=data, headers=headers)
            if response.status_code >= 500:
                self.logger.error(f"Request to {url} failed: {response.text}")
                raise ZohalServiceUnavailableException
            return response.json()

        except requests.RequestException as e:
            self.logger.error(f"Request to {url} failed: {e}")
            raise ZohalServiceUnavailableException
