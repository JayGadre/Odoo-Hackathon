from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicTrack"
    API_PREFIX: str = "/api/v1"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
