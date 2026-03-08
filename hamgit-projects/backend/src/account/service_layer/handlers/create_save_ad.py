from account.domain.entities.saved_ads import SavedAds
from account.service_layer.dtos import CreateSavedAdDto
from core.exceptions import ConflictException
from core.translates import expressions_trans
from unit_of_work import UnitOfWork


def save_ad_handler(data: CreateSavedAdDto, user_id: int, uow: UnitOfWork) -> bool:

    with uow:
        if saved_ad := uow.user_saved_ads.get(user_id=user_id, ad_id=data.ad_id):
            raise ConflictException(expressions_trans.AD_ALREADY_SUBMITTED)

        saved_ad = SavedAds.create(user_id=user_id, ad_id=data.ad_id, ad_type=data.ad_type)

        uow.user_saved_ads.add(saved_ad)
        uow.commit()

        return True
