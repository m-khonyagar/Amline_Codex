from account.domain.entities.user import User
from account.domain.enums import UserRole
from advertisement.domain.entities.property_ad import (
    PropertyAd,
    set_ad_category_based_on_property_type,
)
from advertisement.domain.enums import AdStatus, AdType
from advertisement.entrypoints.request_models import CreatePropertyForAdRequest
from advertisement.service_layer.dtos import CreateAdminPropertyAdDto
from core import settings
from core.exceptions import ConflictException, ValidationException
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


# TEMP: this is a copy of create_admin_property_ad_handler to temporarily publish landlord file
def publish_landlord_file(command: CreateAdminPropertyAdDto, uow: UnitOfWork, current_user: User):
    command_dict = command.dumps()
    amline_user = uow.users.get_or_raise(id=settings.AMLINE_CRM_USER_ID)
    property_info: dict = command_dict.get("property_info")  # type: ignore
    command_dict.pop("property_info")
    if image_file_ids := property_info.get("image_file_ids"):
        property_info["image_file_ids"] = [i for i in image_file_ids if i is not None]
    property = Property.create(
        owner_user_id=current_user.id,
        owner_user_role=UserRole.AD_MODERATOR,
        city_id=command.city_id,
        **property_info,
    )
    command_dict.pop("mobile")

    property_ad = PropertyAd.create(
        user_id=amline_user.id,
        property_id=property.id,
        created_by=current_user.id,
        created_by_admin=True,
        status=AdStatus.PENDING,
        category=set_ad_category_based_on_property_type(property_info["property_type"]),
        **command_dict,
    )
    uow.properties.add(property)
    uow.flush()
    uow.property_ads.add(property_ad)
    uow.flush()
    return property_ad


def publish_landlord_file_handler(file_id: int, title: str, uow: UnitOfWork, current_user: User):
    with uow:
        landlord_file = uow.landlord_files.get_or_raise(id=file_id)
        if not all([title, landlord_file.city_id, landlord_file.property_type]):
            raise ValidationException(detail="لطفا شهر و نوع کاربری ملک را در فایل تکمیل کنید")

        if landlord_file.published_on_amline:
            raise ConflictException(
                detail=f"This file is already published on amline with id: {landlord_file.amline_ad_id}"
            )
        data = CreateAdminPropertyAdDto(
            mobile=current_user.mobile,
            type=AdType.FOR_RENT,
            title=title,
            description="",
            city_id=landlord_file.city_id,  # type: ignore
            district_id=landlord_file.district_id,  # type: ignore
            location=dict(),
            property_info=CreatePropertyForAdRequest(
                property_type=landlord_file.property_type,
                area=landlord_file.area,
                build_year=landlord_file.build_year,
                is_rebuilt=landlord_file.renovated,
                number_of_rooms=landlord_file.room_count,
                other_facilities=landlord_file.other_facilities,
                parking=True if landlord_file.parking_type else False,
                elevator=landlord_file.elevator,
                storage_room=landlord_file.storage,
            ).model_dump(),  # type: ignore
            image_file_ids=landlord_file.property_image_file_ids or [],
        )
        property_ad = publish_landlord_file(command=data, uow=uow, current_user=current_user)
        landlord_file.amline_ad_id = property_ad.id
        landlord_file.published_on_amline = True
        uow.commit()
        uow.landlord_files.refresh(landlord_file)
        return landlord_file.dumps()
