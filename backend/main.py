from backend.src.utils.config import settings
from backend.src.api import auth
from backend.src.api import report_issue_api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Allow requests from any origin (during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production, e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods: GET, POST, PUT, etc.
    allow_headers=["*"],  # Allows all headers
)

# Routes
#app.include_router(auth.router, prefix="/auth", tags=["auth"])

app.include_router(report_issue_api.router, prefix="/report", tags=["report"])
