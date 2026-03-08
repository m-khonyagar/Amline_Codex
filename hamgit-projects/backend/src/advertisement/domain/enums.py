from core.base.base_enum import BaseEnum


class AdType(BaseEnum):
    FOR_RENT = "FOR_RENT"
    FOR_SALE = "FOR_SALE"


class AdStatus(BaseEnum):
    PENDING = "PENDING"
    REJECTED = "REJECTED"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class AdCategory(BaseEnum):
    AD = "AD"
    SWAP_AD = "SWAP_AD"
    WANTED_AD = "WANTED_AD"


class PropertyAdCategory(BaseEnum):
    LAND = "LAND"
    VILLA = "VILLA"
    OTHERS = "OTHERS"
    APARTMENT = "APARTMENT"
    COMMERCIAL = "COMMERCIAL"
    INSDUSTRIAL = "INSDUSTRIAL"
    IN_CONTRUCTION = "IN_CONTRUCTION"
    ADMINISTRATIVE = "ADMINISTRATIVE"


class VisitRequestStatus(BaseEnum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
