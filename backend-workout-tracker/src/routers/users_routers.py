from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from typing import List

import jwt
from src.schemas.user_schema import UserCreate, User
from src.schemas.dashbaord_schema import DashboardData
from src.services.user_service import create_user, get_user_by_username, add_token_to_user, invalidate_token_for_user, get_all_users, get_user_id_from_token
from src.core.security import create_access_token, verify_password, decode_access_token
from src.core.config import settings

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/token")


@router.post("/register_user/", response_model=User)
async def register_user(user: UserCreate):
    # Check if username is already registered
    db_user = await get_user_by_username(user.username)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")

    # Validate password strength
    if len(user.password) < 8:
        raise HTTPException(
            status_code=400, detail="Password must be at least 8 characters long")
    if not any(char.isdigit() for char in user.password):
        raise HTTPException(
            status_code=400, detail="Password must contain at least one digit")
    if not any(char.isupper() for char in user.password):
        raise HTTPException(
            status_code=400, detail="Password must contain at least one uppercase letter")

    # Create the new user
    new_user = await create_user(user)
    return new_user


@router.post("/token", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_by_username(form_data.username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_create_at = datetime.now()
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires, created_at=access_token_create_at)
    await add_token_to_user(user.id, access_token, access_token_expires, access_token_create_at)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout", response_model=dict)
async def logout(token: str = Depends(oauth2_scheme)):
    user_data = decode_access_token(token=token)

    # Get the User object
    user = await get_user_by_username(username=user_data.get("sub"))

    if user:
        # Pass user.id to invalidate token
        await invalidate_token_for_user(user.id, token)
        return {"msg": "Successfully logged out"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.get("/all_users", response_model=List[User])
async def all_users():
    users = await get_all_users()
    return users


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_access_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = await get_user_by_username(username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not validate credentials")


@router.get("/dashboard", response_model=dict)
async def read_dashboard_data(current_user: User = Depends(get_current_user)):
    # Return the username directly for simplicity
    print("CURRENT USER", current_user)
    return {"username": current_user.username}
