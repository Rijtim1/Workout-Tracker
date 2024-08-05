from typing import Dict, List
from src.schemas.user import UserCreate, User
from src.core.security import get_password_hash

# Fake in-memory database to store users
fake_users_db: Dict[str, User] = {}

def create_user(user: UserCreate) -> User:
    """Create a new user and store it in the fake database."""
    # Hash the user's password
    hashed_password = get_password_hash(user.password)
    # Create a new User instance
    new_user = User(username=user.username, email=user.email, id=len(fake_users_db)+1, password_hash=hashed_password)
    # Store the new user in the fake database using email as the key
    fake_users_db[user.email] = new_user
    # Return the newly created user
    return new_user

def get_user_by_username(username: str) -> User:
    """Retrieve a user by their username."""
    # Search through the fake database for a user with the given username
    for user in fake_users_db.values():
        if user.username == username:
            return user
    # Return None if no user is found
    return None

def get_all_users() -> List[User]:
    """Retrieve all users from the fake database."""
    # Return a list of all User instances stored in the fake database
    return list(fake_users_db.values())
