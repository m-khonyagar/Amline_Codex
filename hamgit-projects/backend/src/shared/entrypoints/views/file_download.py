from io import BytesIO

from fastapi.responses import StreamingResponse

from shared.service_layer.services.storage_service import StorageService
from unit_of_work import UnitOfWork


def file_download_view(file_id: int, uow: UnitOfWork, storage: StorageService):
    with uow:
        file_ = uow.files.get_or_raise(id=file_id)
        file_bytes = storage.download(file_)

        file_stream = BytesIO(file_bytes)
        file_stream.seek(0)

        return StreamingResponse(
            file_stream,
            media_type=file_.mime_type,
            headers={"Content-Disposition": f"attachment; filename={file_.name}"},
        )
