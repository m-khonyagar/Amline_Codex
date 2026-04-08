import datetime as dt

from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.domain.entities.swap_ad import SwapAd
from advertisement.domain.enums import AdCategory
from core.base.base_entity import BaseEntity


class SavedAds(BaseEntity):
    id: int
    user_id: int
    ad_id: int
    ad_type: AdCategory
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    ad_data: dict = {}

    def __init__(
        self,
        id: int,
        user_id: int,
        ad_id: int,
        ad_type: AdCategory,
        created_at: dt.datetime,
        updated_at: dt.datetime | None = None,
        deleted_at: dt.datetime | None = None,
        ad_data: dict = {},
    ):
        self.id = id
        self.user_id = user_id
        self.ad_id = ad_id
        self.ad_type = ad_type
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at
        self.ad_data = ad_data

    @classmethod
    def create(cls, user_id: int, ad_id: int, ad_type: AdCategory):
        return cls(
            id=cls.get_next_id(),
            user_id=user_id,
            ad_id=ad_id,
            ad_type=ad_type,
            created_at=dt.datetime.now(dt.UTC),
        )

    def soft_delete(self):
        self.deleted_at = dt.datetime.now(dt.UTC)

    def dumps(self, **kwargs) -> dict:
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "ad_id": str(self.ad_id),
            "ad_type": AdCategory.resolve(self.ad_type),
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "ad_data": (
                self.enrich_ad_data(self.ad_data)
                if (self.ad_data and not isinstance(self.ad_data, dict))
                else self.ad_data
            ),
        }

    def enrich_ad_data(self, data: dict[str, dict]):
        k = list(data.keys())[0]
        v = data[k].values()
        match k:
            case AdCategory.AD.name:
                v = PropertyAd(*v).dumps()
            case AdCategory.WANTED_AD.name:
                v = PropertyWantedAd(*v).dumps()
            case AdCategory.SWAP_AD.name:
                v = SwapAd(*v).dumps()
        return v
