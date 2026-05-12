import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PurchaseStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    in_progress = "in_progress"
    delivered = "delivered"
    cancelled = "cancelled"


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"))
    protocol: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    status: Mapped[PurchaseStatus] = mapped_column(
        Enum(PurchaseStatus), default=PurchaseStatus.pending
    )
    mp_payment_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="purchases")
    plan: Mapped["Plan"] = relationship(back_populates="purchases")
    messages: Mapped[list["Message"]] = relationship(back_populates="purchase")
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="purchase")
