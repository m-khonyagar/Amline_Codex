from pydantic import BaseModel

from crm.domain.enums import FileStatus, FileType
from unit_of_work import UnitOfWork


class FileReport(BaseModel):
    INFO_COMPLETED: int
    AD_REGISTERED: int
    FILE_SEARCH: int
    VISIT_ARRANGEMENT: int
    CONTRACT_SIGNED: int
    CANCELLED: int


query = """
select f.file_status as status,
    count(*) as count
from crm.{file_type} f
group by f.file_status;
"""


def get_file_report_handler(file_type: FileType, uow: UnitOfWork):
    with uow:
        result = uow.fetchall(query.format(file_type=file_type.value))
        return FileReport(
            INFO_COMPLETED=next((r["count"] for r in result if r["status"] == FileStatus.INFO_COMPLETED.value), 0),
            AD_REGISTERED=next((r["count"] for r in result if r["status"] == FileStatus.AD_REGISTERED.value), 0),
            FILE_SEARCH=next((r["count"] for r in result if r["status"] == FileStatus.FILE_SEARCH.value), 0),
            VISIT_ARRANGEMENT=next(
                (r["count"] for r in result if r["status"] == FileStatus.VISIT_ARRANGEMENT.value), 0
            ),
            CONTRACT_SIGNED=next((r["count"] for r in result if r["status"] == FileStatus.CONTRACT_SIGNED.value), 0),
            CANCELLED=next((r["count"] for r in result if r["status"] == FileStatus.CANCELLED.value), 0),
        )
