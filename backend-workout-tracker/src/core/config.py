import os


class Settings:
    PROJECT_NAME: str = "Workout Tracker"
    API_VERSION: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()
