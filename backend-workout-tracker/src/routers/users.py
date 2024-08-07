from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List
from src.schemas.user import UserCreate, User
from src.services.user_service import create_user, get_user_by_username, add_token_to_user, invalidate_token_for_user
from src.core.security import create_access_token, verify_password
from src.core.config import settings

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/token")


@router.post("/register_user/", response_model=User)
async def register_user(user: UserCreate):
    db_user = await get_user_by_username(user.username)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")
    new_user = await create_user(user)
    return new_user


@router.post("/token", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token, expires_at = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    await add_token_to_user(user.id, access_token, expires_at)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout", response_model=dict)
async def logout(token: str = Depends(oauth2_scheme)):
    user_id = get_user_id_from_token(token)
    if user_id:
        await invalidate_token_for_user(user_id, token)
        return {"msg": "Successfully logged out"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_user_id_from_token(token: str):
    """Extract the user ID from the token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except jwt.JWTError:
        return None
