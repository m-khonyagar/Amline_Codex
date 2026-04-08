from sqlalchemy import asc

from account.domain.entities.user import User
from crm.domain.entities.file_call import FileCall
from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.realtor_file import RealtorFile
from crm.domain.entities.tenant_file import TenantFile
from unit_of_work import UnitOfWork


def get_file_calls_by_file_id(file_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        file_calls: list[tuple[FileCall, User]] = (
            uow.session.query(FileCall, User)
            .join(User, FileCall.created_by == User.id)
            .filter(FileCall.file_id == file_id)
            .order_by(asc(FileCall.created_at))  # type: ignore
            .all()
        )
        return [dict(**file_call.dumps(), user=user.short_dumps()) for file_call, user in file_calls]


def get_file_calls_by_user_id(user_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        user = uow.users.get_or_raise(id=user_id)
        landlord_file_calls: list[tuple[FileCall, User]] = (
            uow.session.query(FileCall, User)
            .join(User, FileCall.created_by == User.id)
            .join(LandlordFile, FileCall.file_id == LandlordFile.id)
            .filter(LandlordFile.mobile == user.mobile)
            .order_by(asc(FileCall.created_at))  # type: ignore
            .all()
        )
        landlord_file_calls_list = [
            dict(**file_call.dumps(), user=user.short_dumps()) for file_call, user in landlord_file_calls
        ]

        tenant_file_calls: list[tuple[FileCall, User]] = (
            uow.session.query(FileCall, User)
            .join(User, FileCall.created_by == User.id)
            .join(TenantFile, FileCall.file_id == TenantFile.id)
            .filter(TenantFile.mobile == user.mobile)
            .order_by(asc(FileCall.created_at))  # type: ignore
            .all()
        )
        tenant_file_calls_list = [
            dict(**file_call.dumps(), user=user.short_dumps()) for file_call, user in tenant_file_calls
        ]

        realtor_file_calls: list[tuple[FileCall, User]] = (
            uow.session.query(FileCall, User)
            .join(User, FileCall.created_by == User.id)
            .join(RealtorFile, FileCall.file_id == RealtorFile.id)
            .filter(RealtorFile.mobile == user.mobile)
            .order_by(asc(FileCall.created_at))  # type: ignore
            .all()
        )
        realtor_file_calls_list = [
            dict(**file_call.dumps(), user=user.short_dumps()) for file_call, user in realtor_file_calls
        ]

        return landlord_file_calls_list + tenant_file_calls_list + realtor_file_calls_list
