from sqlalchemy.orm import relationship

from account.adapters.orm import data_models, read_only_models
from account.domain import entities
from core.database import SQLALCHEMY_READONLY_REGISTRY, SQLALCHEMY_REGISTRY


def start_mappers():
    SQLALCHEMY_REGISTRY.map_imperatively(
        entities.User,
        data_models.users,
        properties={
            "wallet": relationship(
                "Wallet", primaryjoin="User.id == Wallet.user_id", viewonly=True, lazy="joined", uselist=False
            )
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(entities.SavedAds, data_models.saved_ads)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.RefreshToken, data_models.refresh_tokens)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.BankAccount, data_models.bank_accounts)
    SQLALCHEMY_REGISTRY.map_imperatively(
        entities.UserCall,
        data_models.user_calls,
        properties={
            "user": relationship(
                "User", primaryjoin="User.id == UserCall.user_id", viewonly=True, uselist=False, lazy="joined"
            ),
            "created_by_user": relationship(
                "User", primaryjoin="User.id == UserCall.created_by", viewonly=True, uselist=False, lazy="joined"
            ),
        },
    )

    SQLALCHEMY_REGISTRY.map_imperatively(
        entities.UserText,
        data_models.user_texts,
        properties={
            "user": relationship(
                "User", primaryjoin="User.id == UserText.user_id", viewonly=True, uselist=False, lazy="joined"
            ),
            "created_by_user": relationship(
                "User", primaryjoin="User.id == UserText.created_by", viewonly=True, uselist=False, lazy="joined"
            ),
        },
    )

    start_read_only_mappers()


def start_read_only_mappers():
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(read_only_models.UserROM, read_only_models.users_rom)
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.BankAccountROM,
        read_only_models.bank_accounts_rom,
        properties={"user": relationship(read_only_models.UserROM, lazy="joined")},
    )
