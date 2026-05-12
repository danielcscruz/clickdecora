from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_admin_user
from app.models.purchase import Purchase, PurchaseStatus
from app.models.user import User
from app.schemas.purchase import PurchaseOut

router = APIRouter(prefix="/admin", tags=["admin"])


class PurchaseAdminOut(PurchaseOut):
    user_name: str = ""
    user_email: str = ""


@router.get("/purchases", response_model=list[PurchaseAdminOut])
async def list_all_purchases(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    result = await db.execute(
        select(Purchase)
        .options(selectinload(Purchase.user), selectinload(Purchase.plan))
        .order_by(Purchase.created_at.desc())
    )
    purchases = result.scalars().all()
    output = []
    for p in purchases:
        item = PurchaseAdminOut.model_validate(p)
        item.user_name = p.user.name if p.user else ""
        item.user_email = p.user.email if p.user else ""
        output.append(item)
    return output


@router.patch("/purchases/{protocol}/status")
async def update_purchase_status(
    protocol: str,
    status: PurchaseStatus,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    result = await db.execute(
        select(Purchase).where(Purchase.protocol == protocol)
    )
    purchase = result.scalar_one_or_none()
    if not purchase:
        raise HTTPException(status_code=404, detail="Protocolo não encontrado")
    purchase.status = status
    await db.flush()
    return {"ok": True, "status": status}
