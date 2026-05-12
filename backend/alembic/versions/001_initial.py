"""initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column(
            "role",
            sa.Enum("client", "admin", name="userrole"),
            nullable=False,
            server_default="client",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_id", "users", ["id"])

    op.create_table(
        "plans",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("slug", sa.String(50), nullable=False),
        sa.Column("price_brl", sa.Numeric(10, 2), nullable=False),
        sa.Column("description", sa.String(500), nullable=False),
        sa.Column("features_json", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_plans_id", "plans", ["id"])
    op.create_index("ix_plans_slug", "plans", ["slug"], unique=True)

    op.create_table(
        "purchases",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("plan_id", sa.Integer(), nullable=False),
        sa.Column("protocol", sa.String(20), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "pending",
                "paid",
                "in_progress",
                "delivered",
                "cancelled",
                name="purchasestatus",
            ),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("mp_payment_id", sa.String(100), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["plan_id"], ["plans.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_purchases_id", "purchases", ["id"])
    op.create_index("ix_purchases_protocol", "purchases", ["protocol"], unique=True)
    op.create_index("ix_purchases_user_id", "purchases", ["user_id"])

    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("purchase_id", sa.Integer(), nullable=False),
        sa.Column("sender_id", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("file_url", sa.String(500), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["purchase_id"], ["purchases.id"]),
        sa.ForeignKeyConstraint(["sender_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_messages_id", "messages", ["id"])
    op.create_index("ix_messages_purchase_id", "messages", ["purchase_id"])

    op.create_table(
        "appointments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("purchase_id", sa.Integer(), nullable=False),
        sa.Column("calendly_event_uri", sa.String(500), nullable=False),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["purchase_id"], ["purchases.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_appointments_id", "appointments", ["id"])
    op.create_index("ix_appointments_purchase_id", "appointments", ["purchase_id"])

    # Seed plans
    op.execute(
        """
        INSERT INTO plans (name, slug, price_brl, description, features_json) VALUES
        ('Essencial', 'essencial', 497.00,
         'Perfeito para transformar um ambiente com praticidade e estilo.',
         '["1 ambiente", "Entrega em 7 dias úteis", "Projeto 2D completo", "Lista de compras", "Consultoria via chat"]'::json),
        ('Conforto', 'conforto', 897.00,
         'Ideal para quem deseja renovar mais de um espaço com harmonia.',
         '["Até 3 ambientes", "Entrega em 14 dias úteis", "Projeto 2D + Moodboard", "Lista de compras", "Consultoria via Meet", "2 revisões"]'::json),
        ('Exclusivo', 'exclusivo', 1497.00,
         'Transformação completa do seu lar com acompanhamento total.',
         '["Ambientes ilimitados", "Projeto 3D completo", "Acompanhamento dedicado", "Lista de compras premium", "Reuniões ilimitadas", "Revisões ilimitadas", "Suporte pós-entrega 30 dias"]'::json)
        """
    )


def downgrade() -> None:
    op.drop_table("appointments")
    op.drop_table("messages")
    op.drop_table("purchases")
    op.drop_table("plans")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS purchasestatus")
    op.execute("DROP TYPE IF EXISTS userrole")
