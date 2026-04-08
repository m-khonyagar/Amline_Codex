from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, Query
from fastapi.responses import StreamingResponse

import di
from account.domain.entities.user import User
from account.domain.enums import RoleAccess
from core.middlewares.access_checker import has_access
from core.types import OperationResult, PaginateParams
from crm.domain.enums import LabelType
from crm.entrypoints.query_params import TaskQueryParams
from crm.entrypoints.request_models import (
    CreateTaskReportRequest,
    CreateTaskRequest,
    GetPhonesExcelRequest,
    ReportRequest,
    SendFileToRealtorByCategoryRequest,
    SendFileToRealtorByIdsRequest,
    UpdateTaskRequest,
    UpsertFileLabelRequest,
    UpsertFileSourceRequest,
    UpsertFileStatusRequest,
)
from crm.service_layer.handlers.ai_title_generator import ai_title_generator_handler
from crm.service_layer.handlers.file_label_handlers import (
    create_file_label_handler,
    delete_file_label_handler,
    get_all_file_labels_handler,
    update_file_label_handler,
)
from crm.service_layer.handlers.file_source_handlers import (
    create_file_source_handler,
    delete_file_source_handler,
    get_all_file_sources_handler,
    update_file_source_handler,
)
from crm.service_layer.handlers.file_status_handlers import (
    create_file_status_handler,
    delete_file_status_handler,
    get_all_file_statuses_handler,
    update_file_status_handler,
)
from crm.service_layer.handlers.get_ad_moderator_ajax import get_ad_moderator_ajax
from crm.service_layer.handlers.get_all_history import get_all_history_handler
from crm.service_layer.handlers.get_existing_customer import (
    get_existing_customer_handler,
)
from crm.service_layer.handlers.get_file_history import get_file_history_handler
from crm.service_layer.handlers.get_files_excel import (
    get_landlord_files_excel_handler,
    get_tenant_files_excel_handler,
)
from crm.service_layer.handlers.get_phones import get_phones_handler
from crm.service_layer.handlers.get_regions_ajax import get_regions_ajax_handler
from crm.service_layer.handlers.report.report_handlers import get_reports
from crm.service_layer.handlers.send_file_to_realtor import (
    get_realtor_shared_files_handler,
    send_file_to_realtor_by_category_handler,
    send_file_to_realtor_by_ids_handler,
)
from crm.service_layer.handlers.task_handlers import (
    create_task_handler,
    get_all_tasks_handler,
    get_task_handler,
    update_task_handler,
)
from crm.service_layer.handlers.task_report_handlers import create_task_report_handler
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/tools", tags=["tools"])


@router.get("/ajax/ad-moderators")
@has_access(RoleAccess.AD_MODERATOR)
def get_ad_moderators(uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_ad_moderator_ajax(uow=uow)


@router.get("/ajax/{city_id}/regions")
@has_access(RoleAccess.AD_MODERATOR)
def get_regions_ajax(city_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_regions_ajax_handler(city_id=city_id, uow=uow)


@router.get("/history/{file_id}")
@has_access(RoleAccess.AD_MODERATOR)
def get_file_history(
    file_id: int,
    fields: list[str] | None = Query(None),
    filter_type: Literal["exclude", "include"] | None = Query(None),
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return get_file_history_handler(file_id=file_id, uow=uow, fields=fields, filter_type=filter_type)


@router.get("/all-history/{file_id}")
@has_access(RoleAccess.AD_MODERATOR)
def get_all_history(file_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_all_history_handler(file_id=file_id, uow=uow)


@router.post("/report")
@has_access(RoleAccess.AD_MODERATOR)
def get_file_report(
    data: ReportRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    voip_uow: UnitOfWork = Depends(di.get_voip_uow),
    _: User = Depends(di.get_current_user),
):
    return get_reports(uow=uow, voip_uow=voip_uow, data=data)


@router.post("/file-source")
@has_access(RoleAccess.SUPERUSER)
def create_file_source(
    data: UpsertFileSourceRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return create_file_source_handler(data=data, uow=uow)


@router.put("/file-source/{file_source_id}")
@has_access(RoleAccess.SUPERUSER)
def update_file_source(
    file_source_id: int,
    data: UpsertFileSourceRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return update_file_source_handler(file_source_id=file_source_id, data=data, uow=uow)


@router.get("/file-source")
@has_access(RoleAccess.AD_MODERATOR)
def get_all_file_sources(
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return get_all_file_sources_handler(uow=uow)


@router.delete("/file-source/{file_source_id}")
@has_access(RoleAccess.SUPERUSER)
def delete_file_source(
    file_source_id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return delete_file_source_handler(file_source_id=file_source_id, uow=uow)


@router.post("/file-status")
@has_access(RoleAccess.SUPERUSER)
def create_file_status(
    data: UpsertFileStatusRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return create_file_status_handler(data=data, uow=uow)


@router.put("/file-status/{file_status_id}")
@has_access(RoleAccess.SUPERUSER)
def update_file_status(
    file_status_id: int,
    data: UpsertFileStatusRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return update_file_status_handler(file_status_id=file_status_id, data=data, uow=uow)


@router.get("/file-status")
@has_access(RoleAccess.AD_MODERATOR)
def get_all_file_statuses(
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return get_all_file_statuses_handler(uow=uow)


@router.delete("/file-status/{file_status_id}")
@has_access(RoleAccess.SUPERUSER)
def delete_file_status(
    file_status_id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return delete_file_status_handler(file_status_id=file_status_id, uow=uow)


@router.post("/file-label")
@has_access(RoleAccess.SUPERUSER)
def create_file_label(
    data: UpsertFileLabelRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return create_file_label_handler(data=data, uow=uow)


@router.put("/file-label/{file_label_id}")
@has_access(RoleAccess.SUPERUSER)
def update_file_label(
    file_label_id: int,
    data: UpsertFileLabelRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return update_file_label_handler(file_label_id=file_label_id, data=data, uow=uow)


@router.get("/file-label")
@has_access(RoleAccess.AD_MODERATOR)
def get_all_file_labels(
    uow: UnitOfWork = Depends(di.get_uow),
    type: LabelType = Query(None),
    _: User = Depends(di.get_current_user),
):
    return get_all_file_labels_handler(uow=uow, type=type)


@router.delete("/file-label/{file_label_id}")
@has_access(RoleAccess.SUPERUSER)
def delete_file_label(
    file_label_id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return delete_file_label_handler(file_label_id=file_label_id, uow=uow)


@router.get("/existing-customer/{mobile}")
@has_access(RoleAccess.AD_MODERATOR)
def get_existing_customer(mobile: str, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_existing_customer_handler(mobile=mobile, uow=uow)


@router.get("/task")
@has_access(RoleAccess.AD_MODERATOR)
def get_all_tasks(
    _: User = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
    paginate_params: PaginateParams = Depends(),
    query_params: TaskQueryParams = Depends(),
):
    return get_all_tasks_handler(uow=uow, paginate_params=paginate_params, query_params=query_params)


@router.post("/task")
@has_access(RoleAccess.AD_MODERATOR)
def create_task(
    data: CreateTaskRequest,
    current_user: User = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):

    return create_task_handler(data=data, current_user=current_user, uow=uow)


@router.put("/task/{task_id}")
@has_access(RoleAccess.AD_MODERATOR)
def update_task(
    task_id: int,
    data: UpdateTaskRequest,
    current_user: User = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):

    return update_task_handler(task_id=task_id, data=data, current_user=current_user, uow=uow)


@router.get("/task/{task_id}")
@has_access(RoleAccess.AD_MODERATOR)
def get_task(
    task_id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return get_task_handler(task_id=task_id, uow=uow)


@router.post("/task-report")
@has_access(RoleAccess.AD_MODERATOR)
def create_task_report(
    data: CreateTaskReportRequest,
    current_user: User = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return create_task_report_handler(data=data, current_user=current_user, uow=uow)


@router.get("/landlord-files-excel")
@has_access(RoleAccess.AD_MODERATOR)
def get_landlord_files_excel(uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    stream = get_landlord_files_excel_handler(uow=uow)
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=landlord-files.xlsx"},
    )


@router.get("/tenant-files-excel")
@has_access(RoleAccess.AD_MODERATOR)
def get_tenant_files_excel(uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    stream = get_tenant_files_excel_handler(uow=uow)
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=tenant-files.xlsx"},
    )


@router.post("/send-file-to-realtor-by-category")
@has_access(RoleAccess.AD_MODERATOR)
def send_file_to_realtor_by_category(
    background_tasks: BackgroundTasks,
    data: SendFileToRealtorByCategoryRequest,
    current_user: User = Depends(di.get_current_user),
):
    background_tasks.add_task(send_file_to_realtor_by_category_handler, data=data, current_user=current_user)
    return OperationResult(success=True, message="File sent to realtor by category")


@router.post("/send-file-to-realtor-by-ids")
@has_access(RoleAccess.AD_MODERATOR)
def send_file_to_realtor_by_ids(
    background_tasks: BackgroundTasks,
    data: SendFileToRealtorByIdsRequest,
    current_user: User = Depends(di.get_current_user),
):
    background_tasks.add_task(send_file_to_realtor_by_ids_handler, data=data, current_user=current_user)
    return OperationResult(success=True, message="File sent to realtor by ids")


@router.get("/realtor-shared-files/{file_id}")
@has_access(RoleAccess.AD_MODERATOR)
def get_realtor_shared_files(
    file_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)
):
    return get_realtor_shared_files_handler(file_id=file_id, uow=uow)


@router.get("/ai-title-generator/{file_id}")
@has_access(RoleAccess.AD_MODERATOR)
def get_ai_title_generator(file_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return ai_title_generator_handler(file_id=file_id, uow=uow)


@router.post("/phones-excel")
@has_access(RoleAccess.SUPERUSER)
def get_phones_excel(
    data: GetPhonesExcelRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    stream = get_phones_handler(uow=uow, data=data)
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=phones.xlsx"},
    )
