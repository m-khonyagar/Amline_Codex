from shared.service_layer.services.storage_service import StorageService
from unit_of_work import UnitOfWork


def delete_user_profile_handler(user_id: int, uow: UnitOfWork, storage: StorageService) -> bool:
    with uow:

        user = uow.users.get_or_raise(id=user_id)
        file = uow.files.get_or_raise(id=user.avatar_file_id)
        storage.delete(file)
        file.delete()
        user.avatar_file_id = None
        uow.commit()

    return True
