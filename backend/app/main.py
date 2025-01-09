from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth_router, calculate_router, history_router

app = FastAPI(
    title="HydroCalc API",
    description="API для расчёта потребления воды в школе",
    version="1.0.0"
)

# Настройка CORS для веб-клиента
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Подключение роутеров с префиксом /api/v1
app.include_router(auth_router, prefix="/api/v1")
app.include_router(calculate_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    """Проверка работоспособности сервиса."""
    return {"status": "ok"}


@app.get("/")
def root():
    """Корневой endpoint с информацией об API."""
    return {
        "name": "HydroCalc API",
        "version": "1.0.0",
        "docs": "/docs"
    }
