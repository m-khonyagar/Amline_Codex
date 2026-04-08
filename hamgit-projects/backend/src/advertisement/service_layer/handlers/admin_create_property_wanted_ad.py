from account.domain.entities.user import User
from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.service_layer.dtos import CreateAdminPropertyWantedAdDto
from core import helpers
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def create_admin_property_wanted_ad_handler(
    command: CreateAdminPropertyWantedAdDto, uow: UnitOfWork, current_user: CurrentUser
):
    with uow:
        validated_mobile = helpers.validate_mobile_number(command.mobile)
        user = uow.users.get(mobile=validated_mobile)
        if not user:
            user = User(mobile=validated_mobile)
            uow.users.add(user)

        command_dict = command.dumps()
        command_dict.pop("mobile")

        property_wanted_ad = PropertyWantedAd.create(
            user_id=user.id,
            created_by=current_user.id,
            created_by_admin=True,
            **command_dict,
        )
        uow.property_wanted_ads.add(property_wanted_ad)
        uow.commit()
        return property_wanted_ad.dumps()
