from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IssueCreate(BaseModel):
    user_id: int
    title: str
    description: str
    category: str
    latitude: float
    longitude: float

class IssueOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    category: str
    latitude: float
    longitude: float
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
