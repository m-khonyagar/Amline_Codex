from fastapi import APIRouter, Depends, File, Form, Request, UploadFile

import di
from core.middlewares.rate_limiter import async_rate_limiter
from shared.domain.enums import FileType
from shared.entrypoints import response_models, views
from shared.service_layer import handlers

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload", response_model=response_models.File_Response, status_code=201)
@async_rate_limiter(7, 30)
async def upload_file_(
    request: Request,
    file: UploadFile = File(...),
    file_type: FileType = Form(...),
    uow=Depends(di.get_uow),
    current_user=Depends(di.get_conditional_current_user),
    storage=Depends(di.get_storage_service),
):
    file_bytes = await file.read()
    file_ = handlers.upload_file__handler(
        uow=uow, current_user=current_user, storage=storage, file_bytes=file_bytes, file_type=file_type, mime_type=file.content_type, filename=file.filename
    )

    return file_.dumps() if file_.dumps() else {"id": str(file_.id)}


@router.get("/{file_id}", response_model=response_models.FileResponseModel)
def get_file_detail(file_id: int, uow=Depends(di.get_uow)):
    return views.file_detail_view(file_id=file_id, uow=uow)


@router.get("/download/{file_id}")
async def download_file(file_id: int, uow=Depends(di.get_uow), storage=Depends(di.get_storage_service)):
    return views.file_download_view(file_id=file_id, uow=uow, storage=storage)


# @router.post("/move-old-files")
# def move_old_files(
#     uow: UnitOfWork = Depends(di.get_uow),
#     s3: S3Service = Depends(di.get_s3_service),
#     storage: StorageService = Depends(di.get_storage_service),
# ):
#     with open(f"{BASE_DIR}/files_data.json") as f:
#         json_data = json.load(f)

#     files_data = json_data["files"]

#     for file in files_data:
#         file_data = FileData(
#             id=file["id"],
#             bucket=file["bucket"],
#             file_type=file["file_type"],
#             name=file["name"],
#             size=file["size"],
#             mime_type=file["mime_type"],
#             is_used=file["is_used"],
#         )
#         object_name = f"{file_data['file_type']}/{file_data['name']}"
#         new_file = File_.create_from_old_file_data(file_data)
#         new_file.url = s3.get_url(bucket=file_data["bucket"], object_name=object_name)
#         with uow:
#             uow.files.add(new_file)
#             file_bytes = s3.download(bucket=file_data["bucket"], object_name=object_name)
#             storage.upload(file=new_file, file_bytes=file_bytes)
#             uow.commit()


# @router.post("/move")
# def move_old_data(
#     uow: UnitOfWork = Depends(di.get_uow),
#     s3_service: S3Service = Depends(di.get_s3_service),
#     storage: StorageService = Depends(di.get_storage_service),
# ):
#     old_files = uow.fetchall("select * from shared.files")

#     for old_file in old_files:
#         category = FileType.resolve(old_file["file_type"].lower())
#         newFile = File_.loads(
#             data={
#                 "id": old_file["id"],
#                 "category": category,
#                 "name": old_file["name"],
#                 "size": old_file["size"],
#                 "mime_type": old_file["mime_type"],
#                 "is_used": old_file["is_used"],
#                 "created_at": old_file["created_at"],
#                 "deleted_at": old_file["deleted_at"],
#             }
#         )

#         try:
#             file_bytes = s3_service.download(old_file["bucket"], f"{old_file['file_type']}/{old_file['name']}")
#             storage.upload(file=newFile, file_bytes=file_bytes)
#             with uow:
#                 uow.files_.add(newFile)
#                 uow.commit()
#                 print(f"File {old_file['name']} moved")
#             # s3_service.delete(old_file["bucket"], f"{old_file['file_type']}/{old_file['name']}")
#         except Exception as e:
#             print(f"Error moving file {old_file['name']}: {e}")
#             continue
