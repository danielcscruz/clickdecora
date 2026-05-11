from pydantic import BaseModel


class PlanOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str
    slug: str
    price_brl: float
    description: str
    features_json: list[str]
