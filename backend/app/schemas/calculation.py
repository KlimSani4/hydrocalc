from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class Season(str, Enum):
    """Сезон года для расчёта."""
    cold = "cold"
    warm = "warm"


class Activity(str, Enum):
    """Тип активности для расчёта."""
    normal = "normal"
    sport = "sport"
    trip = "trip"


class CalculationRequest(BaseModel):
    """Схема запроса на расчёт потребления воды."""
    junior_count: int = Field(ge=0, default=0, description="Дети 7-10 лет")
    middle_count: int = Field(ge=0, default=0, description="Подростки 11-14 лет")
    senior_count: int = Field(ge=0, default=0, description="Старшеклассники 15-17 лет")
    staff_count: int = Field(ge=0, default=0, description="Персонал 18+ лет")
    season: Season = Field(description="Сезон: cold или warm")
    activity: Activity = Field(description="Активность: normal, sport или trip")


class CategoryBreakdown(BaseModel):
    """Детализация расчёта по категории."""
    count: int
    norm: float
    subtotal: float


class Breakdown(BaseModel):
    """Детализация расчёта по всем категориям."""
    junior: CategoryBreakdown
    middle: CategoryBreakdown
    senior: CategoryBreakdown
    staff: CategoryBreakdown


class Coefficients(BaseModel):
    """Применённые коэффициенты."""
    season: float
    activity: float


class CalculationResponse(BaseModel):
    """Схема ответа с результатом расчёта."""
    total_water: float = Field(description="Итоговое потребление воды в литрах")
    base_total: float = Field(description="Базовое потребление без коэффициентов")
    breakdown: Breakdown = Field(description="Детализация по категориям")
    coefficients: Coefficients = Field(description="Применённые коэффициенты")
    total_people: int = Field(description="Общее количество людей")


class CalculationParams(BaseModel):
    """Параметры расчёта для истории."""
    junior_count: int
    middle_count: int
    senior_count: int
    staff_count: int
    season: str
    activity: str


class CalculationHistoryItem(BaseModel):
    """Элемент истории расчётов (краткая версия)."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    total_water: float
    created_at: datetime
    params: CalculationParams


class CalculationDetail(BaseModel):
    """Полная информация о расчёте."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    total_water: float
    created_at: datetime
    params: CalculationParams
    breakdown: Breakdown
    coefficients: Coefficients
    total_people: int
