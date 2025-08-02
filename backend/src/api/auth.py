from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend.src.database.database import get_db
from backend.src.database.models import User
from backend.src.utils.security import get_password_hash, verify_password, create_access_token
from backend.src.utils.oauth import oauth
from backend.src.utils.config import settings

router = APIRouter()

# --- Local Signup ---
@router.post("/signup")
def signup(name: str, email: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(name=name, email=email, is_verified=True)
    user.hashed_password = get_password_hash(password)  # dynamically added column
    db.add(user)
    db.commit()
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# --- Local Login ---
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not hasattr(user, "hashed_password") or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# --- Google OAuth ---
@router.get("/google")
async def google_login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(status_code=400, detail="Google login failed")

    email = user_info["email"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(name=user_info.get("name"), email=email, is_verified=True)
        db.add(user)
        db.commit()

    access_token = create_access_token({"sub": email})
    return {"access_token": access_token, "token_type": "bearer"}
