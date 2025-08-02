from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PhotoOut(BaseModel):
    id: int
    photo_url: str

    class Config:
        from_attributes = True

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
    photos: List[PhotoOut] = []

    class Config:
        from_attributes = True
