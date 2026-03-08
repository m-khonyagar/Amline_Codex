from account.domain.entities.user import User
from core import helpers
from core.exceptions import ConflictException
from crm.domain.entities.landlord_file import LandlordFile
from crm.entrypoints.request_models import (
    UpsertLandlordFileBulkRequest,
    UpsertLandlordFileBulkSingleRequest,
    UpsertLandlordFileRequest,
)
from shared.domain.entities.entity_change_log import EntityChangeLog
from unit_of_work import UnitOfWork


def create_landlord_file(
    data: UpsertLandlordFileRequest | UpsertLandlordFileBulkSingleRequest, uow: UnitOfWork, current_user: User
):
    existing_landlord_file = uow.landlord_files.get(
        mobile=data.mobile,
        rent=data.rent,
        deposit=data.deposit,
        area=data.area,
    )
    if existing_landlord_file and data.rent and data.deposit and data.area:
        raise ConflictException(detail="landlord_file_already_exists")

    data.mobile = helpers.validate_mobile_number(data.mobile)
    landlord_file = LandlordFile(**data.model_dump(), created_by=current_user.id, published_on_amline=False)

    user = uow.users.get_or_create(mobile=data.mobile)
    user.first_name = user.first_name or data.full_name

    uow.landlord_files.add(landlord_file)

    uow.flush()

    entity_change_log = EntityChangeLog(
        user_id=current_user.id,
        entity_type=LandlordFile.__name__,
        entity_id=landlord_file.id,
        entity_field="created_by",
        old_value="None",
        new_value=str(landlord_file.created_by),
    )
    uow.entity_change_logs.add(entity_change_log)

    return landlord_file


def create_landlord_file_handler(data: UpsertLandlordFileRequest, uow: UnitOfWork, current_user: User) -> dict:
    with uow:
        landlord_file = create_landlord_file(data, uow, current_user)
        uow.commit()
        return landlord_file.dumps()


def create_landlord_file_bulk(data: UpsertLandlordFileBulkRequest, uow: UnitOfWork, current_user: User):
    with uow:
        landlord_files = []
        for item in data.data:
            try:
                landlord_file = create_landlord_file(item, uow, current_user)
                uow.landlord_files.add(landlord_file)
                uow.flush()
                landlord_files.append({"unique_key": item.unique_key, "landlord_file_id": landlord_file.id})
            except Exception as e:
                landlord_files.append({"unique_key": item.unique_key, "error": str(e)})
        uow.commit()
        return landlord_files
