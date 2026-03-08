from account.domain.entities.user import User
from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.domain.enums import AdType
from advertisement.service_layer.dtos import CreateAdminPropertyWantedAdDto
from core import settings
from core.exceptions import ConflictException, ValidationException
from unit_of_work import UnitOfWork


# TEMP: this is a copy of create_property_wanted_ad_handler to temporarily publish tenant file
def publish_tenant_file(command: CreateAdminPropertyWantedAdDto, uow: UnitOfWork, current_user: User):
    amline_user = uow.users.get_or_raise(id=settings.AMLINE_CRM_USER_ID)
    command_dict = command.dumps()
    command_dict.pop("mobile")

    property_wanted_ad = PropertyWantedAd.create(
        user_id=amline_user.id,
        created_by=current_user.id,
        created_by_admin=True,
        **command_dict,
    )
    uow.property_wanted_ads.add(property_wanted_ad)
    uow.flush()
    return property_wanted_ad


def publish_tenant_file_handler(file_id: int, title: str, uow: UnitOfWork, current_user: User):
    with uow:
        tenant_file = uow.tenant_files.get_or_raise(id=file_id)
        if not all([title, tenant_file.city_id]):
            raise ValidationException(detail="لطفا شهر و نوع کاربری ملک را در فایل تکمیل کنید")

        if tenant_file.published_on_amline:
            raise ConflictException(
                detail=f"This file is already published on amline with id: {tenant_file.amline_ad_id}"
            )

        data = CreateAdminPropertyWantedAdDto(
            mobile=current_user.mobile,
            type=AdType.FOR_RENT,
            title=title,
            description="",
            city_id=tenant_file.city_id,  # type: ignore
            min_size=int(tenant_file.area or 0),
            room_count=tenant_file.room_count or 0,
            property_type=[tenant_file.property_type] if tenant_file.property_type else [],
            districts=tenant_file.district_ids or [],
            elevator=tenant_file.elevator or False,
            parking=tenant_file.parking or False,
            storage_room=tenant_file.storage or False,
            max_rent=tenant_file.rent,
            max_deposit=tenant_file.deposit,
            sale_price=None,
            construction_year=tenant_file.build_year,
        )
        property_wanted_ad = publish_tenant_file(command=data, uow=uow, current_user=current_user)
        tenant_file.amline_ad_id = property_wanted_ad.id
        tenant_file.published_on_amline = True
        uow.commit()
        uow.tenant_files.refresh(tenant_file)
        return tenant_file.dumps()
