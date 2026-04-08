from account.domain.entities.user import User
from core.exceptions import ConflictException
from crm.domain.entities.file_connection import FileConnection
from crm.domain.enums import FileConnectionStatus
from crm.entrypoints.request_models import (
    CreateFileConnectionBulkRequest,
    CreateFileConnectionRequest,
)
from shared.domain.entities.entity_change_log import EntityChangeLog
from unit_of_work import UnitOfWork


def create_file_connection(data: CreateFileConnectionRequest, uow: UnitOfWork, current_user: User) -> FileConnection:
    uow.landlord_files.get_or_raise(id=data.landlord_file_id)
    uow.tenant_files.get_or_raise(id=data.tenant_file_id)
    existing_connection = uow.file_connections.get(
        landlord_file_id=data.landlord_file_id, tenant_file_id=data.tenant_file_id
    )
    if existing_connection:
        raise ConflictException(detail="file_connection_already_exists")

    file_connection = FileConnection(
        landlord_file_id=data.landlord_file_id,
        tenant_file_id=data.tenant_file_id,
        status=FileConnectionStatus.DRAFT,
        description=data.description,
        initiator=data.initiator,
        created_by=current_user.id,
    )
    uow.file_connections.add(file_connection)
    uow.flush()

    entity_change_log = EntityChangeLog(
        user_id=current_user.id,
        entity_type=FileConnection.__name__,
        entity_id=file_connection.id,
        entity_field="created_by",
        old_value="None",
        new_value=str(file_connection.created_by),
    )
    uow.entity_change_logs.add(entity_change_log)

    return file_connection


def create_file_connection_handler(data: CreateFileConnectionRequest, uow: UnitOfWork, current_user: User) -> dict:
    with uow:
        file_connection = create_file_connection(data=data, uow=uow, current_user=current_user)
        uow.commit()
        uow.file_connections.refresh(file_connection)
        return file_connection.dumps()


def create_file_connection_bulk_handler(
    data: CreateFileConnectionBulkRequest, uow: UnitOfWork, current_user: User
) -> list[dict]:
    with uow:
        file_connections: list[FileConnection] = []
        for item in data.connections:
            file_connection = create_file_connection(data=item, uow=uow, current_user=current_user)
            file_connections.append(file_connection)
        uow.commit()
        return [file_connection.dumps() for file_connection in file_connections]
