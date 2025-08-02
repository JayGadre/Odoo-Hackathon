from fastapi import FastAPI
from backend.src.api import auth
from backend.src.utils.config import settings

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
