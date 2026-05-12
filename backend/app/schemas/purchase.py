from datetime import datetime

from pydantic import BaseModel


class PurchaseCreate(BaseModel):
    plan_id: int


class PurchaseOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    protocol: str
    status: str
    plan_id: int
    created_at: datetime


class PurchaseDetail(PurchaseOut):
    plan: "PlanOut"


class CheckoutResponse(BaseModel):
    checkout_url: str
    protocol: str


from app.schemas.plan import PlanOut  # noqa: E402 — avoid circular at module level

PurchaseDetail.model_rebuild()
