from datetime import datetime

from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str
    file_url: str | None = None


class MessageOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    purchase_id: int
    sender_id: int
    content: str
    file_url: str | None
    created_at: datetime
    sender_name: str = ""

    @classmethod
    def from_orm_with_sender(cls, msg: object) -> "MessageOut":
        obj = cls.model_validate(msg)
        obj.sender_name = msg.sender.name if msg.sender else ""
        return obj
