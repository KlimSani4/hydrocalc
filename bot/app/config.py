"""
Конфигурация бота - загрузка переменных окружения.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Настройки приложения из переменных окружения."""

    BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")

    @classmethod
    def validate(cls) -> None:
        """Проверяет наличие обязательных переменных."""
        if not cls.BOT_TOKEN:
            raise ValueError("BOT_TOKEN не задан в переменных окружения")


config = Config()
