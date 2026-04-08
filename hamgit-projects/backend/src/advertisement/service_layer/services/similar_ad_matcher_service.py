from typing import no_type_check

from sqlalchemy import case, func, text
from sqlalchemy.orm import aliased

from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from shared.domain.entities.city import City
from shared.domain.entities.district import District
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


class AdMatcherService:

    @staticmethod
    @no_type_check
    def find_similar_ads(ad_id: int, uow: UnitOfWork) -> list[PropertyAd]:

        session = uow.session

        target_ad_subquery = (
            session.query(
                PropertyAd.id.label("id"),
                PropertyAd.city_id.label("city_id"),
                PropertyAd.district_id.label("district_id"),
                PropertyAd.type.label("type"),
                PropertyAd.sale_price.label("target_sale_price"),
                PropertyAd.deposit_amount.label("target_deposit_amount"),
                PropertyAd.rent_amount.label("target_rent_amount"),
                Property.area.label("target_area"),
                Property.property_type.label("target_property_type"),
            )
            .join(Property, PropertyAd.property_id == Property.id)
            .filter(PropertyAd.id == ad_id)
            .subquery()
        )

        target_ad = aliased(target_ad_subquery, name="target_ad")
        ads = PropertyAd
        prop = Property
        city = City
        district = District
        query = (
            session.query(
                ads,
                prop,
                city,
                district,
                case((ads.city_id == target_ad.c.city_id, 0), else_=1).label("city_mismatch"),
                case((ads.district_id == target_ad.c.district_id, 0), else_=1).label("district_mismatch"),
                case(
                    (
                        ads.type == target_ad.c.type,
                        case(
                            (
                                ads.type == "FOR_SALE",
                                func.abs(ads.sale_price - target_ad.c.target_sale_price)
                                / func.nullif(target_ad.c.target_sale_price, 0),
                            ),
                            (
                                ads.type == "FOR_RENT",
                                (
                                    func.abs(ads.deposit_amount - target_ad.c.target_deposit_amount)
                                    / func.nullif(target_ad.c.target_deposit_amount, 0)
                                )
                                + (
                                    func.abs(ads.rent_amount - target_ad.c.target_rent_amount)
                                    / func.nullif(target_ad.c.target_rent_amount, 0)
                                ),
                            ),
                            else_=1,
                        ),
                    ),
                    else_=1,
                ).label("price_difference"),
                case((prop.property_type == target_ad.c.target_property_type, 0), else_=1).label(
                    "property_type_mismatch"
                ),
                (func.abs(prop.area - target_ad.c.target_area) / func.nullif(target_ad.c.target_area, 0)).label(
                    "area_difference"
                ),
            )
            .join(prop, ads.property_id == prop.id)
            .join(city, ads.city_id == city.id)
            .join(district, ads.district_id == district.id)
            .filter(ads.status == "PUBLISHED")
            .filter(ads.deleted_at is None)
            .filter(ads.id != ad_id)
            .order_by(
                "city_mismatch",
                "district_mismatch",
                "price_difference",
                "property_type_mismatch",
                "area_difference",
            )
            .limit(10)
        )

        results = query.all()

        ad_objects_list = []
        for ad, prop_obj, city_obj, district_obj, *_ in results:
            ad_data = ad.__dict__.copy()
            ad_data.pop("_sa_instance_state", None)
            ad_data["property"] = prop_obj
            ad_data["city"] = city_obj
            ad_data["district"] = district_obj
            ad_objects_list.append(PropertyAd(**ad_data))

        return set(ad_objects_list)

    @staticmethod
    @no_type_check
    def find_similar_wanted_ads(wanted_ad_id: int, uow: UnitOfWork) -> list[PropertyWantedAd]:
        query = text(
            """
            WITH target_ad AS (
                SELECT *
                FROM advertisement.property_wanted_ads
                WHERE id = :wanted_ad_id
            ),
            ads_with_similarity AS (
            SELECT
            json_build_object(
                'ad', row_to_json(wanted_ads),
                'city', row_to_json(c)
            ) AS ad,
            CASE WHEN wanted_ads.city_id = target_ad.city_id THEN 0 ELSE 1 END AS city_mismatch,
            CASE
                WHEN target_ad.districts IS NOT NULL AND array_length(target_ad.districts, 1) > 0 THEN
                    1 - (
                        COALESCE((
                            SELECT COUNT(*)
                            FROM unnest(wanted_ads.districts) AS ad_district
                            JOIN unnest(target_ad.districts) AS target_district
                            ON ad_district = target_district
                        ), 0)::numeric /
                        NULLIF(array_length(target_ad.districts, 1), 0)
                    )
                ELSE 1
            END AS district_mismatch,
            CASE
            WHEN target_ad.property_type IS NOT NULL AND array_length(target_ad.property_type, 1) > 0 THEN
                    1 - (
                        COALESCE((
                            SELECT COUNT(*)
                            FROM unnest(wanted_ads.property_type) AS ad_pt
                            JOIN unnest(target_ad.property_type) AS target_pt
                            ON ad_pt = target_pt
                        ), 0)::numeric /
                        NULLIF(array_length(target_ad.property_type, 1), 0)
                    )
                ELSE 1
            END AS property_type_mismatch,
            CASE
                WHEN target_ad.min_size IS NOT NULL AND target_ad.min_size > 0 THEN
                    ABS(wanted_ads.min_size - target_ad.min_size)::numeric / target_ad.min_size
                ELSE 1
            END AS min_size_difference,
            CASE
                WHEN wanted_ads.type = target_ad.type THEN
                    CASE
                WHEN wanted_ads.type = 'FOR_RENT' THEN
                    (
                        CASE WHEN target_ad.max_deposit IS NOT NULL AND target_ad.max_deposit > 0 THEN
                            ABS(wanted_ads.max_deposit - target_ad.max_deposit)::numeric / target_ad.max_deposit
                        ELSE 1 END
                        +
                        CASE WHEN target_ad.max_rent IS NOT NULL AND target_ad.max_rent > 0 THEN
                            ABS(wanted_ads.max_rent - target_ad.max_rent)::numeric / target_ad.max_rent
                        ELSE 1 END
                    ) / 2
                WHEN wanted_ads.type = 'FOR_SALE' THEN
                    CASE WHEN target_ad.sale_price IS NOT NULL AND target_ad.sale_price > 0 THEN
                        ABS(wanted_ads.sale_price - target_ad.sale_price)::numeric / target_ad.sale_price
                    ELSE 1 END
                ELSE
                    1
                    END
                ELSE
                    1
                END AS price_difference
                FROM advertisement.property_wanted_ads wanted_ads
                JOIN target_ad ON TRUE
                LEFT JOIN shared.cities c ON wanted_ads.city_id = c.id
                WHERE wanted_ads.status = 'PUBLISHED'
                AND wanted_ads.deleted_at is NULL AND wanted_ads.id != :wanted_ad_id
                AND wanted_ads.type = target_ad.type
            )
            SELECT
                ads_with_similarity.ad
            FROM ads_with_similarity
            ORDER BY
                city_mismatch ASC,
                district_mismatch ASC NULLS LAST,
                property_type_mismatch ASC NULLS LAST,
                min_size_difference ASC NULLS LAST,
                price_difference ASC NULLS LAST
            LIMIT 10;
            """
        )

        result = uow.session.execute(query, {"wanted_ad_id": wanted_ad_id}).fetchall()
        ad_objects_list = []
        for r in result:
            if r[0]["ad"]["id"] != wanted_ad_id:
                dict_1 = {**r[0]["ad"]}
                dict_1["city"] = {**r[0]["city"]}
                ad_objects_list.append(PropertyWantedAd(**dict_1))

        return set(ad_objects_list)

    @staticmethod
    @no_type_check
    def find_similar_ads_for_wanted_ad(wanted_ad_id: int, uow: UnitOfWork) -> list[PropertyAd]:
        query = text(
            """
        WITH target_wanted_ad AS (
            SELECT *
        FROM advertisement.property_wanted_ads
        WHERE id = :wanted_ad_id
        ),
        ads_with_similarity AS (
        SELECT
            json_build_object('ad', ads.*,
            'user',null,
            'city', row_to_json(c),
            'district', row_to_json(d),
            'property', row_to_json(p)) AS ad,
            p.property_type AS ad_property_type,
            p.area AS ad_area,
        CASE WHEN ads.city_id = target_wanted_ad.city_id THEN 0 ELSE 1 END AS city_mismatch,
        CASE
        WHEN target_wanted_ad.districts IS NOT NULL AND array_length(target_wanted_ad.districts, 1) > 0 THEN
            CASE WHEN ads.district_id = ANY(target_wanted_ad.districts) THEN 0 ELSE 1 END
        ELSE 1
        END AS district_mismatch,
        CASE
        WHEN target_wanted_ad.property_type IS NOT NULL AND array_length(target_wanted_ad.property_type, 1) > 0 THEN
            CASE WHEN p.property_type = ANY(target_wanted_ad.property_type) THEN 0 ELSE 1 END
        ELSE 1
        END AS property_type_mismatch,
        CASE
        WHEN target_wanted_ad.min_size IS NOT NULL AND target_wanted_ad.min_size > 0 AND p.area IS NOT NULL THEN
            GREATEST(0, (target_wanted_ad.min_size - p.area)::numeric / target_wanted_ad.min_size)
        ELSE 1
        END AS min_size_difference,
        CASE
        WHEN ads.type = target_wanted_ad.type THEN
        CASE
        WHEN ads.type = 'FOR_RENT' THEN
        (CASE WHEN target_wanted_ad.max_deposit IS NOT NULL
        AND target_wanted_ad.max_deposit > 0 AND ads.deposit_amount IS NOT NULL THEN
            GREATEST(0, (ads.deposit_amount - target_wanted_ad.max_deposit)::numeric / target_wanted_ad.max_deposit)
        ELSE 1 END
        +
        CASE WHEN target_wanted_ad.max_rent IS NOT NULL
        AND target_wanted_ad.max_rent > 0 AND ads.rent_amount IS NOT NULL THEN
            GREATEST(0, (ads.rent_amount - target_wanted_ad.max_rent)::numeric / target_wanted_ad.max_rent)
        ELSE 1 END
        ) / 2
        WHEN ads.type = 'FOR_SALE' THEN
        CASE WHEN target_wanted_ad.sale_price IS NOT NULL
        AND target_wanted_ad.sale_price > 0 AND ads.sale_price IS NOT NULL THEN
            GREATEST(0, (ads.sale_price - target_wanted_ad.sale_price)::numeric / target_wanted_ad.sale_price)
        ELSE 1 END
        ELSE
            1
        END
        ELSE
            1
        END AS price_difference
        FROM advertisement.property_ads ads
        LEFT JOIN shared.properties p ON ads.property_id = p.id
        LEFT JOIN shared.cities c ON ads.city_id = c.id
        LEFT JOIN shared.districts d ON ads.district_id = d.id
        CROSS JOIN target_wanted_ad
        WHERE ads.status = 'PUBLISHED' AND ads.deleted_at is NULL
        )
        SELECT
            ads_with_similarity.ad
        FROM ads_with_similarity
        ORDER BY
            city_mismatch ASC,
            district_mismatch ASC,
            property_type_mismatch ASC,
            min_size_difference ASC NULLS LAST,
            price_difference ASC NULLS LAST
        LIMIT 10;
        """
        )
        result = uow.session.execute(query, {"wanted_ad_id": wanted_ad_id}).fetchall()
        ad_objects_list = []
        for r in result:
            dict_1 = {**r[0]["ad"]}
            # dict_1["user"] = {**r[0]["user"]}
            dict_1["city"] = {**r[0]["city"]}
            dict_1["district"] = {**r[0]["district"]} if r[0]["district"] else None
            dict_1["property"] = {**r[0]["property"]}
            ad_objects_list.append(PropertyAd(**dict_1))

        return set(ad_objects_list)

    @staticmethod
    @no_type_check
    def find_similar_wanted_ads_based_on_a_property_ad(property_ad_id: int, uow: UnitOfWork) -> list[PropertyWantedAd]:
        query = text(
            """
        WITH target_ad AS (
        SELECT
            ads.*,
            p.property_type AS ad_property_type,
            p.area AS ad_area
        FROM advertisement.property_ads ads
        LEFT JOIN shared.properties p ON ads.property_id = p.id
        WHERE ads.id = :property_ad_id
        ),
        wanted_ads_with_similarity AS (
        SELECT
            json_build_object('ad', wanted_ads.*,
                'user', null,
                'city',row_to_json(c)) AS ad,
        CASE WHEN wanted_ads.city_id = target_ad.city_id THEN 0 ELSE 1 END AS city_mismatch,
        CASE
        WHEN wanted_ads.districts IS NOT NULL AND
        array_length(wanted_ads.districts, 1) > 0 THEN
            CASE WHEN target_ad.district_id = ANY(wanted_ads.districts) THEN 0 ELSE 1 END
        ELSE 1
        END AS district_mismatch,
        CASE
        WHEN wanted_ads.property_type IS NOT NULL AND
        array_length(wanted_ads.property_type, 1) > 0 THEN
        CASE WHEN target_ad.ad_property_type = ANY(wanted_ads.property_type) THEN 0 ELSE 1 END
        ELSE 1
        END AS property_type_mismatch,
        CASE
        WHEN wanted_ads.min_size IS NOT NULL AND
        wanted_ads.min_size > 0 AND target_ad.ad_area IS NOT NULL THEN
            GREATEST(0, (wanted_ads.min_size - target_ad.ad_area)::numeric / wanted_ads.min_size)
        ELSE 1
        END AS min_size_difference,
        CASE
        WHEN wanted_ads.type = target_ad.type THEN
        CASE
        WHEN wanted_ads.type = 'FOR_RENT' THEN
        (
        CASE WHEN wanted_ads.max_deposit IS NOT NULL AND
        wanted_ads.max_deposit > 0 AND target_ad.deposit_amount IS NOT NULL THEN
        GREATEST(0, (target_ad.deposit_amount - wanted_ads.max_deposit)::numeric / wanted_ads.max_deposit)
        ELSE 1 END
        +
        CASE WHEN wanted_ads.max_rent IS NOT NULL AND
        wanted_ads.max_rent > 0 AND target_ad.rent_amount IS NOT NULL THEN
            GREATEST(0, (target_ad.rent_amount - wanted_ads.max_rent)::numeric / wanted_ads.max_rent)
        ELSE 1 END
        ) / 2
        WHEN wanted_ads.type = 'FOR_SALE' THEN
        CASE WHEN wanted_ads.sale_price IS NOT NULL AND
        wanted_ads.sale_price > 0 AND target_ad.sale_price IS NOT NULL THEN
        GREATEST(0, (target_ad.sale_price - wanted_ads.sale_price)::numeric / wanted_ads.sale_price)
        ELSE 1 END
        ELSE
        1
        END
        ELSE
        1
        END AS price_difference
        FROM advertisement.property_wanted_ads wanted_ads
        LEFT JOIN shared.cities c ON wanted_ads.city_id = c.id
        LEFT JOIN shared.districts d ON d.id  = ANY(wanted_ads.districts)
        CROSS JOIN target_ad
        WHERE wanted_ads.status = 'PUBLISHED' AND wanted_ads.deleted_at is NULL
        )
        SELECT
            wanted_ads_with_similarity.ad
        FROM wanted_ads_with_similarity
        ORDER BY
            city_mismatch ASC,
            district_mismatch ASC,
            property_type_mismatch ASC,
            min_size_difference ASC NULLS LAST,
            price_difference ASC NULLS LAST
        LIMIT 10;
        """
        )
        result = uow.session.execute(query, {"property_ad_id": property_ad_id}).fetchall()
        ad_objects_list = []
        for r in result:
            dict_1 = {**r[0]["ad"]}
            dict_1["city"] = {**r[0]["city"]}
            ad_objects_list.append(PropertyWantedAd(**dict_1))

        return set(ad_objects_list)
