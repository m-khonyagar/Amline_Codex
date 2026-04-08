from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from account.adapters.orm import data_models as account_models  # noqa
from alembic import context
from contract.adapters.orm import data_models as contract_models  # noqa
from core.database import SQLALCHEMY_REGISTRY
from core.settings import DATABASE_URL
from financial.adapters.orm import data_models as financial_models  # noqa
from shared.adapters.orm import data_models as shared_models  # noqa
from advertisement.adapters.orm import data_models as ad_models # noqa
from crm.adapters.orm import data_models as crm_models # noqa

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

config.set_main_option("sqlalchemy.url", DATABASE_URL)

target_metadata = SQLALCHEMY_REGISTRY.metadata


def run_migrations_offline() -> None:

    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            create_type=True,
            include_schemas=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
