"""Initial migration

Revision ID: 001_initial
Revises:
Create Date: 2025-01-07 10:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Создание таблицы users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Создание таблицы calculations
    op.create_table(
        'calculations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('junior_count', sa.Integer(), nullable=False),
        sa.Column('middle_count', sa.Integer(), nullable=False),
        sa.Column('senior_count', sa.Integer(), nullable=False),
        sa.Column('staff_count', sa.Integer(), nullable=False),
        sa.Column('season', sa.String(length=10), nullable=False),
        sa.Column('activity', sa.String(length=10), nullable=False),
        sa.Column('total_water', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('calculations')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
