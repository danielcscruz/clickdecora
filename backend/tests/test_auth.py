import pytest
import pytest_asyncio
from httpx import AsyncClient

from app.services.auth import create_access_token, decode_token, hash_password, verify_password


def test_password_hash_verify():
    password = "secure_password_123"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_create_and_decode_token():
    token = create_access_token(subject=42, role="client")
    payload = decode_token(token)
    assert payload["sub"] == "42"
    assert payload["role"] == "client"


def test_decode_invalid_token():
    payload = decode_token("not.a.valid.token")
    assert payload == {}


@pytest.mark.asyncio
async def test_register(client: AsyncClient):
    resp = await client.post(
        "/auth/register",
        json={"name": "João Silva", "email": "joao@test.com", "password": "senha123"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {"name": "Dup User", "email": "dup@test.com", "password": "senha123"}
    await client.post("/auth/register", json=payload)
    resp = await client.post("/auth/register", json=payload)
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_login(client: AsyncClient):
    await client.post(
        "/auth/register",
        json={"name": "Login User", "email": "login@test.com", "password": "senha123"},
    )
    resp = await client.post(
        "/auth/login",
        json={"email": "login@test.com", "password": "senha123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post(
        "/auth/register",
        json={"name": "Wrong Pass", "email": "wrongpass@test.com", "password": "senha123"},
    )
    resp = await client.post(
        "/auth/login",
        json={"email": "wrongpass@test.com", "password": "wrong"},
    )
    assert resp.status_code == 401
