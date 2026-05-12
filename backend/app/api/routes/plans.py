from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.plan import Plan
from app.schemas.plan import PlanOut

router = APIRouter(prefix="/plans", tags=["plans"])


@router.get("/", response_model=list[PlanOut])
async def list_plans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plan).order_by(Plan.id))
    return result.scalars().all()
