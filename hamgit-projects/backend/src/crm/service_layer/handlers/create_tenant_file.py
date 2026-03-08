from account.domain.entities.user import User
from core import helpers
from core.exceptions import ConflictException
from crm.domain.entities.tenant_file import TenantFile
from crm.entrypoints.request_models import (
    UpsertTenantFileBulkRequest,
    UpsertTenantFileBulkSingleRequest,
    UpsertTenantFileRequest,
)
from shared.domain.entities.entity_change_log import EntityChangeLog
from unit_of_work import UnitOfWork


def create_tenant_file(
    data: UpsertTenantFileRequest | UpsertTenantFileBulkSingleRequest, uow: UnitOfWork, current_user: User
):
    existing_tenant_file = uow.tenant_files.get(
        mobile=data.mobile,
        rent=data.rent,
        deposit=data.deposit,
        area=data.area,
    )
    if existing_tenant_file and data.rent and data.deposit and data.area:
        raise ConflictException(detail="tenant_file_already_exists")

    data.mobile = helpers.validate_mobile_number(data.mobile)
    tenant_file = TenantFile(**data.model_dump(), created_by=current_user.id, published_on_amline=False)

    user = uow.users.get_or_create(mobile=data.mobile)
    user.first_name = user.first_name or data.full_name

    uow.tenant_files.add(tenant_file)

    uow.flush()

    entity_change_log = EntityChangeLog(
        user_id=current_user.id,
        entity_type=TenantFile.__name__,
        entity_id=tenant_file.id,
        entity_field="created_by",
        old_value="None",
        new_value=str(tenant_file.created_by),
    )
    uow.entity_change_logs.add(entity_change_log)

    return tenant_file


def create_tenant_file_handler(data: UpsertTenantFileRequest, uow: UnitOfWork, current_user: User) -> dict:
    with uow:
        tenant_file = create_tenant_file(data, uow, current_user)
        uow.commit()
        return tenant_file.dumps()


def create_tenant_file_bulk(data: UpsertTenantFileBulkRequest, uow: UnitOfWork, current_user: User):
    with uow:
        tenant_files = []
        for item in data.data:
            try:
                tenant_file = create_tenant_file(item, uow, current_user)
                uow.tenant_files.add(tenant_file)
                uow.flush()
                tenant_files.append({"unique_key": item.unique_key, "tenant_file_id": tenant_file.id})
            except Exception as e:
                tenant_files.append({"unique_key": item.unique_key, "error": str(e)})
        uow.commit()
        return tenant_files
