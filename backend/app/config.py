from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Настройки приложения из переменных окружения."""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://hydrocalc:hydrocalc_dev@localhost:5432/hydrocalc"
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 часа

    # Sentry (опционально)
    sentry_dsn: str | None = None


@lru_cache
def get_settings() -> Settings:
    """Получить настройки (кэшируется)."""
    return Settings()
