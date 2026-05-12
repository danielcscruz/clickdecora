from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.plan import Plan
from app.models.purchase import Purchase
from app.models.user import User
from app.config import settings
from app.schemas.purchase import CheckoutResponse, PurchaseCreate, PurchaseOut
from app.services.payment import create_mp_preference
from app.services.protocol import generate_protocol

router = APIRouter(prefix="/purchases", tags=["purchases"])


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    request: Request,
    body: PurchaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = await db.get(Plan, body.plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plano não encontrado")

    protocol = generate_protocol()
    purchase = Purchase(
        user_id=current_user.id,
        plan_id=plan.id,
        protocol=protocol,
    )
    db.add(purchase)
    await db.flush()
    await db.refresh(purchase)

    notification_url = (
        settings.mp_notification_url
        or f"{str(request.base_url).rstrip('/')}/webhook/mercadopago"
    )
    back_url = settings.frontend_url

    preference = await create_mp_preference(
        protocol=protocol,
        plan_name=plan.name,
        price=float(plan.price_brl),
        user_email=current_user.email,
        notification_url=notification_url,
        back_url=back_url,
    )

    return CheckoutResponse(
        checkout_url=preference["init_point"],
        protocol=protocol,
    )


@router.get("/", response_model=list[PurchaseOut])
async def my_purchases(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Purchase)
        .where(Purchase.user_id == current_user.id)
        .order_by(Purchase.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{protocol}", response_model=PurchaseOut)
async def get_purchase(
    protocol: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Purchase).where(Purchase.protocol == protocol)
    )
    purchase = result.scalar_one_or_none()
    if not purchase:
        raise HTTPException(status_code=404, detail="Protocolo não encontrado")
    if purchase.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    return purchase
