from typing import Dict
from src.schemas.user import UserCreate, User
from src.core.security import get_password_hash

fake_users_db: Dict[str, User] = {}

def create_user(user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, id=len(fake_users_db)+1)
    fake_users_db[user.email] = new_user
    return new_user

def get_user_by_username(username: str) -> User:
    for user in fake_users_db.values():
        if user.username == username:
            return user
    return None
