"""
Клиент для взаимодействия с Backend API.
"""
import aiohttp
from typing import Optional
from dataclasses import dataclass

from app.config import config


@dataclass
class CalculationResult:
    """Результат расчёта потребления воды."""

    total_liters: float
    breakdown: dict
    recommendations: Optional[str] = None


class ApiClient:
    """
    HTTP клиент для вызова Backend API.

    Использует aiohttp для асинхронных запросов к серверу расчёта.
    """

    def __init__(self):
        self.base_url = config.API_URL

    async def calculate_water(
        self,
        junior_count: int,
        middle_count: int,
        senior_count: int,
        staff_count: int,
        season: str,
        activity: str,
    ) -> Optional[CalculationResult]:
        """
        Отправляет запрос на расчёт нормы потребления воды.

        Args:
            junior_count: Количество младших школьников (7-10 лет).
            middle_count: Количество средних школьников (11-14 лет).
            senior_count: Количество старших школьников (15-17 лет).
            staff_count: Количество персонала (18+ лет).
            season: Сезон ('cold' или 'warm').
            activity: Тип активности ('normal', 'sports', 'hiking').

        Returns:
            CalculationResult при успехе, None при ошибке.
        """
        url = f"{self.base_url}/api/v1/calculate"

        payload = {
            "junior_count": junior_count,
            "middle_count": middle_count,
            "senior_count": senior_count,
            "staff_count": staff_count,
            "season": season,
            "activity": activity,
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return CalculationResult(
                            total_liters=data.get("total_liters", 0),
                            breakdown=data.get("breakdown", {}),
                            recommendations=data.get("recommendations"),
                        )
                    else:
                        return None
        except aiohttp.ClientError:
            return None


# Глобальный экземпляр клиента
api_client = ApiClient()
