import logging

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import AsyncSessionLocal
from app.models.message import Message
from app.models.purchase import Purchase, PurchaseStatus
from app.services.auth import decode_token, get_user_by_id
from app.websocket.manager import manager

router = APIRouter()
logger = logging.getLogger(__name__)


@router.websocket("/ws/chat/{protocol}")
async def chat_endpoint(
    websocket: WebSocket,
    protocol: str,
    token: str = Query(...),
):
    # Authenticate via token in query string (WS cannot set headers easily)
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    async with AsyncSessionLocal() as db:
        user = await get_user_by_id(db, int(user_id))
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        result = await db.execute(
            select(Purchase).where(Purchase.protocol == protocol)
        )
        purchase = result.scalar_one_or_none()

        if not purchase:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        if purchase.user_id != user.id and user.role.value != "admin":
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        if purchase.status == PurchaseStatus.pending:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        purchase_id = purchase.id

    await manager.connect(protocol, websocket)
    logger.info("WS connected: user=%s protocol=%s", user_id, protocol)

    try:
        while True:
            data = await websocket.receive_json()
            content = (data.get("content") or "").strip()
            file_url = data.get("file_url")

            if not content and not file_url:
                continue

            async with AsyncSessionLocal() as db:
                msg = Message(
                    purchase_id=purchase_id,
                    sender_id=int(user_id),
                    content=content,
                    file_url=file_url,
                )
                db.add(msg)
                await db.flush()
                await db.refresh(msg)

                result = await db.execute(
                    select(Message)
                    .where(Message.id == msg.id)
                    .options(selectinload(Message.sender))
                )
                saved = result.scalar_one()

                broadcast_payload = {
                    "id": saved.id,
                    "purchase_id": saved.purchase_id,
                    "sender_id": saved.sender_id,
                    "sender_name": saved.sender.name,
                    "content": saved.content,
                    "file_url": saved.file_url,
                    "created_at": saved.created_at.isoformat(),
                }

            await manager.broadcast(protocol, broadcast_payload)

    except WebSocketDisconnect:
        await manager.disconnect(protocol, websocket)
        logger.info("WS disconnected: user=%s protocol=%s", user_id, protocol)
    except Exception as exc:
        logger.exception("WS error: %s", exc)
        await manager.disconnect(protocol, websocket)
