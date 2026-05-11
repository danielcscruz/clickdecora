import logging

from fastapi import APIRouter, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.purchase import Purchase, PurchaseStatus
from app.services.payment import validate_webhook_signature

router = APIRouter(prefix="/webhook", tags=["webhook"])
logger = logging.getLogger(__name__)


@router.post("/mercadopago")
async def mercadopago_webhook(
    request: Request,
    x_signature: str = Header(None, alias="x-signature"),
):
    raw_body = await request.body()

    if settings.mp_webhook_secret:
        if not x_signature:
            raise HTTPException(status_code=400, detail="Assinatura ausente")
        if not validate_webhook_signature(raw_body, x_signature, settings.mp_webhook_secret):
            logger.warning("Webhook MP: assinatura inválida")
            raise HTTPException(status_code=401, detail="Assinatura inválida")

    payload = await request.json()
    event_type = payload.get("type")

    if event_type != "payment":
        return {"ok": True, "skipped": True}

    payment_data = payload.get("data", {})
    payment_id = str(payment_data.get("id", ""))

    if not payment_id:
        return {"ok": True}

    # Fetch payment details from MP API to get external_reference
    import httpx

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://api.mercadopago.com/v1/payments/{payment_id}",
            headers={"Authorization": f"Bearer {settings.mp_access_token}"},
            timeout=10,
        )
        if resp.status_code != 200:
            logger.error("MP payment fetch failed: %s", resp.text)
            raise HTTPException(status_code=502, detail="Erro ao consultar pagamento")
        mp_payment = resp.json()

    external_ref = mp_payment.get("external_reference")
    payment_status = mp_payment.get("status")

    if not external_ref:
        return {"ok": True}

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Purchase).where(Purchase.protocol == external_ref)
        )
        purchase = result.scalar_one_or_none()
        if not purchase:
            logger.warning("Webhook MP: protocolo não encontrado %s", external_ref)
            return {"ok": True}

        if payment_status == "approved":
            purchase.status = PurchaseStatus.paid
            purchase.mp_payment_id = payment_id
            await db.commit()
            logger.info("Pagamento aprovado para protocolo %s", external_ref)
        elif payment_status in ("cancelled", "rejected", "charged_back"):
            purchase.status = PurchaseStatus.cancelled
            await db.commit()

    return {"ok": True}
