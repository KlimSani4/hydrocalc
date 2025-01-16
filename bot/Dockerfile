FROM python:3.11-slim

WORKDIR /app

# Копируем зависимости
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY app/ ./app/

# Переменные окружения (переопределяются при запуске)
ENV BOT_TOKEN=""
ENV API_URL="http://backend:8000"
ENV PYTHONUNBUFFERED=1

# Запуск бота
CMD ["python", "-m", "app.main"]
