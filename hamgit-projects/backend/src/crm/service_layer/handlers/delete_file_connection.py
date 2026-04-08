from account.domain.entities.user import User
from core.exceptions import PermissionException
from core.helpers import get_now
from crm.domain.enums import FileConnectionStatus
from unit_of_work import UnitOfWork


def delete_file_connection_handler(file_connection_id: int, uow: UnitOfWork, current_user: User) -> dict:
    with uow:
        file_connection = uow.file_connections.get_or_raise(id=file_connection_id)

        # Check if the file connection can be deleted (only DRAFT status)
        if file_connection.status != FileConnectionStatus.DRAFT:
            raise PermissionException(detail="can_only_delete_draft_file_connections")

        # Soft delete by setting deleted_at
        file_connection.deleted_at = get_now()
        uow.commit()

        return {"message": "File connection deleted successfully"}
