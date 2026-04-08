import abc
from typing import Type

from sqlalchemy import desc, text

from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.enums import AdType
from advertisement.entrypoints.request_models import GetPropertyAdFilter
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.types import PaginateParams


class PropertyAdRepository(AbstractRepository[PropertyAd], abc.ABC):

    def find_by_user_id(self, user_id: int) -> list[PropertyAd]:
        return self._find_by_user_id(user_id)

    def find_all_property_ads(self, filters: GetPropertyAdFilter, paginate: PaginateParams) -> list[PropertyAd]:
        return self._find_all_property_ads(filters, paginate)

    def find_all(self) -> list[PropertyAd]:
        return self._find_all()

    def find_all_with_paginate(self, paginate: PaginateParams) -> list[PropertyAd]:
        return self._find_all_with_paginate(paginate)

    @abc.abstractmethod
    def _find_by_user_id(self, user_id: int) -> list[PropertyAd]: ...

    @abc.abstractmethod
    def _find_all_property_ads(self, filters: GetPropertyAdFilter, paginate: PaginateParams) -> list[PropertyAd]: ...

    @abc.abstractmethod
    def _find_all(self) -> list[PropertyAd]: ...

    @abc.abstractmethod
    def _find_all_with_paginate(self, paginate: PaginateParams) -> list[PropertyAd]: ...


class SQLAlchemyPropertyAdRepository(AbstractSQLAlchemyRepository[PropertyAd], PropertyAdRepository):

    @property
    def entity_type(self) -> Type[PropertyAd]:
        return PropertyAd

    def _find_by_user_id(self, user_id: int) -> list[PropertyAd]:
        return self.query.filter_by(user_id=user_id, deleted_at=None).all()

    def _find_all_property_ads(self, filters: GetPropertyAdFilter, paginate: PaginateParams) -> list[PropertyAd]:

        base_query = """
        WITH images AS (
            SELECT pa.id AS ads,
                json_agg(
                    json_build_object(
                        'id', f.id,
                        'name', f.name
                    )
                ) AS images_list
            FROM advertisement.property_ads pa
            JOIN shared.files_ f ON f.id = ANY(pa.image_file_ids::bigint[])
            GROUP BY pa.id
        )
        SELECT
            pa.*,
            json_build_object('user', NULL) AS user,
            json_build_object('id', c.id, 'name', c.name, 'province', p.name) AS city,
            json_build_object('id', d.id,'name',d.name) AS district,
            json_build_object('property', pr.*) AS property,
            COALESCE(im.images_list, '[]'::json) AS images
        FROM advertisement.property_ads pa
        JOIN account.users u ON u.id = pa.user_id
        JOIN shared.cities c ON c.id = pa.city_id
        JOIN shared.provinces p ON p.id = c.province_id
        LEFT JOIN shared.districts d ON d.id = pa.district_id
        JOIN shared.properties pr ON pr.id = pa.property_id
        LEFT JOIN images im ON im.ads = pa.id
        WHERE pa.deleted_at IS NULL AND pa.status = 'PUBLISHED'
        """
        conditions = []
        params = {}

        def add_condition(condition, param_key, param_value):
            if param_value:
                conditions.append(condition)
                params[param_key] = param_value

        add_condition("pa.type = :type", "type", filters.type.value if filters.type is not None else None)
        add_condition(
            "pa.category = :category", "category", filters.category.value if filters.category is not None else None
        )
        add_condition("pa.city_id = :city_id", "city_id", filters.city)
        add_condition("pr.rent_amount >= :min_rent", "min_rent", filters.min_rent)
        add_condition("pr.rent_amount <= :max_rent", "max_rent", filters.max_rent)
        add_condition("pr.area >= :min_meter", "min_meter", filters.min_meter)
        add_condition("pr.area <= :max_meter", "max_meter", filters.max_meter)
        add_condition("pr.number_of_rooms = :room_count", "room_count", filters.room_count)
        add_condition("pa.deposit_amount >= :min_deposit", "min_deposit", filters.min_deposit)
        add_condition("pa.deposit_amount <= :max_deposit", "max_deposit", filters.max_deposit)
        add_condition("pr.elevator = :elevator", "elevator", filters.elevator)
        add_condition("pr.parking = :parking", "parking", filters.parking)
        add_condition("pr.storage_room = :storage_room", "storage_room", filters.storage_room)
        add_condition("pa.district_id = any(:districts)", "districts", filters.districts)
        add_condition("pr.build_year >= :min_construction_year", "min_construction_year", filters.min_construction_year)
        add_condition("pr.build_year <= :max_construction_year", "max_construction_year", filters.max_construction_year)
        add_condition(
            "array_position(:property_type, pr.property_type) is not null",
            "property_type",
            [p.name for p in filters.property_type],
        )  # TODO property type should be a list also elevator must be added to property

        if conditions:
            base_query += " AND " + " AND ".join(conditions)

        if filters.user_city_ids:
            base_query += f"""
            ORDER BY CASE WHEN pa.city_id = ANY(ARRAY[{filters.user_city_ids}]::int[]) THEN 0 ELSE 1 END,
            pa.accepted_at DESC,pa.city_id
            """
        else:
            base_query += " ORDER BY pa.accepted_at DESC"

        if filters.order_by_cheapest is True:
            if filters.type == AdType.FOR_RENT:
                base_query += " , rent_amount ASC"
            elif filters.type == AdType.FOR_SALE:
                base_query += " , sale_price ASC"
        elif filters.order_by_cheapest is False:
            if filters.type == AdType.FOR_RENT:
                base_query += " , rent_amount DESC"
            elif filters.type == AdType.FOR_SALE:
                base_query += " , sale_price DESC"

        base_query += " LIMIT :limit OFFSET :offset"
        params["limit"] = paginate.limit
        params["offset"] = paginate.offset

        query = text(base_query)
        result = self.session.execute(query, params).mappings().fetchall()

        return [PropertyAd(**r) for r in result] if result is not None else []

    def _find_all(self) -> list[PropertyAd]:
        return self.query.filter_by(deleted_at=None).all()

    def _find_all_with_paginate(self, paginate: PaginateParams) -> list[PropertyAd]:
        return (
            self.query.filter_by(deleted_at=None)
            .order_by(desc(PropertyAd.created_at))  # type: ignore
            .limit(paginate.limit)
            .offset(paginate.offset)
            .all()
        )
