from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP, Double
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.src.database.database import Base

# Users Table
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    issues = relationship("Issue", back_populates="user", cascade="all, delete", passive_deletes=True)

# Issues Table
class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False)
    latitude = Column(Double, nullable=False)
    longitude = Column(Double, nullable=False)
    status = Column(String(50), default="Reported")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="issues")
    photos = relationship("IssuePhoto", back_populates="issue", cascade="all, delete")
    logs = relationship("StatusLog", back_populates="issue", cascade="all, delete")
    flags = relationship("Flag", back_populates="issue", cascade="all, delete")

# Issue Photos Table
class IssuePhoto(Base):
    __tablename__ = "issue_photos"
    id = Column(Integer, primary_key=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    photo_url = Column(Text, nullable=False)

    issue = relationship("Issue", back_populates="photos")

# Status Logs Table
class StatusLog(Base):
    __tablename__ = "status_logs"
    id = Column(Integer, primary_key=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    old_status = Column(String(50))
    new_status = Column(String(50))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    issue = relationship("Issue", back_populates="logs")

# Flags Table
class Flag(Base):
    __tablename__ = "flags"
    id = Column(Integer, primary_key=True)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    flagged_at = Column(TIMESTAMP, server_default=func.now())

    issue = relationship("Issue", back_populates="flags")

# Banned Users Table
class BannedUser(Base):
    __tablename__ = "banned_users"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    reason = Column(Text)
    banned_at = Column(TIMESTAMP, server_default=func.now())
