from fastapi import FastAPI
from backend.src.utils.config import settings
from backend.src.api import auth, report_issue_api
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from backend.src.database.database import Base, engine, SessionLocal
from backend.src.database import models
from backend.src.utils.security import get_password_hash

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

@app.on_event("startup")
def create_admin():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    admin_email = "admin@civictrack.com"
    admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not admin:
        db.add(models.User(
            name="Admin",
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            is_verified=True
        ))
        db.commit()
    db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to CivicTrack API. Go to /docs for API documentation."}

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(report_issue_api.router, prefix="/report", tags=["report"])
