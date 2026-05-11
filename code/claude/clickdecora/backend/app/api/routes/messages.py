from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.message import Message
from app.models.purchase import Purchase, PurchaseStatus
from app.models.user import User
from app.schemas.message import MessageCreate, MessageOut

router = APIRouter(prefix="/messages", tags=["messages"])


async def _get_purchase_for_user(protocol: str, user: User, db: AsyncSession) -> Purchase:
    result = await db.execute(
        select(Purchase).where(Purchase.protocol == protocol)
    )
    purchase = result.scalar_one_or_none()
    if not purchase:
        raise HTTPException(status_code=404, detail="Protocolo não encontrado")
    if purchase.user_id != user.id and user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    if purchase.status == PurchaseStatus.pending:
        raise HTTPException(status_code=402, detail="Pagamento pendente")
    return purchase


@router.get("/{protocol}", response_model=list[MessageOut])
async def get_messages(
    protocol: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    purchase = await _get_purchase_for_user(protocol, current_user, db)
    offset = (page - 1) * page_size

    result = await db.execute(
        select(Message)
        .where(Message.purchase_id == purchase.id)
        .options(selectinload(Message.sender))
        .order_by(Message.created_at.asc())
        .offset(offset)
        .limit(page_size)
    )
    messages = result.scalars().all()
    return [MessageOut.from_orm_with_sender(m) for m in messages]


@router.post("/{protocol}", response_model=MessageOut, status_code=201)
async def post_message(
    protocol: str,
    body: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    purchase = await _get_purchase_for_user(protocol, current_user, db)

    msg = Message(
        purchase_id=purchase.id,
        sender_id=current_user.id,
        content=body.content.strip(),
        file_url=body.file_url,
    )
    db.add(msg)
    await db.flush()
    await db.refresh(msg)

    result = await db.execute(
        select(Message)
        .where(Message.id == msg.id)
        .options(selectinload(Message.sender))
    )
    full_msg = result.scalar_one()
    return MessageOut.from_orm_with_sender(full_msg)
