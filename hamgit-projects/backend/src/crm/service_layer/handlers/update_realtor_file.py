from account.domain.entities.user import User
from core.orm_helpers import save_entity_change_log
from crm.entrypoints.request_models import UpsertRealtorFileRequest
from crm.service_layer.helpers import can_modify
from unit_of_work import UnitOfWork


def update_realtor_file_handler(
    file_id: int, data: UpsertRealtorFileRequest, uow: UnitOfWork, current_user: User
) -> dict:
    with uow:
        realtor_file = uow.realtor_files.get_or_raise(id=file_id)
        can_modify(current_user=current_user, creator_id=realtor_file.created_by, assignee_id=realtor_file.assigned_to)
        update_data = data.model_dump(exclude_unset=True)
        realtor_file.update(**update_data)
        save_entity_change_log(uow=uow, current_user=current_user)  # type: ignore
        uow.commit()
        uow.realtor_files.refresh(realtor_file)
        return realtor_file.dumps()
