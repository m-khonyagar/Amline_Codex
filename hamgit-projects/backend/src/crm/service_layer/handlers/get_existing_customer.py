from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.realtor_file import RealtorFile
from crm.domain.entities.tenant_file import TenantFile
from unit_of_work import UnitOfWork


def get_existing_customer_handler(mobile: str, uow: UnitOfWork):
    with uow:
        landlord_files: list[LandlordFile] = uow.session.query(LandlordFile).filter(LandlordFile.mobile == mobile).all()
        tenant_files: list[TenantFile] = uow.session.query(TenantFile).filter(TenantFile.mobile == mobile).all()
        realtor_files: list[RealtorFile] = uow.session.query(RealtorFile).filter(RealtorFile.mobile == mobile).all()

        files = []

        files.extend(
            [
                dict(
                    id=str(file.id),
                    full_name=file.full_name,
                    type=file.__class__.__name__,
                    listing_type=file.listing_type,
                )
                for file in landlord_files
            ]
        )
        files.extend(
            [
                dict(
                    id=str(file.id),
                    full_name=file.full_name,
                    type=file.__class__.__name__,
                    listing_type=file.listing_type,
                )
                for file in tenant_files
            ]
        )
        files.extend(
            [
                dict(
                    id=str(file.id),
                    full_name=file.full_name,
                    type=file.__class__.__name__,
                )
                for file in realtor_files
            ]
        )

        return files
