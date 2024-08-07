from datetime import datetime, timedelta
from typing import Optional
import jwt  # pyjwt
from passlib.context import CryptContext
from src.core.config import settings

# Set up the password context with Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a password using Argon2."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password using Argon2."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None, created_at: datetime = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)  # Default expiration time
    to_encode.update({"exp": expire})
    if created_at:
        to_encode.update({"created": created_at.timestamp()})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode a JWT access token."""
    try:
        decoded_jwt = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.PyJWTError as e:
        raise ValueError("Error decoding JWT") from e
    return decoded_jwt
