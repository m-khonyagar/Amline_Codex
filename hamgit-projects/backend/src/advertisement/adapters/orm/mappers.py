from sqlalchemy.orm import relationship

from advertisement.adapters.orm.data_models import (
    property_ads,
    property_wanted_ads,
    swap_ads,
    visit_requests,
)
from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.domain.entities.swap_ad import SwapAd
from advertisement.domain.entities.visit_request import VisitRequest
from core.database import SQLALCHEMY_REGISTRY


def start_mappers():
    SQLALCHEMY_REGISTRY.map_imperatively(
        SwapAd,
        swap_ads,
        properties={
            "user": relationship(
                "User",
                primaryjoin="User.id == SwapAd.user_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            )
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(PropertyWantedAd, property_wanted_ads)
    SQLALCHEMY_REGISTRY.map_imperatively(
        PropertyAd,
        property_ads,
        properties={
            "user": relationship(
                "User",
                primaryjoin="User.id == PropertyAd.user_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "city": relationship(
                "City",
                primaryjoin="City.id == PropertyAd.city_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "district": relationship(
                "District",
                primaryjoin="District.id == PropertyAd.district_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "property": relationship(
                "Property",
                primaryjoin="Property.id == PropertyAd.property_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        VisitRequest,
        visit_requests,
        properties={
            "advertisement": relationship(
                "PropertyAd",
                primaryjoin="PropertyAd.id == VisitRequest.advertisement_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            )
        },
    )
