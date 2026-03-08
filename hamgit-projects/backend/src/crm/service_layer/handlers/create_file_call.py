from account.domain.entities.user import User
from core import helpers
from crm.domain.entities.file_call import FileCall
from crm.entrypoints.request_models import FileCallCreateRequest
from unit_of_work import UnitOfWork


def create_file_call_handler(data: FileCallCreateRequest, uow: UnitOfWork, current_user: User) -> dict:
    with uow:
        data.mobile = helpers.validate_mobile_number(data.mobile)
        file_call = FileCall(
            file_id=data.file_id,
            mobile=data.mobile,
            description=data.description,
            status=data.status,
            created_by=current_user.id,
        )
        uow.file_calls.add(file_call)
        uow.commit()
        uow.file_calls.refresh(file_call)
        return file_call.dumps()
