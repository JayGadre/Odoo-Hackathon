from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.utils.config import settings
from src.api import auth, report_issue_api
from src.database.database import engine
from src.database import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(report_issue_api.router, prefix=f"{settings.API_PREFIX}/issues", tags=["issues"])

@app.get("/")
def read_root():
    return {"message": "Civic Issues API is running!"}
