import httpx

from core import settings
from core.exceptions import ValidationException
from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.tenant_file import TenantFile
from crm.domain.enums import FileStatus, FileType
from crm.service_layer.handlers.file_match_handlers.statics import (
    DEPOSIT_PERCENT,
    MAX,
    MAX_FILE,
    MIN,
    MIN_FILE,
    RENT_PERCENT,
    system_message,
    user_message,
)
from unit_of_work import UnitOfWork


def match_tenant_file_query(uow: UnitOfWork, landlord_file: LandlordFile):
    match_tenant_files: list[TenantFile] = (
        uow.session.query(TenantFile)
        .filter(
            # TenantFile.file_status == FileStatus.FILE_SEARCH,
            # TenantFile.property_type == landlord_file.property_type,
            TenantFile.city_id == landlord_file.city_id,
            TenantFile.district_ids.any(landlord_file.district_id),  # type: ignore
            TenantFile.rent.between(  # type: ignore
                MIN(landlord_file.rent, RENT_PERCENT),
                MAX(landlord_file.rent, RENT_PERCENT),
            ),
            TenantFile.deposit.between(  # type: ignore
                MIN(landlord_file.deposit, DEPOSIT_PERCENT),
                MAX(landlord_file.deposit, DEPOSIT_PERCENT),
            ),
            TenantFile.deleted_at.is_(None),  # type: ignore
            TenantFile.file_status.not_in([FileStatus.CANCELLED, FileStatus.ARCHIVED]),  # type: ignore
        )
        .all()
    )
    return match_tenant_files


def match_landlord_file_query(uow: UnitOfWork, tenant_file: TenantFile):
    match_landlord_files: list[LandlordFile] = (
        uow.session.query(LandlordFile)
        .filter(
            # LandlordFile.file_status == FileStatus.FILE_SEARCH,
            # LandlordFile.property_type == tenant_file.property_type,
            LandlordFile.city_id == tenant_file.city_id,
            LandlordFile.district_id.in_(tenant_file.district_ids),  # type: ignore
            LandlordFile.rent.between(  # type: ignore
                MIN(tenant_file.rent, RENT_PERCENT),
                MAX(tenant_file.rent, RENT_PERCENT),
            ),
            LandlordFile.deposit.between(  # type: ignore
                MIN(tenant_file.deposit, DEPOSIT_PERCENT),
                MAX(tenant_file.deposit, DEPOSIT_PERCENT),
            ),
            LandlordFile.deleted_at.is_(None),  # type: ignore
            LandlordFile.file_status.not_in([FileStatus.CANCELLED, FileStatus.ARCHIVED]),  # type: ignore
        )
        .all()
    )
    return match_landlord_files


def match_landlord_file_handler(uow: UnitOfWork, file_id: int):
    with uow:
        landlord_file = uow.landlord_files.get_or_raise(id=file_id)
        if (
            not landlord_file.city_id
            or not landlord_file.district_id
            or not landlord_file.rent
            or not landlord_file.deposit
        ):
            raise ValidationException(detail="لطفا فیلد های شهر، محله، اجاره و رهن را پر کنید")
        match_files = match_tenant_file_query(uow, landlord_file)
        if len(match_files) > MAX_FILE or len(match_files) < MIN_FILE:
            raise ValidationException(detail=f"تعداد فایل های مطابقت یافته {len(match_files)} است")
        result = [file.dumps() for file in match_files]
        print(len(result))
        return result
        # matched_files = ai_match_file(
        #     source_file_type=FileType.LANDLORD,
        #     source_file_details=str(ai_dumps(landlord_file.dumps())),
        #     candidate_file_type=FileType.LANDLORD,
        #     candidate_files=str(match_files_dict),
        # )
        # try:
        #     matched_files_ids = ast.literal_eval(matched_files)
        # except Exception as e:
        #     print(e)
        #     print(matched_files)
        #     raise ValidationException(detail="Invalid matched files")
        # if isinstance(matched_files_ids, list):
        #     matched_files_obj: list[TenantFile] = (
        #         uow.session.query(TenantFile)
        #         .filter(TenantFile.id.in_(matched_files_ids))  # type: ignore
        #         .filter(TenantFile.deleted_at.is_(None))  # type: ignore
        #         .all()
        #     )
        #     return [file.dumps() for file in matched_files_obj]
        # print(matched_files)
        # raise ValidationException(detail="Invalid matched files")


def match_tenant_file_handler(uow: UnitOfWork, file_id: int):
    with uow:
        tenant_file = uow.tenant_files.get_or_raise(id=file_id)
        if not tenant_file.city_id or not tenant_file.district_ids or not tenant_file.rent or not tenant_file.deposit:
            raise ValidationException(detail="لطفا فیلد های شهر، محله، اجاره و رهن را پر کنید")
        match_files = match_landlord_file_query(uow, tenant_file)
        if len(match_files) > MAX_FILE or len(match_files) < MIN_FILE:
            raise ValidationException(detail=f"تعداد فایل های مطابقت یافته {len(match_files)} است")
        result = [file.dumps() for file in match_files]
        print(len(result))
        return result
        # matched_files = ai_match_file(
        #     source_file_type=FileType.TENANT,
        #     source_file_details=str(ai_dumps(tenant_file.dumps())),
        #     candidate_file_type=FileType.LANDLORD,
        #     candidate_files=str(match_files_dict),
        # )
        # try:
        #     matched_files_ids_str = ast.literal_eval(matched_files)
        #     matched_files_ids = [int(id) for id in matched_files_ids_str]
        #     print(len(matched_files_ids))
        # except Exception as e:
        #     print(e)
        #     print(matched_files)
        #     raise ValidationException(detail="Invalid matched files")
        # if isinstance(matched_files_ids, list):
        #     matched_files_obj: list[LandlordFile] = (
        #         uow.session.query(LandlordFile)
        #         .filter(LandlordFile.id.in_(matched_files_ids))  # type: ignore
        #         .filter(LandlordFile.deleted_at.is_(None))  # type: ignore
        #         .all()
        #     )
        #     return [file.dumps() for file in matched_files_obj]
        # print(matched_files)
        # raise ValidationException(detail="Invalid matched files")


def ai_match_file(
    source_file_type: FileType, source_file_details: str, candidate_file_type: FileType, candidate_files: str
):
    human_message = user_message.format(
        source_file_type=source_file_type.value,
        source_file_details=source_file_details,
        candidate_file_type=candidate_file_type.value,
        candidate_files=candidate_files,
    )
    response = httpx.post(
        settings.AMLINE_AI_URL, json={"system_message": system_message, "human_message": human_message}, timeout=120
    )
    response_json = response.json()
    message = response_json.get("message")
    if not message:
        raise ValidationException(detail=response_json.get("error"))
    return message
