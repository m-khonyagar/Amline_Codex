import io

from openpyxl import Workbook

from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.tenant_file import TenantFile
from unit_of_work import UnitOfWork


def excel_dumps(data: dict) -> dict:
    fields_to_remove = [
        "id",
        "assigned_to",
        "created_by",
        "amline_ad_id",
        "file_source_id",
        "file_source",
        "assigned_to_user",
        "created_by_user",
        "label_ids",
        "property_image_file_ids",
        "city",
        "district",
        "created_at",
        "updated_at",
        "deleted_at",
    ]
    for field in fields_to_remove:
        data.pop(field, None)
    return data


def create_excel_file(data: list[dict]):
    wb = Workbook()
    ws = wb.active
    ws.title = "Files"  # type: ignore
    headers = list(data[0].keys())
    ws.append(headers)  # type: ignore
    for row in data:
        ws.append([str(i) for i in row.values()])  # type: ignore
    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)
    return stream


def get_landlord_files_excel_handler(uow: UnitOfWork):
    with uow:
        files: list[LandlordFile] = uow.session.query(LandlordFile).all()
        data = [excel_dumps(file.dumps()) for file in files]
        return create_excel_file(data)


def get_tenant_files_excel_handler(uow: UnitOfWork):
    with uow:
        files: list[TenantFile] = uow.session.query(TenantFile).all()
        data = [excel_dumps(file.dumps()) for file in files]
        return create_excel_file(data)
