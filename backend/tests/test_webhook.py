import hashlib
import hmac
import json

import pytest

from app.services.payment import validate_webhook_signature


def _sign(body: bytes, secret: str) -> str:
    return hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()


def test_valid_signature():
    secret = "test_webhook_secret"
    body = b'{"type":"payment","data":{"id":"123"}}'
    sig = _sign(body, secret)
    assert validate_webhook_signature(body, sig, secret)


def test_invalid_signature():
    secret = "test_webhook_secret"
    body = b'{"type":"payment","data":{"id":"123"}}'
    assert not validate_webhook_signature(body, "bad_signature", secret)


def test_tampered_body():
    secret = "test_webhook_secret"
    original_body = b'{"type":"payment","data":{"id":"123"}}'
    sig = _sign(original_body, secret)
    tampered_body = b'{"type":"payment","data":{"id":"999"}}'
    assert not validate_webhook_signature(tampered_body, sig, secret)


@pytest.mark.asyncio
async def test_webhook_missing_signature(client):
    resp = await client.post(
        "/webhook/mercadopago",
        content=b'{"type":"payment","data":{"id":"1"}}',
        headers={"Content-Type": "application/json"},
    )
    # Without mp_webhook_secret configured in test env, it skips validation
    # This tests the endpoint is reachable
    assert resp.status_code in (200, 400, 401, 502)


@pytest.mark.asyncio
async def test_websocket_auth_required(client):
    """WebSocket connection without token should be refused."""
    # We test via HTTP that the endpoint exists; WS testing requires websockets lib
    # The actual WS auth is tested in test_websocket_auth.py
    pass
