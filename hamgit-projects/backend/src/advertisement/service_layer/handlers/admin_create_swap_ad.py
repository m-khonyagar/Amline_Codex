from account.domain.entities.user import User
from advertisement.domain.entities.swap_ad import SwapAd
from advertisement.domain.enums import AdStatus
from advertisement.service_layer.dtos import CreateAdminSwapAdDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def create_admin_swap_ad_handler(command: CreateAdminSwapAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        user = uow.users.get(mobile=command.mobile)
        if not user:
            user = User(mobile=command.mobile)
            uow.users.add(user)

        user.nick_name = command.nick_name if command.nick_name is not None else command.nick_name
        command_dict = command.dumps()
        command_dict.pop("mobile")
        command_dict.pop("nick_name")

        swap_ad = SwapAd.create(
            user_id=user.id,
            created_by=current_user.id,
            created_by_admin=True,
            status=AdStatus.PENDING,
            accepted_by=current_user.id,
            **command_dict,
        )
        uow.swap_ads.add(swap_ad)
        uow.commit()
        return swap_ad.dumps()
