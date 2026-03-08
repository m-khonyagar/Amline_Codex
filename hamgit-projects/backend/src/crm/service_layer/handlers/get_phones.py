import io

from openpyxl import Workbook

from crm.domain.enums import PhonesEntityType
from crm.entrypoints.request_models import GetPhonesExcelRequest
from unit_of_work import UnitOfWork

users_query = """
select mobile mobile,
    first_name || ' ' || last_name full_name,
    created_at created_at,
    'users' as type
from account.users
where created_at::date >= :start_date
    and created_at::date <= :end_date;
"""


archived_landlord_files_query = """
select mobile,
    full_name,
    created_at,
    'archived_landlord_files' as type
from crm.landlord_files
where created_at::date >= :start_date
    and created_at::date <= :end_date
    and file_status in ('ARCHIVED', 'CANCELLED')
"""

landlord_files_query = """
select mobile,
    full_name,
    created_at,
    'landlord_files' as type
from crm.landlord_files
where created_at::date >= :start_date
    and created_at::date <= :end_date
    and file_status not in ('ARCHIVED', 'CANCELLED')
"""

archived_tenant_files_query = """
select mobile,
    full_name,
    created_at,
    'archived_tenant_files' as type
from crm.tenant_files
where created_at::date >= :start_date
    and created_at::date <= :end_date
    and file_status in ('ARCHIVED', 'CANCELLED')
"""

tenant_files_query = """
select mobile,
    full_name,
    created_at,
    'tenant_files' as type
from crm.tenant_files
where created_at::date >= :start_date
    and created_at::date <= :end_date
    and file_status not in ('ARCHIVED', 'CANCELLED')
"""

realtor_files_query = """
select mobile,
    full_name,
    created_at,
    'realtor_files' as type
from crm.realtor_files
where created_at::date >= :start_date and created_at::date <= :end_date;
"""

mapper = {
    PhonesEntityType.USER: users_query,
    PhonesEntityType.LANDLORD_FILE: landlord_files_query,
    PhonesEntityType.ARCHIVED_LANDLORD_FILE: archived_landlord_files_query,
    PhonesEntityType.TENANT_FILE: tenant_files_query,
    PhonesEntityType.ARCHIVED_TENANT_FILE: archived_tenant_files_query,
    PhonesEntityType.REALTOR_FILE: realtor_files_query,
}


def create_excel_file(data: list[dict]):
    wb = Workbook()
    ws = wb.active
    ws.title = "Phones"  # type: ignore
    headers = list(data[0].keys())
    ws.append(headers)  # type: ignore
    for row in data:
        ws.append([str(i) for i in row.values()])  # type: ignore
    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)
    return stream


def get_phones_handler(uow: UnitOfWork, data: GetPhonesExcelRequest):
    with uow:
        phones_list = []
        for entity_type in data.entity_types:
            phones = uow.fetchall(mapper[entity_type], start_date=data.start_date, end_date=data.end_date)
            phones_list.extend(phones)
        return create_excel_file(phones_list)
