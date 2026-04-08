import abc
from typing import Type

from sqlalchemy import func, text

from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.domain.enums import AdType
from advertisement.entrypoints.request_models import GetWantedAdFilter
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.types import PaginateParams


class PropertyWantedAdRepository(AbstractRepository[PropertyWantedAd], abc.ABC):

    def single_property_wanted_ad(self, id: int) -> PropertyWantedAd:
        return self._single_property_wanted_ad(id)

    def find_all(self, paginate: PaginateParams) -> list[PropertyWantedAd]:
        return self._find_all(paginate)

    def find_all_property_wanted_ads(
        self, filters: GetWantedAdFilter, paginate: PaginateParams
    ) -> list[PropertyWantedAd]:
        return self._find_all_property_wanted_ads(filters, paginate)

    def admin_find_all_property_wanted_ads(
        self, filters: GetWantedAdFilter, search_text: str | None, paginate: PaginateParams
    ):
        return self._admin_find_all_property_wanted_ads(filters, search_text, paginate)

    def find_all_user_property_wanted_ads(self, user_id: int, paginate: PaginateParams) -> list[PropertyWantedAd]:
        return self._find_all_user_property_wanted_ads(user_id, paginate)

    @abc.abstractmethod
    def _find_all_property_wanted_ads(
        self, filters: GetWantedAdFilter, paginate: PaginateParams
    ) -> list[PropertyWantedAd]: ...

    @abc.abstractmethod
    def _admin_find_all_property_wanted_ads(
        self, filters: GetWantedAdFilter, search_text: str | None, paginate: PaginateParams
    ): ...

    @abc.abstractmethod
    def _find_all_user_property_wanted_ads(self, user_id: int, paginate: PaginateParams) -> list[PropertyWantedAd]: ...

    @abc.abstractmethod
    def _find_all(self, paginate: PaginateParams) -> list[PropertyWantedAd]: ...

    @abc.abstractmethod
    def _single_property_wanted_ad(self, id: int) -> PropertyWantedAd: ...


class SQLAlchemyPropertyWantedAdRepository(AbstractSQLAlchemyRepository[PropertyWantedAd], PropertyWantedAdRepository):

    @property
    def entity_type(self) -> Type[PropertyWantedAd]:
        return PropertyWantedAd

    def _find_all(self, paginate: PaginateParams) -> list[PropertyWantedAd]:
        return (
            self.query.filter_by(deleted_at=None)
            .order_by(PropertyWantedAd.created_at)  # type: ignore
            .limit(paginate.limit)
            .offset(paginate.offset)
            .all()
        )

    def _find_all_property_wanted_ads(self, filters: GetWantedAdFilter, paginate: PaginateParams):
        base_query = """
            WITH districts_agg AS (
            SELECT wa.id AS wa_id,
                json_agg(
                    json_build_object(
                        'id', d.id,
                        'name', d.name
                    )
                ) AS districts_list
            FROM advertisement.property_wanted_ads wa
            LEFT JOIN shared.districts d ON d.id = ANY(wa.districts::bigint[])
            GROUP BY wa.id)
            SELECT
                wa.*,
                json_build_object('user', u.*) AS user,
                json_build_object('id', c.id, 'name',c.name,'province', p.name) AS city,
                COALESCE(da.districts_list, '[]'::json) AS districts_list
            FROM advertisement.property_wanted_ads wa
            JOIN account.users u ON u.id = wa.user_id
            JOIN shared.cities c ON c.id = wa.city_id
            JOIN shared.provinces p ON p.id = c.province_id
            LEFT JOIN districts_agg da ON da.wa_id = wa.id
            WHERE wa.deleted_at IS NULL AND wa.status = 'PUBLISHED'
            """
        conditions = []
        params = {}

        def add_condition(condition, param_key, param_value):
            if param_value:
                conditions.append(condition)
                params[param_key] = param_value

        add_condition("wa.type = :type", "type", filters.type.value if filters.type is not None else None)
        add_condition("wa.city_id = :city_id", "city_id", filters.city)
        add_condition("wa.max_rent >= :min_rent", "min_rent", filters.min_rent)
        add_condition("wa.max_rent <= :max_rent", "max_rent", filters.max_rent)
        add_condition("wa.min_size >= :min_meter", "min_meter", filters.min_meter)
        add_condition("wa.min_size <= :max_meter", "max_meter", filters.max_meter)
        add_condition("wa.sale_price >= :min_sale_price", "min_sale_price", filters.min_sale_price)
        add_condition("wa.sale_price <= :max_sale_price", "max_sale_price", filters.max_sale_price)
        add_condition("wa.room_count = :room_count", "room_count", filters.room_count)
        add_condition("wa.max_deposit >= :min_deposit", "min_deposit", filters.min_deposit)
        add_condition("wa.max_deposit <= :max_deposit", "max_deposit", filters.max_deposit)
        add_condition("wa.districts && ARRAY[:districts]::integer[]", "districts", filters.districts)
        add_condition("wa.parking = :parking", "parking", filters.parking)
        add_condition("wa.storage_room = :storage_room", "storage_room", filters.storage_room)
        add_condition("wa.elevator = :elevator", "elevator", filters.elevator)
        add_condition(
            "wa.construction_year >= :min_construction_year", "min_construction_year", filters.min_construction_year
        )
        add_condition(
            "wa.construction_year <= :max_construction_year", "max_construction_year", filters.max_construction_year
        )
        add_condition(
            "wa.property_type && ARRAY[:property_type]::character varying[] OR wa.property_type is not null",
            "property_type",
            filters.property_type,
        )

        if conditions:
            base_query += " AND " + " AND ".join(conditions)

        if filters.order_by_cheapest is True:
            if filters.type == AdType.FOR_RENT:
                base_query += " ORDER BY max_rent ASC"
            elif filters.type == AdType.FOR_SALE:
                base_query += " ORDER BY sale_price ASC"
        if filters.order_by_cheapest is False:
            if filters.type == AdType.FOR_RENT:
                base_query += " ORDER BY max_rent DESC"
            elif filters.type == AdType.FOR_SALE:
                base_query += " ORDER BY sale_price DESC"
        else:
            # if filters.type == AdType.FOR_RENT:
            #     base_query += " ORDER BY max_rent DESC"
            # elif filters.type == AdType.FOR_SALE:
            #     base_query += " ORDER BY sale_price DESC"
            # elif filters.user_city_ids:
            #     base_query += f"""
            #     ORDER BY CASE WHEN wa.city_id = ANY(ARRAY[{filters.user_city_ids}]::int[]) THEN 0 ELSE 1 END,
            #     wa.accepted_at DESC ,wa.city_id
            #     """
            # else:
            base_query += " ORDER BY wa.created_at DESC"

        base_query += " LIMIT :limit OFFSET :offset"
        params["limit"] = paginate.limit
        params["offset"] = paginate.offset

        query = text(base_query)
        result = self.session.execute(query, params).mappings().fetchall()

        return [PropertyWantedAd(**r) for r in result]

    def _admin_find_all_property_wanted_ads(  # type: ignore
        self, filters: GetWantedAdFilter, search_text: str | None, paginate: PaginateParams
    ):
        params = {}
        conditions = []
        base_query = """
            WITH districts_agg AS (
            SELECT wa.id AS wa_id,
                json_agg(
                    json_build_object(
                        'id', d.id,
                        'name', d.name
                    )
                ) AS districts_list
            FROM advertisement.property_wanted_ads wa
            LEFT JOIN shared.districts d ON d.id = ANY(wa.districts::bigint[])
            GROUP BY wa.id)
            SELECT
                wa.*,
                json_build_object('user', u.*) AS user,
                json_build_object('id', c.id, 'name',c.name,'province', p.name) AS city,
                COALESCE(da.districts_list, '[]'::json) AS districts_list
            FROM advertisement.property_wanted_ads wa
            JOIN account.users u ON u.id = wa.user_id
            JOIN shared.cities c ON c.id = wa.city_id
            JOIN shared.provinces p ON p.id = c.province_id
            LEFT JOIN districts_agg da ON da.wa_id = wa.id
            WHERE wa.deleted_at IS NULL
            """

        def add_condition(condition, param_key, param_value):
            if param_value:
                conditions.append(condition)
                params[param_key] = param_value

        add_condition("wa.type = :type", "type", filters.type.value if filters.type is not None else None)
        add_condition("wa.city_id = :city_id", "city_id", filters.city)
        add_condition("wa.status = :status", "status", filters.status)
        add_condition("wa.max_rent >= :min_rent", "min_rent", filters.min_rent)
        add_condition("wa.max_rent <= :max_rent", "max_rent", filters.max_rent)
        add_condition("wa.min_size >= :min_meter", "min_meter", filters.min_meter)
        add_condition("wa.min_size <= :max_meter", "max_meter", filters.max_meter)
        add_condition("wa.sale_price >= :min_sale_price", "min_sale_price", filters.min_sale_price)
        add_condition("wa.sale_price <= :max_sale_price", "max_sale_price", filters.max_sale_price)
        add_condition("wa.room_count = :room_count", "room_count", filters.room_count)
        add_condition("wa.max_deposit >= :min_deposit", "min_deposit", filters.min_deposit)
        add_condition("wa.max_deposit <= :max_deposit", "max_deposit", filters.max_deposit)
        add_condition("wa.districts && ARRAY[:districts]::integer[]", "districts", filters.districts)
        add_condition("wa.parking = :parking", "parking", filters.parking)
        add_condition("wa.storage_room = :storage_room", "storage_room", filters.storage_room)
        add_condition("wa.elevator = :elevator", "elevator", filters.elevator)
        add_condition(
            "wa.construction_year >= :min_construction_year", "min_construction_year", filters.min_construction_year
        )
        add_condition(
            "wa.construction_year <= :max_construction_year", "max_construction_year", filters.max_construction_year
        )
        add_condition(
            "wa.property_type && ARRAY[:property_type]::character varying[] OR wa.property_type is not null",
            "property_type",
            filters.property_type,
        )

        if conditions:
            base_query += " AND " + " AND ".join(conditions)
        if search_text:
            base_query += f" AND u.mobile ilike '{search_text}%'"

        if filters.order_by_cheapest:
            if filters.type == AdType.FOR_RENT:
                base_query += " ORDER BY max_rent ASC"
            elif filters.type == AdType.FOR_SALE:
                base_query += " ORDER BY sale_price ASC"
        else:
            if filters.type == AdType.FOR_RENT:
                base_query += " ORDER BY max_rent DESC"
            elif filters.type == AdType.FOR_SALE:
                base_query += " ORDER BY sale_price DESC"
            else:
                base_query += " ORDER BY wa.created_at DESC"

        base_query += " LIMIT :limit OFFSET :offset"
        params["limit"] = paginate.limit
        params["offset"] = paginate.offset

        query = text(base_query)
        result = self.session.execute(query, params).fetchall()
        t_query = self.session.query(func.count(self.entity_type.id)).filter(  # type: ignore
            self.entity_type.deleted_at.is_(None)  # type: ignore
        )

        if filters.type:
            t_query = t_query.filter(self.entity_type.type == filters.type)

        total_count = t_query.scalar()  # type: ignore

        return total_count, [PropertyWantedAd(*r) for r in result]

    def _find_all_user_property_wanted_ads(self, user_id: int, paginate: PaginateParams) -> list[PropertyWantedAd]:
        raw_query = f"""
            WITH districts_agg AS (
            SELECT
                wa.id AS wa_id,
                json_agg(
                    json_build_object(
                        'id', d.id,
                        'name', d.name
                    )
                ) AS districts_list
            FROM advertisement.property_wanted_ads wa
            LEFT JOIN shared.districts d ON d.id = ANY(wa.districts::bigint[])
            GROUP BY wa.id
            )
            SELECT
            wa.*,
            json_build_object('user', u.*) AS user,
            json_build_object('id', c.id, 'name',c.name,'province', p.name) AS city,
            COALESCE(da.districts_list, '[]'::json) AS districts_list
            FROM advertisement.property_wanted_ads wa
            JOIN account.users u ON u.id = wa.user_id
            JOIN shared.cities c ON c.id = wa.city_id
            JOIN shared.provinces p ON p.id = c.province_id
            JOIN districts_agg da ON da.wa_id = wa.id
            WHERE wa.deleted_at IS NULL AND u.id = {user_id}
            ORDER BY wa.created_at DESC
            """
        raw_query += f" LIMIT {paginate.limit} OFFSET {paginate.offset}"
        query = text(raw_query)
        result = self.session.execute(query).mappings().fetchall()
        return [PropertyWantedAd(**r) for r in result]

    def _single_property_wanted_ad(self, id: int) -> PropertyWantedAd:
        raw_query = f"""
            WITH districts_agg AS (
            SELECT
                wa.id AS wa_id,
                json_agg(
                    json_build_object(
                        'id', d.id,
                        'name', d.name
                    )
                ) AS districts_list
            FROM advertisement.property_wanted_ads wa
            LEFT JOIN shared.districts d ON d.id = ANY(wa.districts::bigint[])
            GROUP BY wa.id
            )
            SELECT
            wa.*,
            json_build_object('user', u.*) AS user,
            json_build_object('id', c.id, 'name',c.name,'province', p.name) AS city,
            COALESCE(da.districts_list, '[]'::json) AS districts_list
            FROM advertisement.property_wanted_ads wa
            JOIN account.users u ON u.id = wa.user_id
            JOIN shared.cities c ON c.id = wa.city_id
            JOIN shared.provinces p ON p.id = c.province_id
            LEFT JOIN districts_agg da ON da.wa_id = wa.id
            WHERE wa.deleted_at IS NULL AND wa.id = {id}
            """
        query = text(raw_query)
        result = self.session.execute(query).mappings().fetchone()
        return PropertyWantedAd(**result) if result is not None else None  # type: ignore
