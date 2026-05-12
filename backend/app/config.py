from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env from project root regardless of working directory
_ROOT_ENV = Path(__file__).resolve().parent.parent.parent / ".env"
_LOCAL_ENV = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(_ROOT_ENV, _LOCAL_ENV, ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    secret_key: str

    @property
    def async_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24h
    refresh_token_expire_days: int = 30

    mp_access_token: str = ""
    mp_webhook_secret: str = ""
    mp_notification_url: str = ""  # ngrok or production URL for MP webhooks
    frontend_url: str = "http://localhost:3000"

    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
