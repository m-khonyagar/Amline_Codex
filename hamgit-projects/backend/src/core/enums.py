from core.base.base_enum import BaseEnum


class SortDirection(BaseEnum):
    ASC = "asc"
    DESC = "desc"


class BaseInvoiceItemType(BaseEnum):
    TAX = "TAX"
    DELIVERY = "DELIVERY"
    DISCOUNT = "DISCOUNT"
    TRACKING_CODE = "TRACKING_CODE"
    WALLET_CREDIT = "WALLET_CREDIT"
