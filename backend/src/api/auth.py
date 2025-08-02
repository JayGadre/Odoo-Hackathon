from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from backend.src.database.database import get_db
from backend.src.database.models import User
from backend.src.utils.security import get_password_hash, verify_password, create_access_token

router = APIRouter()


# LOCAL SIGNUP
@router.post("/signup")
def signup(name: str, email: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=name,
        email=email,
        hashed_password=get_password_hash(password),
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}



# LOCAL LOGIN
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, getattr(user, "hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}



# GOOGLE SIGNUP/LOGIN
@router.post("/google")
async def google_login(
    request: Request,
    client_id: str = Query(...),
    client_secret: str = Query(...),
    redirect_uri: str = Query(...)
):
    if not client_id or not client_secret or not redirect_uri:
        raise HTTPException(status_code=400, detail="Missing Google OAuth parameters")

    oauth = OAuth()
    oauth.register(
        name="google",
        client_id=client_id,
        client_secret=client_secret,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"}
    )

    request.session["google_creds"] = {
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri
    }

    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    creds = request.session.get("google_creds")
    if not creds:
        raise HTTPException(status_code=400, detail="Missing OAuth credentials")

    oauth = OAuth()
    oauth.register(
        name="google",
        client_id=creds["client_id"],
        client_secret=creds["client_secret"],
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"}
    )

    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(status_code=400, detail="Google login failed")

    email = user_info["email"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=user_info.get("name"),
            email=email,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": email})
    return {"access_token": access_token, "token_type": "bearer"}
