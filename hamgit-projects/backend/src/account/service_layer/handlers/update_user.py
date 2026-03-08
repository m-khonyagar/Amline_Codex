from account.domain.entities.user import User
from account.service_layer.dtos import UpdateUserDto
from shared.service_layer.services.storage_service import StorageService
from unit_of_work import UnitOfWork


def update_user_handler(user_id: int, data: UpdateUserDto, uow: UnitOfWork, storage: StorageService) -> User:
    with uow:
        user = uow.users.get_or_raise(id=user_id)
        avatar_file = None

        if data.avatar_file_id and user.avatar_file_id and data.avatar_file_id != user.avatar_file_id:

            existing_file = uow.files.get_or_raise(id=user.avatar_file_id)
            storage.delete(existing_file)
            existing_file.delete()

            avatar_file = uow.files.get_or_raise(id=data.avatar_file_id)
            avatar_file.is_used = True

            user.avatar_file_id = data.avatar_file_id

        elif not data.avatar_file_id and user.avatar_file_id:
            avatar_file = uow.files.get_or_raise(id=user.avatar_file_id)
            avatar_file.is_used = True

        user_info = {k: v for k, v in data.dumps().items() if v is not None}
        user.update(**user_info)
        uow.commit()
        uow.users.refresh(user)

        if avatar_file:
            user.avatar_file = avatar_file.dumps()

    return user
