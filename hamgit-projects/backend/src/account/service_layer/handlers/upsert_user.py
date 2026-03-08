from datetime import date

from account.domain.entities.user import User
from account.service_layer.dtos import CreateUserDto
from core import helpers
from core.types import CurrentUser
from shared.service_layer.services.user_verifier_service import UserVerifierService
from unit_of_work import UnitOfWork


def upsert_user_handler(
    data: CreateUserDto, uow: UnitOfWork, verifier: UserVerifierService, current_user: CurrentUser
) -> dict:
    with uow:
        data.mobile = helpers.validate_mobile_number(data.mobile)

        if data.verify_identity:
            verified_data = verifier.verify_user_info(
                mobile=data.mobile,
                national_code=data.national_code or "",
                birth_date=data.birth_date or date.today(),
            )
            data.first_name = verified_data["first_name"]
            data.last_name = verified_data["last_name"]
            data.father_name = verified_data["father_name"]
            data.is_verified = True

        user = uow.users.get(mobile=data.mobile)

        if not user:
            user = User(mobile=data.mobile)
            uow.users.add(user)

        if data.roles:
            helpers.can_assign_role(
                assigner_roles=current_user.roles, assignee_roles=data.roles, existing_assignee_roles=user.roles
            )

        user.update(**data.dumps())

        uow.commit()
        uow.users.refresh(user)
        return user.dumps()
