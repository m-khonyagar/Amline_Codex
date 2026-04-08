from sqlalchemy import or_

import di
from account.domain.entities.user import User
from core.exceptions import BadRequestException, NotFoundException
from core.logger import Logger
from crm.domain.entities.realtor_file import RealtorFile
from crm.domain.entities.realtor_shared_file import RealtorSharedFile
from crm.domain.enums import RealtorSharedFileSendType
from crm.entrypoints.request_models import (
    SendFileToRealtorByCategoryRequest,
    SendFileToRealtorByIdsRequest,
)
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import SQLAlchemyUnitOfWork, UnitOfWork

logger = Logger(__name__)


def send_file_to_realtor(
    current_user: User,
    uow: UnitOfWork,
    sms_service: SMSService,
    realtor_file: RealtorFile,
    file_id: int,
    text: str,
    type: RealtorSharedFileSendType,
):
    if type == RealtorSharedFileSendType.SMS:
        sms_result = sms_service.send_sms(realtor_file.mobile, text)
    elif type == RealtorSharedFileSendType.DING:
        sms_result = sms_service.send_ding_sms(realtor_file.mobile, text)

    realtor_shared_file = RealtorSharedFile(
        file_id=file_id,
        realtor_file_id=realtor_file.id,
        is_successful=sms_result,
        text=text,
        created_by=current_user.id,
        type=type,
    )
    uow.realtor_shared_files.add(realtor_shared_file)


def send_file_to_realtor_by_ids_handler(data: SendFileToRealtorByIdsRequest, current_user: User):
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    sms_service = di.get_sms_service()
    with uow:
        realtor_files = (
            uow.session.query(RealtorFile).filter(RealtorFile.id.in_(data.realtor_file_ids)).all()  # type: ignore
        )
        if not realtor_files:
            raise NotFoundException(detail="realtor_files_not_found")
        for realtor_file in realtor_files:
            send_file_to_realtor(
                current_user=current_user,
                uow=uow,
                sms_service=sms_service,
                realtor_file=realtor_file,
                file_id=data.file_id,
                text=data.text,
                type=data.send_type,
            )
        uow.commit()


def send_file_to_realtor_by_category_handler(data: SendFileToRealtorByCategoryRequest, current_user: User):
    if not data.city_id and not data.district_id and not data.region:
        raise BadRequestException(detail="city_id, district_id or region is required")
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    sms_service = di.get_sms_service()
    with uow:
        realtor_files = (
            uow.session.query(RealtorFile)
            .filter(
                RealtorFile.deleted_at.is_(None),  # type: ignore
                or_(RealtorFile.city_id.in_([data.city_id]) if data.city_id else True),  # type: ignore
                or_(RealtorFile.district_ids.overlap([data.district_id]) if data.district_id else True),  # type: ignore
                or_(RealtorFile.regions.overlap([data.region]) if data.region else True),  # type: ignore
            )
            .all()
        )
        if not realtor_files:
            raise NotFoundException(detail="realtor_files_not_found")
        for realtor_file in realtor_files:
            send_file_to_realtor(
                current_user=current_user,
                uow=uow,
                sms_service=sms_service,
                realtor_file=realtor_file,
                file_id=data.file_id,
                text=data.text,
                type=data.send_type,
            )
        uow.commit()


def get_realtor_shared_files_handler(file_id: int, uow: UnitOfWork):
    with uow:
        shared_files: list[RealtorSharedFile] = (
            uow.session.query(RealtorSharedFile).filter(RealtorSharedFile.file_id == file_id).all()
        )
        return [shared_file.dumps() for shared_file in shared_files]
