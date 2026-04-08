from sqlalchemy.orm import relationship

from core.database import SQLALCHEMY_REGISTRY
from crm.adapters.orm.data_models.file_call_data_model import file_calls
from crm.adapters.orm.data_models.file_connection_data_model import file_connections
from crm.adapters.orm.data_models.file_label_data_model import file_labels
from crm.adapters.orm.data_models.file_source_data_model import file_sources
from crm.adapters.orm.data_models.file_status_data_model import file_statuses
from crm.adapters.orm.data_models.file_text_data_model import file_texts
from crm.adapters.orm.data_models.landlord_file_data_model import landlord_files
from crm.adapters.orm.data_models.realtor_file_data_model import realtor_files
from crm.adapters.orm.data_models.realtor_shared_file_data_model import (
    realtor_shared_files,
)
from crm.adapters.orm.data_models.task_data_model import tasks
from crm.adapters.orm.data_models.task_report_data_model import task_reports
from crm.adapters.orm.data_models.tenant_file_data_model import tenant_files
from crm.domain.entities.file_call import FileCall
from crm.domain.entities.file_connection import FileConnection
from crm.domain.entities.file_label import FileLabel
from crm.domain.entities.file_source import FileSource
from crm.domain.entities.file_status import FileStatus
from crm.domain.entities.file_text import FileText
from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.realtor_file import RealtorFile
from crm.domain.entities.realtor_shared_file import RealtorSharedFile
from crm.domain.entities.task import Task
from crm.domain.entities.task_report import TaskReport
from crm.domain.entities.tenant_file import TenantFile


def start_mappers():
    SQLALCHEMY_REGISTRY.map_imperatively(
        LandlordFile,
        landlord_files,
        properties={
            "file_source": relationship(
                "FileSource",
                primaryjoin="FileSource.id == LandlordFile.file_source_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "assigned_to_user": relationship(
                "User",
                primaryjoin="User.id == LandlordFile.assigned_to",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == LandlordFile.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "city": relationship(
                "City",
                primaryjoin="City.id == LandlordFile.city_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "district": relationship(
                "District",
                primaryjoin="District.id == LandlordFile.district_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        TenantFile,
        tenant_files,
        properties={
            "file_source": relationship(
                "FileSource",
                primaryjoin="FileSource.id == TenantFile.file_source_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "assigned_to_user": relationship(
                "User",
                primaryjoin="User.id == TenantFile.assigned_to",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == TenantFile.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "city": relationship(
                "City",
                primaryjoin="City.id == TenantFile.city_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        RealtorFile,
        realtor_files,
        properties={
            "file_source": relationship(
                "FileSource",
                primaryjoin="FileSource.id == RealtorFile.file_source_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "assigned_to_user": relationship(
                "User",
                primaryjoin="User.id == RealtorFile.assigned_to",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == RealtorFile.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "city": relationship(
                "City",
                primaryjoin="City.id == RealtorFile.city_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        Task,
        tasks,
        properties={
            "assigned_to_user": relationship(
                "User",
                primaryjoin="User.id == Task.assigned_to",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == Task.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        FileConnection,
        file_connections,
        properties={
            "landlord_file": relationship(
                "LandlordFile",
                primaryjoin="LandlordFile.id == FileConnection.landlord_file_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "tenant_file": relationship(
                "TenantFile",
                primaryjoin="TenantFile.id == FileConnection.tenant_file_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == FileConnection.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        TaskReport,
        task_reports,
        properties={
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == TaskReport.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        RealtorSharedFile,
        realtor_shared_files,
        properties={
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == RealtorSharedFile.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
            "realtor_file": relationship(
                "RealtorFile",
                primaryjoin="RealtorFile.id == RealtorSharedFile.realtor_file_id",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(FileSource, file_sources)
    SQLALCHEMY_REGISTRY.map_imperatively(FileStatus, file_statuses)
    SQLALCHEMY_REGISTRY.map_imperatively(FileCall, file_calls)
    SQLALCHEMY_REGISTRY.map_imperatively(FileText, file_texts)
    SQLALCHEMY_REGISTRY.map_imperatively(FileLabel, file_labels)
