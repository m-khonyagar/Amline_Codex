from sqlalchemy import desc, or_
from sqlalchemy.sql import func

from account.domain.entities.user import User
from core.exceptions import PermissionException
from core.types import PaginateParams
from crm.domain.entities.task import Task
from crm.domain.entities.task_report import TaskReport
from crm.entrypoints.query_params import TaskQueryParams
from crm.entrypoints.request_models import CreateTaskRequest, UpdateTaskRequest
from unit_of_work import UnitOfWork


def create_task_handler(data: CreateTaskRequest, current_user: User, uow: UnitOfWork):
    with uow:
        task = Task(
            title=data.title,
            description=data.description,
            assigned_to=data.assigned_to,
            status=data.status,
            due_date=data.due_date,
            created_by=current_user.id,
        )
        uow.tasks.add(task)
        uow.commit()
        return task.dumps()


def update_task_handler(task_id: int, data: UpdateTaskRequest, current_user: User, uow: UnitOfWork):
    with uow:
        task = uow.tasks.get_or_raise(id=task_id)
        if task.created_by == current_user.id or current_user.is_superuser:
            task.update(**data.model_dump(exclude_unset=True))
        elif task.assigned_to == current_user.id:
            task.update(status=data.status)
        else:
            raise PermissionException("You do not have permission to update this task.")
        uow.commit()
        return task.dumps()


def get_task_handler(task_id: int, uow: UnitOfWork):
    with uow:
        task = uow.tasks.get_or_raise(id=task_id)
        task_reports: list[TaskReport] = uow.session.query(TaskReport).filter(TaskReport.task_id == task_id).all()
        return task.dumps(task_reports=[task_report.dumps() for task_report in task_reports] if task_reports else [])


def get_all_tasks_handler(uow: UnitOfWork, paginate_params: PaginateParams, query_params: TaskQueryParams):
    with uow:
        tasks_query = uow.session.query(Task).filter(
            or_(Task.title.ilike(f"%{query_params.search}%") if query_params.search else True),  # type: ignore
            or_(Task.status == query_params.status if query_params.status else True),  # type: ignore
            or_(Task.assigned_to == query_params.assigned_to if query_params.assigned_to else True),  # type: ignore
        )
        total_count = tasks_query.count()
        tasks: list[Task] = (
            tasks_query.order_by(desc(func.coalesce(Task.updated_at, Task.created_at)))
            .offset(paginate_params.offset)
            .limit(paginate_params.limit)
            .all()
        )
        return {
            "total_count": total_count,
            "start_index": paginate_params.offset,
            "end_index": paginate_params.offset + len(tasks),
            "data": [task.dumps() for task in tasks],
        }
