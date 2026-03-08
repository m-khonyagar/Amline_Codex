from sqlalchemy import create_engine
from sqlalchemy.orm import registry, sessionmaker

from core.settings import DATABASE_URL, VOIP_DATABASE_URL

DATABASE_ENGINE = create_engine(url=DATABASE_URL, echo=False)

SESSION_FACTORY = sessionmaker(bind=DATABASE_ENGINE)

SQLALCHEMY_REGISTRY = registry()

SQLALCHEMY_READONLY_REGISTRY = registry()

VOIP_ENGINE = create_engine(url=VOIP_DATABASE_URL, echo=False)
VOIP_SESSION_FACTORY = sessionmaker(bind=VOIP_ENGINE)
