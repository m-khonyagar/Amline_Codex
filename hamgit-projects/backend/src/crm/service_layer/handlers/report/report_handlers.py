import datetime as dt

import jdatetime as jdt

from crm.domain.enums import FileStatus, ReportDuration
from crm.entrypoints.request_models import ReportRequest
from crm.service_layer.handlers.report.queries import (
    contract_count_per_day_query,
    contract_count_query,
    file_call_count_query,
    file_count_per_day_query,
    file_count_query,
    file_status_count_query,
    total_income_query,
    voip_call_daily_report_query,
    voip_call_user_report_query,
)
from unit_of_work import UnitOfWork


def get_first_day_of_jalali_month():
    today = dt.date.today()
    jalali_today = jdt.date.fromgregorian(day=today.day, month=today.month, year=today.year)
    return jdt.date.togregorian(jalali_today.replace(day=1))


def get_first_day_of_jalali_week():
    return dt.date.today() - dt.timedelta(days=jdt.date.today().weekday())


def get_today():
    return dt.date.today()


duration_map = {
    ReportDuration.MONTHLY: get_first_day_of_jalali_month,
    ReportDuration.WEEKLY: get_first_day_of_jalali_week,
    ReportDuration.DAILY: get_today,
}


def total_income_report(uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = uow.fetchall(total_income_query, start_date=start_date, end_date=end_date)
    return next((i.get("total_commission", None) for i in query_result), 0)


def contract_count_report(uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = uow.fetchall(contract_count_query, start_date=start_date, end_date=end_date)
    return next((i.get("count", None) for i in query_result), 0)


def file_count_report(uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = uow.fetchall(file_count_query, start_date=start_date, end_date=end_date)
    landlord_count = next(
        (i.get("count", None) for i in query_result if i.get("file_type", None) == "landlord_files"), 0
    )
    tenant_count = next((i.get("count", None) for i in query_result if i.get("file_type", None) == "tenant_files"), 0)
    result = dict(
        landlord_file_count=landlord_count,
        tenant_file_count=tenant_count,
    )
    result["total_count"] = sum(result.values())  # type: ignore
    return result


def file_call_report(uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = uow.fetchall(file_call_count_query, start_date=start_date, end_date=end_date)
    return query_result


def file_status_count_report(uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = uow.fetchall(file_status_count_query, start_date=start_date, end_date=end_date)
    result = {
        file_status.value: next(
            (i.get("count", None) for i in query_result if i.get("status", None) == file_status.value), 0
        )
        for file_status in FileStatus
    }
    result["total_count"] = sum(result.values())  # type: ignore
    return result


def file_count_per_day_report(uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = uow.fetchall(file_count_per_day_query, start_date=start_date, end_date=end_date)
    return query_result


def contract_count_per_day_report(uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = uow.fetchall(contract_count_per_day_query, start_date=start_date, end_date=end_date)
    return query_result


def voip_call_user_report(voip_uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = voip_uow.fetchall(voip_call_user_report_query, start_date=start_date, end_date=end_date)
    return query_result


def voip_call_daily_report(voip_uow: UnitOfWork, start_date: dt.date, end_date: dt.date):
    query_result = voip_uow.fetchall(voip_call_daily_report_query, start_date=start_date, end_date=end_date)
    return query_result


def date_calculator(
    duration: ReportDuration | None = None, start_date: dt.date | None = None, end_date: dt.date | None = None
):
    default_start_date = dt.date(year=2020, month=1, day=1) if not start_date else start_date
    calculated_start_date = duration_map[duration]() if duration else default_start_date
    end_date = dt.date.today() + dt.timedelta(days=1) if not end_date else end_date
    return calculated_start_date, end_date


def get_reports(
    uow: UnitOfWork,
    voip_uow: UnitOfWork,
    data: ReportRequest,
):
    start_date, end_date = date_calculator(duration=data.duration, start_date=data.start_date, end_date=data.end_date)

    print(start_date, end_date)
    print(jdt.date.fromgregorian(date=start_date), jdt.date.fromgregorian(date=end_date))
    return dict(
        total_income_report=total_income_report(uow, start_date, end_date),
        contract_count_report=contract_count_report(uow, start_date, end_date),
        file_count_report=file_count_report(uow, start_date, end_date),
        file_status_count_report=file_status_count_report(uow, start_date, end_date),
        file_call_report=file_call_report(voip_uow, start_date, end_date),
        voip_call_user_report=voip_call_user_report(voip_uow, start_date, end_date),
        voip_call_daily_report=voip_call_daily_report(voip_uow, start_date, end_date),
        file_count_per_day_report=file_count_per_day_report(uow, start_date, end_date),
        contract_count_per_day_report=contract_count_per_day_report(uow, start_date, end_date),
    )
