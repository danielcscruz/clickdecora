import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.database import Base, get_db
from app.main import app
from app.models.plan import Plan
from app.models.user import User, UserRole
from app.services.auth import hash_password

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def db(engine):
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(db):
    async def override_db():
        yield db

    app.dependency_overrides[get_db] = override_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def test_plan(db: AsyncSession):
    plan = Plan(
        name="Essencial",
        slug="essencial",
        price_brl=497.00,
        description="Test plan",
        features_json=["Feature 1"],
    )
    db.add(plan)
    await db.flush()
    await db.refresh(plan)
    return plan


@pytest_asyncio.fixture
async def test_user(db: AsyncSession):
    user = User(
        name="Test User",
        email="test@clickdecora.com",
        password_hash=hash_password("password123"),
        role=UserRole.client,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user
