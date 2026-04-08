from account.domain.entities.user import User
from core.helpers import remove_user_objects
from unit_of_work import UnitOfWork


def get_property_ad(user: User | None, id: int, uow: UnitOfWork):
    images = []
    with uow:
        is_saved = uow.user_saved_ads.get_user_saved_ad(id, user.id) if user else None
        property_ad = uow.property_ads.get_or_raise(id=id)
        for image in property_ad.image_file_ids:
            image_file = uow.files.get(id=image)
            images.append(image_file.dumps()) if image_file else None

        property_ad = remove_user_objects(property_ad)
        return property_ad.dumps(is_saved=bool(is_saved), images=images)
