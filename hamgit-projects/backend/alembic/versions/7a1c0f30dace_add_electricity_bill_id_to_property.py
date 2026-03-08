"""add electricity_bill_id to peroperty

Revision ID: 7a1c0f30dace
Revises: 2471510debda
Create Date: 2025-02-07 16:24:26.304753

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7a1c0f30dace'
down_revision: Union[str, None] = '2471510debda'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('properties', sa.Column('electricity_bill_id', sa.String(length=50), nullable=True), schema='shared')


def downgrade() -> None:
    op.drop_column('properties', 'electricity_bill_id', schema='shared')

