from dataclasses import dataclass
from datetime import date, timedelta
from typing import Protocol

from jdatetime import date as j_date

from core.exceptions import ValidationException
from core.translates import validation_trans


class PRCProtocol(Protocol):
    start_date: date | None
    end_date: date | None
    rent_amount: int | None
    rent_day: int | None


@dataclass
class PRCRentData:
    start_date: date
    end_date: date
    rent_amount: int
    rent_day: int


class MonthlyRentService:

    def generate_rent_schedule(self, data: PRCProtocol) -> list[tuple[date, int]]:
        validated_data = self.validate_data(data)

        if (validated_data.end_date - validated_data.start_date) <= timedelta(days=30):
            return [(validated_data.end_date, validated_data.rent_amount)]

        start_date = j_date.fromgregorian(date=validated_data.start_date)
        end_date = j_date.fromgregorian(date=validated_data.end_date)

        j_rent_schedule: list[tuple[j_date, int]] = []

        reminded_days = 0

        if start_date.day < validated_data.rent_day:
            days_in_month = self.get_days_in_month(start_date.year, start_date.month)
            day = min(validated_data.rent_day, days_in_month)
            payment_date = j_date(start_date.year, start_date.month, day)
            reminded_days = days_in_month - (payment_date - start_date).days  # type: ignore
            days_in_month = self.get_days_in_month(payment_date.year, payment_date.month)
        else:
            if start_date.month == 12:
                next_month = 1
                next_year = start_date.year + 1
            else:
                next_month = start_date.month + 1
                next_year = start_date.year

            days_in_month = self.get_days_in_month(next_year, next_month)

            payment_date = j_date(next_year, next_month, validated_data.rent_day)
            reminded_days = days_in_month - (payment_date - start_date).days  # type: ignore

        while payment_date <= end_date:
            j_rent_schedule.append((payment_date, validated_data.rent_amount))
            if payment_date.month == 12:
                next_month = 1
                next_year = payment_date.year + 1
            else:
                next_month = payment_date.month + 1
                next_year = payment_date.year

            days_in_next_month = self.get_days_in_month(next_year, next_month)
            next_day = min(validated_data.rent_day, days_in_next_month)
            payment_date = j_date(next_year, next_month, next_day)

        last_date, _ = j_rent_schedule[-1]

        if last_date == end_date:
            return [(jd.togregorian(), amount) for jd, amount in j_rent_schedule]

        if start_date.day == end_date.day:
            return [(jd.togregorian(), amount) for jd, amount in j_rent_schedule]

        td = end_date - last_date

        days = abs(reminded_days - td.days)  # type: ignore
        amount_per_day = validated_data.rent_amount / 30
        prorated_amount = round(amount_per_day * days)
        if prorated_amount > 0:
            j_rent_schedule.append((end_date, prorated_amount))

        return [(jd.togregorian(), amount) for jd, amount in j_rent_schedule]

    def calculate_total_rent(self, data: PRCProtocol) -> int:
        if data.start_date == data.end_date:
            return 0
        if data.rent_day:
            rent_schedule = self.generate_rent_schedule(data)
            return sum(amount for _, amount in rent_schedule)

        if not data.start_date or not data.end_date or not data.rent_amount:
            raise ValidationException(validation_trans.contract_information_is_missing)

        if (data.end_date - data.start_date) <= timedelta(days=30):
            return data.rent_amount

        start_date_j = j_date.fromgregorian(date=data.start_date)
        end_date_j = j_date.fromgregorian(date=data.end_date)

        rent_schedule = []

        payment_date = start_date_j

        while payment_date <= end_date_j:

            if payment_date.month == 12:
                next_month = 1
                next_year = payment_date.year + 1
            else:
                next_month = payment_date.month + 1
                next_year = payment_date.year

            days_in_next_month = self.get_days_in_month(next_year, next_month)
            next_day = min(payment_date.day, days_in_next_month)
            payment_date = j_date(next_year, next_month, next_day)

            if payment_date <= end_date_j:
                rent_schedule.append((payment_date, data.rent_amount))

        last_date, _ = rent_schedule[-1]

        if last_date < end_date_j:
            td = end_date_j - last_date
            days = td.days
            amount_per_day = data.rent_amount / 30
            prorated_amount = round(amount_per_day * days)
            rent_schedule.append((end_date_j, prorated_amount))

        return sum([x[1] for x in rent_schedule])

    def get_days_in_month(self, year: int, month: int) -> int:
        """Returns the number of days in a given month of a given year."""
        if month in {1, 2, 3, 4, 5, 6}:  # 31 days
            return 31
        elif month in {7, 8, 9, 10, 11}:  # 30 days
            return 30

        try:
            j_date(year, 12, 30)  # Check for 30 days in month 12
            return 30
        except ValueError:
            return 29

    def validate_data(self, rent_data: PRCProtocol) -> PRCRentData:
        """Validates that all required rent data fields are provided."""
        if rent_data.start_date is None:
            raise ValidationException(validation_trans.start_date_is_required)
        if rent_data.end_date is None:
            raise ValidationException(validation_trans.end_date_is_required)
        if rent_data.rent_amount is None:
            raise ValidationException(validation_trans.rent_amount_is_required)
        if rent_data.rent_day is None:
            raise ValidationException(validation_trans.rent_day_is_required)

        return PRCRentData(
            start_date=rent_data.start_date,
            end_date=rent_data.end_date,
            rent_amount=rent_data.rent_amount,
            rent_day=rent_data.rent_day,
        )
