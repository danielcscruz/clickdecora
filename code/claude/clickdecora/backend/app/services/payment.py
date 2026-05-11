import hashlib
import hmac

import httpx

from app.config import settings


async def create_mp_preference(
    protocol: str,
    plan_name: str,
    price: float,
    user_email: str,
    notification_url: str,
    back_url: str,
) -> dict:
    payload = {
        "items": [
            {
                "title": f"Click Decora — {plan_name}",
                "quantity": 1,
                "unit_price": float(price),
                "currency_id": "BRL",
            }
        ],
        "payer": {"email": user_email},
        "external_reference": protocol,
        "notification_url": notification_url,
        "back_urls": {
            "success": f"{back_url}/dashboard?payment=success",
            "failure": f"{back_url}/dashboard?payment=failure",
            "pending": f"{back_url}/dashboard?payment=pending",
        },
        "statement_descriptor": "CLICKDECORA",
        "payment_methods": {
            "excluded_payment_types": [],
            "installments": 1,
        },
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.mercadopago.com/checkout/preferences",
            json=payload,
            headers={
                "Authorization": f"Bearer {settings.mp_access_token}",
                "Content-Type": "application/json",
            },
            timeout=15,
        )
        if not resp.is_success:
            raise httpx.HTTPStatusError(
                f"{resp.status_code}: {resp.text}",
                request=resp.request,
                response=resp,
            )
        return resp.json()


def validate_webhook_signature(
    raw_body: bytes,
    received_signature: str,
    secret: str,
) -> bool:
    """Validate Mercado Pago HMAC-SHA256 webhook signature."""
    expected = hmac.new(
        secret.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, received_signature)
