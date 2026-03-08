from account.domain.enums import UserRole
from advertisement.domain.entities.swap_ad import SwapAd
from advertisement.domain.enums import AdStatus
from advertisement.service_layer.dtos import CreateSwapAdDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def create_swap_ad_handler(command: CreateSwapAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        is_admin = True if UserRole.SUPERUSER in current_user.roles else False
        swap_ad = SwapAd.create(
            title=command.title,
            have=command.have,
            want=command.want,
            price=command.price,
            status=AdStatus.PENDING,
            user_id=current_user.id,
            created_by=current_user.id,
            created_by_admin=is_admin,
            accepted_by=current_user.id if is_admin else None,
        )
        uow.swap_ads.add(swap_ad)
        uow.commit()
        return swap_ad.dumps()
