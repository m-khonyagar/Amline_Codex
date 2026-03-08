from account.domain.entities.user import User
from core.orm_helpers import save_entity_change_log
from crm.entrypoints.request_models import UpsertTenantFileRequest
from crm.service_layer.helpers import can_modify
from unit_of_work import UnitOfWork


def update_tenant_file_handler(
    file_id: int, data: UpsertTenantFileRequest, uow: UnitOfWork, current_user: User
) -> dict:
    with uow:
        tenant_file = uow.tenant_files.get_or_raise(id=file_id)
        can_modify(current_user=current_user, creator_id=tenant_file.created_by, assignee_id=tenant_file.assigned_to)
        update_data = data.model_dump(exclude_unset=True)
        tenant_file.update(**update_data)
        save_entity_change_log(uow=uow, current_user=current_user)  # type: ignore
        uow.commit()
        uow.tenant_files.refresh(tenant_file)
        return tenant_file.dumps()
