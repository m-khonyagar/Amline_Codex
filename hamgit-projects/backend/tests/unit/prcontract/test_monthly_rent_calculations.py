import datetime as d
import random

import pytest
from sqlalchemy.orm import Session

import di
from core.helpers import calculate_jalali_payment_dates, gregorian_to_jalali
from unit_of_work import SQLAlchemyUnitOfWork


class TestMonthlyRentsCalculation:
    """
    For monthly rent payment dates we must calculate
    the total number of months in the contract duration.
    To do so we must calculate the dates in Khorshidi calendar
    and to make sure the calculations are correct we compare the
    Khorshidi results with the Gregorian result which must be the same
    """

    def setup_method(self) -> None:
        """
        Generating mock data for PR-Contract is complicated
        so we get a random prcontract object from the database
        and modify its dates and monthly rent amount to do the tests
        """
        session: Session = next(di.get_sqlalchemy_session())
        uow = SQLAlchemyUnitOfWork(session)
        with uow:
            self.obj = uow.prcontracts.get_random_object()
            while not self.obj.rent_amount:
                self.obj = uow.prcontracts.get_random_object()

    def jalali_total_rent_amount(self, start_date, end_date, rent_amount):
        """
        Calculate the total rent amount in Khorshidi calendar.
        """
        jalali_start_date = gregorian_to_jalali(start_date)
        jalali_end_date = gregorian_to_jalali(end_date)
        payment_dates = calculate_jalali_payment_dates(jalali_start_date, jalali_end_date, random.randint(1, 29))
        return len(payment_dates) * rent_amount

    @pytest.mark.parametrize(
        "start_date, end_date, rent_amount",
        [
            (d.datetime(2023, 1, 1), d.datetime(2023, 12, 2), 1000),
            (d.datetime(2023, 1, 1), d.datetime(2024, 1, 2), 1000),
            (d.datetime(2023, 1, 1), d.datetime(2024, 1, 1), 1000),
        ],
    )
    def test_calculate_total_rent(self, start_date, end_date, rent_amount):
        """
        Test the total rent amount calculation in Khorshidi and Gregorian calendars.
        """
        self.obj.start_date = start_date
        self.obj.end_date = end_date
        self.obj.rent_amount = rent_amount

        jalali_total_mount = self.jalali_total_rent_amount(start_date, end_date, rent_amount)
        gregorian_total_mount = self.obj.calculate_total_rent_amount()
        assert jalali_total_mount == gregorian_total_mount
