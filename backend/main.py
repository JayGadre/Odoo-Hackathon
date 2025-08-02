from backend.src.utils.config import settings
from backend.src.api import auth, report_issue_api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sessions for Google OAuth
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# Welcome route
@app.get("/")
def read_root():
    return {"message": "Welcome to CivicTrack API. Go to /docs for Swagger UI."}

# Routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(report_issue_api.router, prefix="/report", tags=["report"])
