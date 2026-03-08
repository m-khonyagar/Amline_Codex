from account.domain.entities.user import User
from core.orm_helpers import save_entity_change_log
from crm.entrypoints.request_models import UpdateFileConnectionRequest
from unit_of_work import UnitOfWork


def update_file_connection_handler(
    file_connection_id: int, data: UpdateFileConnectionRequest, uow: UnitOfWork, current_user: User
) -> dict:
    with uow:
        file_connection = uow.file_connections.get_or_raise(id=file_connection_id)
        file_connection.update(status=data.status, description=data.description)
        save_entity_change_log(uow=uow, current_user=current_user)  # type: ignore
        uow.commit()
        uow.file_connections.refresh(file_connection)
        return file_connection.dumps()
