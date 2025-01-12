"""Интеграция с Sentry для мониторинга ошибок."""

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

from app.config import get_settings


def init_sentry() -> None:
    """
    Инициализация Sentry SDK.

    Если SENTRY_DSN не задан в переменных окружения,
    инициализация пропускается (для локальной разработки).
    """
    settings = get_settings()

    if not settings.sentry_dsn:
        return

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
        # Процент запросов для трейсинга производительности (20%)
        traces_sample_rate=0.2,
        # Отправлять информацию о пользователе (если есть)
        send_default_pii=False,
    )
