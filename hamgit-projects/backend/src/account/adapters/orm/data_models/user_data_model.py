import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

users = sa.Table(
    "users",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("mobile", sa.String, nullable=False, index=True, unique=True),
    sa.Column("roles", sa.ARRAY(sa.String)),
    sa.Column("national_code", sa.String, index=True),
    sa.Column("first_name", sa.String),
    sa.Column("last_name", sa.String),
    sa.Column("father_name", sa.String),
    sa.Column("birth_date", sa.Date),
    sa.Column("is_verified", sa.Boolean, default=False),
    sa.Column("gender", sa.String),
    sa.Column("nick_name", sa.String),
    sa.Column("postal_code", sa.String),
    sa.Column("email", sa.String),
    sa.Column("address", sa.Text),
    sa.Column("eitaa_user_id", sa.String),
    sa.Column("avatar_file_id", sa.BigInteger, sa.ForeignKey("shared.files_.id")),
    sa.Column("default_city_id", sa.BigInteger, sa.ForeignKey("shared.cities.id")),
    sa.Column("is_active", sa.Boolean, default=True),
    sa.Column("label_ids", sa.ARRAY(sa.BigInteger)),
    sa.Column("last_login", sa.DateTime(timezone=True)),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="account",
)
