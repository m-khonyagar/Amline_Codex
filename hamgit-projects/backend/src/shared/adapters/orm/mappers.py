from sqlalchemy.orm import relationship

from core.database import SQLALCHEMY_READONLY_REGISTRY, SQLALCHEMY_REGISTRY
from shared.adapters.orm import data_models, read_only_models
from shared.domain import entities


def start_mappers():
    SQLALCHEMY_REGISTRY.map_imperatively(entities.Property, data_models.properties)
    SQLALCHEMY_REGISTRY.map_imperatively(
        entities.City,
        data_models.cities,
        properties={
            "province": relationship(
                "Province",
                primaryjoin="Province.id == City.province_id",
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(entities.Province, data_models.provinces)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.District, data_models.districts)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.File, data_models.files)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.EntityChangeLog, data_models.entity_change_logs)

    start_read_only_mappers()


def start_read_only_mappers():
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(read_only_models.ProvinceROM, read_only_models.provinces_rom)
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.CityROM,
        read_only_models.cities_rom,
        properties={"province": relationship(read_only_models.ProvinceROM)},
    )
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.PropertyROM,
        read_only_models.properties_rom,
        properties={"city": relationship(read_only_models.CityROM)},
    )
