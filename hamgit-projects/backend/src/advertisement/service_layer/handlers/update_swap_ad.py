from account.domain.enums import UserRole
from advertisement.domain.enums import AdStatus
from advertisement.service_layer.dtos import UpdateSwapAdDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def update_swap_ad_handler(command: UpdateSwapAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        swap_ad = uow.swap_ads.get_or_raise(id=command.swap_ad_id)
        swap_ad.update(command)
        if UserRole.SUPERUSER not in current_user.roles:
            swap_ad.status = AdStatus.PENDING

        uow.commit()
        uow.swap_ads.refresh(swap_ad)
        return swap_ad.dumps()
