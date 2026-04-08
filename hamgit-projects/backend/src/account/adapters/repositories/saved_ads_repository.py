import abc
from typing import Type

from sqlalchemy import text

from account.domain.entities import SavedAds
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class SavedAdsRepository(AbstractRepository[SavedAds], abc.ABC):

    @abc.abstractmethod
    def get_user_saved_ads(self, user_id: int) -> list[SavedAds]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_user_saved_ad(self, ad_id: int, user_id: int) -> SavedAds | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_user_saved_ads_with_details(self, user_id: int) -> list[SavedAds]:
        raise NotImplementedError


class SQLAlchemySavedAdsRepository(AbstractSQLAlchemyRepository[SavedAds], SavedAdsRepository):

    @property
    def entity_type(self) -> Type[SavedAds]:
        return SavedAds

    def get_user_saved_ads(self, user_id: int) -> list[SavedAds]:
        return self.query.filter_by(user_id=user_id, deleted_at=None).all()

    def get_user_saved_ad(self, ad_id: int, user_id: int) -> SavedAds | None:
        return self.query.filter_by(ad_id=ad_id, user_id=user_id, deleted_at=None).one_or_none()

    def get_user_saved_ads_with_details(self, user_id: int) -> list[SavedAds]:
        base_query = """
        SELECT
            sa.*,
            CASE
                WHEN sa.ad_type = 'AD' THEN
                    json_build_object(
                        'AD',
                        json_build_object(
                            'ad_data', row_to_json(a),
                            'user', row_to_json(u),
                            'city', row_to_json(c),
                            'district', row_to_json(d),
                            'property', row_to_json(p)
                        )
                    )
                WHEN sa.ad_type = 'SWAP_AD' THEN
                    json_build_object(
                        'SWAP_AD',
                        json_build_object(
                            'ad_data', row_to_json(swa),
                            'user', row_to_json(su)
                        )
                    )
                WHEN sa.ad_type = 'WANTED_AD' THEN
                    json_build_object(
                        'WANTED_AD',
                        row_to_json(wa)
                    )
                ELSE NULL
            END AS ad_data
        FROM account.saved_ads sa
        LEFT JOIN advertisement.property_ads a ON sa.ad_type = 'AD' AND a.id = sa.ad_id
        LEFT JOIN account.users u ON u.id = a.user_id
        LEFT JOIN shared.cities c ON c.id = a.city_id
        LEFT JOIN shared.districts d ON d.id = a.district_id
        LEFT JOIN shared.properties p ON p.id = a.property_id
        LEFT JOIN advertisement.swap_ads swa ON sa.ad_type = 'SWAP_AD' AND swa.id = sa.ad_id
        LEFT JOIN account.users su ON su.id = swa.user_id
        LEFT JOIN advertisement.property_wanted_ads wa ON sa.ad_type = 'WANTED_AD' AND wa.id = sa.ad_id
        WHERE sa.user_id = :user_id AND sa.deleted_at IS NULL
        ORDER BY sa.created_at DESC;
        """
        params = {"user_id": user_id}
        query = text(base_query).bindparams(**params)
        result = self.session.execute(query).fetchall()

        return [SavedAds(*row) for row in result]
