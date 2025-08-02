from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from backend.src.utils.config import settings
from backend.src.api import auth

app = FastAPI(title=settings.PROJECT_NAME)

# Enable sessions for Google OAuth
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# Routes
app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
