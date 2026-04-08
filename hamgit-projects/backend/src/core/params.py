from sqlalchemy import desc

from core.exceptions import ValidationException


class PaginateParams:
    def __init__(self, offset: int = 0, limit: int = 10, sort_by: str = "id", order="asc"):
        self.offset = offset if offset > 0 else 0
        self.limit = limit if limit <= 100 else 100
        self.sort_by = sort_by
        self.order = order

    def sql_order_by(self, entity):
        if not hasattr(entity, self.sort_by):
            raise ValidationException(f"entity has not any attribute {self.sort_by}")

        if self.order == "des":
            return desc(getattr(entity, self.sort_by))
        else:
            return getattr(entity, self.sort_by)
