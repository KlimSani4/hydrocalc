# Production Dockerfile для HydroCalc Backend
# Используем multi-stage build для уменьшения размера образа

# Этап 1: Сборка зависимостей
FROM python:3.11-slim as builder

WORKDIR /app

# Устанавливаем зависимости для сборки psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем и устанавливаем зависимости
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt


# Этап 2: Production образ
FROM python:3.11-slim

WORKDIR /app

# Устанавливаем только runtime зависимости для PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Создаем непривилегированного пользователя для безопасности
RUN useradd --create-home --shell /bin/bash appuser

# Копируем собранные wheel-пакеты и устанавливаем их
COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache-dir /wheels/* && rm -rf /wheels

# Копируем код приложения
COPY --chown=appuser:appuser . .

# Переключаемся на непривилегированного пользователя
USER appuser

# Порт приложения
EXPOSE 8000

# Переменные окружения по умолчанию
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ENVIRONMENT=production

# Healthcheck для проверки работоспособности
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Запуск через uvicorn с оптимальными настройками для production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
