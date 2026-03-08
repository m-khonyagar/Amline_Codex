from account.domain.entities.user import User
from account.domain.enums import UserRole
from core import helpers
from core.exceptions import ConflictException
from crm.domain.entities.realtor_file import RealtorFile
from crm.entrypoints.request_models import (
    UpsertRealtorFileBulkRequest,
    UpsertRealtorFileBulkSingleRequest,
    UpsertRealtorFileRequest,
)
from shared.domain.entities.entity_change_log import EntityChangeLog
from unit_of_work import UnitOfWork


def create_realtor_file(
    data: UpsertRealtorFileRequest | UpsertRealtorFileBulkSingleRequest, uow: UnitOfWork, current_user: User
):
    existing_realtor_file = uow.realtor_files.get(mobile=data.mobile)
    if existing_realtor_file:
        raise ConflictException(detail="realtor_file_already_exists")

    data.mobile = helpers.validate_mobile_number(data.mobile)
    data.city_id = 712 if data.city_id is None else data.city_id
    realtor_file = RealtorFile(**data.model_dump(), created_by=current_user.id, published_on_amline=False)

    user = uow.users.get_or_create(mobile=data.mobile)
    user.first_name = user.first_name or data.full_name
    user.add_role(UserRole.CONTRACT_ADMIN)

    uow.realtor_files.add(realtor_file)

    uow.flush()

    entity_change_log = EntityChangeLog(
        user_id=current_user.id,
        entity_type=RealtorFile.__name__,
        entity_id=realtor_file.id,
        entity_field="created_by",
        old_value="None",
        new_value=str(realtor_file.created_by),
    )
    uow.entity_change_logs.add(entity_change_log)

    return realtor_file


def create_realtor_file_handler(data: UpsertRealtorFileRequest, uow: UnitOfWork, current_user: User) -> dict:
    with uow:
        realtor_file = create_realtor_file(data, uow, current_user)
        uow.commit()
        return realtor_file.dumps()


def create_realtor_file_bulk(data: UpsertRealtorFileBulkRequest, uow: UnitOfWork, current_user: User):
    with uow:
        realtor_files = []
        for item in data.data:
            try:
                realtor_file = create_realtor_file(item, uow, current_user)
                uow.realtor_files.add(realtor_file)
                uow.flush()
                realtor_files.append({"unique_key": item.unique_key, "realtor_file_id": realtor_file.id})
            except Exception as e:
                realtor_files.append({"unique_key": item.unique_key, "error": str(e)})
        uow.commit()
        return realtor_files
