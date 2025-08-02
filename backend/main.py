from fastapi import FastAPI
from backend.src.api import report_issue_api

app = FastAPI()
app.include_router(report_issue_api.router)
