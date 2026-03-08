from core.exceptions import ValidationException
from core.translates import validation_trans
from shared.domain.entities.file import File
from account.domain.entities.user import User
from shared.domain.enums import FileType
from shared.service_layer.helpers import get_extension_from_filename, get_file_mime_type
from shared.service_layer.services.storage_service import StorageService
from unit_of_work import UnitOfWork


def upload_file__handler(
    file_bytes: bytes,
    file_type: FileType,
    mime_type: str | None,
    filename: str | None,
    current_user: User | None,
    uow: UnitOfWork,
    storage: StorageService,
) -> File:
    if not filename:
        raise ValidationException(validation_trans.invalid_file)

    if not mime_type:
        mime_type = get_file_mime_type(file_bytes)

    ext = get_extension_from_filename(filename)

    file = File(type=file_type, extension=ext, size=len(file_bytes), mime_type=mime_type)
    file.url = storage.upload(file, file_bytes)

    with uow:
        uow.files.add(file)

        if current_user:
            uow.flush()
            user = uow.users.get_by_id(current_user.id)
            user.update(avatar_file_id=file.id)

        uow.commit()
        uow.files.refresh(file)

    return file
