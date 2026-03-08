import datetime as dt
import difflib
import random
import re
import string
from typing import TypeVar

import jdatetime
import requests

from account.domain.enums import UserRole
from core.exceptions import PermissionException, ValidationException
from core.policies import ALLOWED_ASSIGNS
from core.translates import validation_trans
from core.types import Otp
from shared.domain.enums import OtpType

swear_words: set = set()


def generate_contract_password(length: int) -> str:
    return "".join(random.choice(string.digits) for _ in range(length))


def generate_random_otp() -> int:
    return random.randint(10000, 99999)


def generate_otp(mobile: str, otp_type: OtpType) -> Otp:
    otp_code = random.randint(10000, 99999)
    otp_key = get_otp_key(mobile=mobile, otp_type=otp_type)
    return Otp(type=otp_type, key=otp_key, value=str(otp_code))


def get_now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def validate_mobile_number(mobile: str) -> str:
    PHONE_PATTERN = r"^09[0-9]{9}$"
    WITHOUT_ZERO_PATTERN = r"^9[0-9]{9}$"
    if re.match(PHONE_PATTERN, mobile):
        return mobile
    elif re.match(WITHOUT_ZERO_PATTERN, mobile):
        return "0" + mobile
    else:
        raise ValidationException(validation_trans.invalid_mobile_number)


def validate_national_code(national_code: str) -> str:
    if not national_code.isdigit():
        raise ValidationException(validation_trans.national_code_invalid_characters)
    if len(national_code) != 10:
        raise ValidationException(validation_trans.national_code_invalid_length)
    return national_code


def get_otp_key(mobile: str, otp_type: OtpType) -> str:
    return f"{otp_type.value}:{mobile}"


def generate_discount_code() -> str:
    characters = string.ascii_letters + string.digits
    discount_code = "".join(random.choices(characters, k=7))
    return discount_code


def create_timedelta(days: int = 0, seconds: int = 0, minutes: int = 0, hours: int = 0) -> dt.timedelta:
    """
    Create a timedelta object based on provided arguments.
    At least one of the arguments must be non-zero.
    """
    if not any([days, seconds, minutes, hours]):
        raise ValidationException(
            detail="invalid_timedelta", context={"message": "At least one argument must be non-zero."}
        )
    return dt.timedelta(days=days, seconds=seconds, minutes=minutes, hours=hours)


def gregorian_to_jalali(date: dt.date):
    jalali_date = jdatetime.date.fromgregorian(date=date)
    return jalali_date


def jalali_to_gregorian(date: jdatetime.date):
    gregorian_date = date.togregorian()
    return gregorian_date


def calculate_jalali_payment_dates(
    start_date: jdatetime.date, end_date: jdatetime.date, chosen_day: int
) -> list[jdatetime.date]:
    payment_dates = []

    if start_date.day >= chosen_day:
        current_month = start_date.month + 1
        current_year = start_date.year
        if current_month > 12:
            current_month = 1
            current_year += 1
    else:
        current_month = start_date.month
        current_year = start_date.year

    while True:
        day = chosen_day
        if day == 31 and current_month > 6:
            day = 30

        if day == 30 and current_month == 12:
            try:
                next_payment_date = jdatetime.date(current_year, current_month, day)
            except Exception:
                day = 29

        next_payment_date = jdatetime.date(current_year, current_month, day)

        if next_payment_date >= start_date and next_payment_date <= end_date:
            payment_dates.append(next_payment_date)
        else:
            break

        current_month += 1
        if current_month > 12:
            current_month = 1
            current_year += 1

    return payment_dates


def contains_swear_words(text: str) -> bool:

    global swear_words
    if not swear_words:
        url = "https://raw.githubusercontent.com/amirshnll/Persian-Swear-Words/master/data.json"
        response = requests.get(url)
        if response.status_code == 200:
            swear_words = set(response.json()["word"])

    return any(word in swear_words for word in text.split())


T = TypeVar("T")


def remove_user_objects(entities: T) -> T:

    if isinstance(entities, list):
        for entity in entities:
            if hasattr(entity, "user"):
                if entity.user:  # type: ignore
                    delattr(entity, "user")
    else:
        if hasattr(entities, "user"):
            if entities.user:  # type: ignore
                delattr(entities, "user")

    return entities


def strings_are_similar(str1, str2, threshold=0.7):
    similarity_ratio = difflib.SequenceMatcher(None, str1, str2).ratio()
    return similarity_ratio >= threshold


def arabic_to_persian(text: str | None) -> str | None:
    if text is None:
        return None
    words = {"ي": "ی", "ك": "ک", "ة": "ه"}
    for arabic_char, persian_char in words.items():
        text = text.replace(arabic_char, persian_char)
    return text


def can_assign_role(
    assigner_roles: list[UserRole], assignee_roles: list[UserRole], existing_assignee_roles: list[UserRole]
):
    allowed_roles = set().union(*[ALLOWED_ASSIGNS.get(i, set()) for i in assigner_roles])
    not_allowed_roles = set(existing_assignee_roles) - allowed_roles
    if not set(assignee_roles) <= allowed_roles or not_allowed_roles & set(existing_assignee_roles):
        raise PermissionException
