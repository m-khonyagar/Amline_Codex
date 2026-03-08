from account.domain.entities.user import User
from crm.domain.entities.task_report import TaskReport
from crm.entrypoints.request_models import CreateTaskReportRequest
from unit_of_work import UnitOfWork


def create_task_report_handler(data: CreateTaskReportRequest, current_user: User, uow: UnitOfWork):
    with uow:
        task_report = TaskReport(
            text=data.text,
            created_by=current_user.id,
            task_id=data.task_id,
        )
        uow.task_reports.add(task_report)
        uow.commit()
        return task_report.dumps()
