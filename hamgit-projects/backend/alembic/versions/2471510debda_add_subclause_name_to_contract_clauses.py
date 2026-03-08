"""Add subclause_name to contract_clauses 

Revision ID: 2471510debda
Revises: fed9e61e07d5
Create Date: 2024-11-22 19:41:37.889439

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '2471510debda'
down_revision: Union[str, None] = 'fed9e61e07d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('contract_clauses', sa.Column('subclause_name', sa.String(), nullable=True), schema='contract')


def downgrade() -> None:
    op.drop_column('contract_clauses', 'subclause_name', schema='contract')
