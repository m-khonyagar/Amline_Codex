from datetime import datetime, timedelta

import di
from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.domain.enums import AdStatus
from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.tenant_file import TenantFile
from crm.domain.enums import FileStatus
from unit_of_work import SQLAlchemyUnitOfWork

ARCHIVE_DAYS = 30


class ArchiveManager:

    @classmethod
    def archive_landlord_files(cls, uow: SQLAlchemyUnitOfWork):
        landlord_files = (
            uow.session.query(LandlordFile)
            .filter(
                LandlordFile.updated_at < datetime.now() - timedelta(days=ARCHIVE_DAYS),  # type: ignore
                LandlordFile.file_status != FileStatus.ARCHIVED,  # type: ignore
            )
            .all()
        )
        for landlord_file in landlord_files:
            landlord_file.file_status = FileStatus.ARCHIVED
        print(f"Archived {len(landlord_files)} landlord files")

    @classmethod
    def archive_tenant_files(cls, uow: SQLAlchemyUnitOfWork):
        tenant_files = (
            uow.session.query(TenantFile)
            .filter(
                TenantFile.updated_at < datetime.now() - timedelta(days=ARCHIVE_DAYS),  # type: ignore
                TenantFile.file_status != FileStatus.ARCHIVED,  # type: ignore
            )
            .all()
        )
        for tenant_file in tenant_files:
            tenant_file.file_status = FileStatus.ARCHIVED
        print(f"Archived {len(tenant_files)} tenant files")

    @classmethod
    def archive_property_ads(cls, uow: SQLAlchemyUnitOfWork):
        property_ads = (
            uow.session.query(PropertyAd)
            .filter(
                PropertyAd.updated_at < datetime.now() - timedelta(days=ARCHIVE_DAYS),  # type: ignore
                PropertyAd.status != AdStatus.ARCHIVED,  # type: ignore
            )
            .all()
        )
        for property_ad in property_ads:
            property_ad.status = AdStatus.ARCHIVED
        print(f"Archived {len(property_ads)} property ads")

    @classmethod
    def archive_property_wanted_ads(cls, uow: SQLAlchemyUnitOfWork):
        property_wanted_ads = (
            uow.session.query(PropertyWantedAd)
            .filter(
                PropertyWantedAd.updated_at < datetime.now() - timedelta(days=ARCHIVE_DAYS),  # type: ignore
                PropertyWantedAd.status != AdStatus.ARCHIVED,  # type: ignore
            )
            .all()
        )
        for property_wanted_ad in property_wanted_ads:
            property_wanted_ad.status = AdStatus.ARCHIVED
        print(f"Archived {len(property_wanted_ads)} property wanted ads")

    @classmethod
    def archive_old_files_and_ads(cls):
        uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
        with uow:
            cls.archive_landlord_files(uow)
            cls.archive_tenant_files(uow)
            cls.archive_property_ads(uow)
            cls.archive_property_wanted_ads(uow)
            uow.commit()
