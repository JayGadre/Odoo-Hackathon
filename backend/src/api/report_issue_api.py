from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from src.api_management.report_issue_management.schemas import IssueCreate, IssueOut
from src.database import models
from src.database.database import get_db

router = APIRouter()

@router.post("/report-issue", response_model=IssueOut)
def report_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    new_issue = models.Issue(**issue.dict())
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    return new_issue

@router.get("/issues", response_model=List[IssueOut])
def get_issues(db: Session = Depends(get_db)):
    issues = db.query(models.Issue).options(
        joinedload(models.Issue.photos)
    ).order_by(models.Issue.created_at.desc()).all()
    return issues
