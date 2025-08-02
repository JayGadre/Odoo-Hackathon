from fastapi import FastAPI

from backend.src.api import auth
from backend.src.utils.config import settings

from backend.src.api import report_issue_api

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(report_issue_api.router, prefix=f"{settings.API_PREFIX}/issues", tags=["issues"])
