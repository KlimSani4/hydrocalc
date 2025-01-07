from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.calculation import Calculation
from app.schemas.calculation import (
    CalculationRequest,
    CalculationResponse,
    CategoryBreakdown,
    Breakdown,
    Coefficients
)


# Нормы потребления воды (литры/сутки на человека)
WATER_NORMS = {
    "junior": 1.6,   # 7-10 лет
    "middle": 1.85,  # 11-14 лет
    "senior": 2.15,  # 15-17 лет
    "staff": 2.25    # 18+ лет
}

# Коэффициенты сезона
SEASON_COEFFICIENTS = {
    "cold": 1.0,
    "warm": 1.3
}

# Коэффициенты активности
ACTIVITY_COEFFICIENTS = {
    "normal": 1.0,
    "sport": 1.5,
    "trip": 2.0
}


class CalculatorService:
    """Сервис расчёта потребления воды."""

    @staticmethod
    def calculate(request: CalculationRequest) -> CalculationResponse:
        """
        Рассчитывает потребление воды по формуле.

        Формула: V = SUM(Ni * Vi) * Ks * Ka
        где:
            Ni - количество людей в категории
            Vi - норма потребления для категории
            Ks - коэффициент сезона
            Ka - коэффициент активности
        """
        # Получаем коэффициенты
        ks = SEASON_COEFFICIENTS[request.season.value]
        ka = ACTIVITY_COEFFICIENTS[request.activity.value]

        # Считаем по категориям
        junior_subtotal = request.junior_count * WATER_NORMS["junior"]
        middle_subtotal = request.middle_count * WATER_NORMS["middle"]
        senior_subtotal = request.senior_count * WATER_NORMS["senior"]
        staff_subtotal = request.staff_count * WATER_NORMS["staff"]

        # Базовое потребление (без коэффициентов)
        base_total = junior_subtotal + middle_subtotal + senior_subtotal + staff_subtotal

        # Итоговое потребление с коэффициентами
        total_water = base_total * ks * ka

        # Общее количество людей
        total_people = (
            request.junior_count +
            request.middle_count +
            request.senior_count +
            request.staff_count
        )

        # Формируем детализацию
        breakdown = Breakdown(
            junior=CategoryBreakdown(
                count=request.junior_count,
                norm=WATER_NORMS["junior"],
                subtotal=round(junior_subtotal, 2)
            ),
            middle=CategoryBreakdown(
                count=request.middle_count,
                norm=WATER_NORMS["middle"],
                subtotal=round(middle_subtotal, 2)
            ),
            senior=CategoryBreakdown(
                count=request.senior_count,
                norm=WATER_NORMS["senior"],
                subtotal=round(senior_subtotal, 2)
            ),
            staff=CategoryBreakdown(
                count=request.staff_count,
                norm=WATER_NORMS["staff"],
                subtotal=round(staff_subtotal, 2)
            )
        )

        coefficients = Coefficients(season=ks, activity=ka)

        return CalculationResponse(
            total_water=round(total_water, 2),
            base_total=round(base_total, 2),
            breakdown=breakdown,
            coefficients=coefficients,
            total_people=total_people
        )

    @staticmethod
    def save_calculation(
        db: Session,
        request: CalculationRequest,
        total_water: float,
        user_id: Optional[int] = None
    ) -> Calculation:
        """
        Сохраняет расчёт в базу данных.

        Если user_id передан, привязывает расчёт к пользователю.
        """
        calculation = Calculation(
            user_id=user_id,
            junior_count=request.junior_count,
            middle_count=request.middle_count,
            senior_count=request.senior_count,
            staff_count=request.staff_count,
            season=request.season.value,
            activity=request.activity.value,
            total_water=total_water
        )
        db.add(calculation)
        db.commit()
        db.refresh(calculation)
        return calculation

    @staticmethod
    def get_user_calculations(db: Session, user_id: int) -> List[Calculation]:
        """Получает все расчёты пользователя, отсортированные по дате."""
        return (
            db.query(Calculation)
            .filter(Calculation.user_id == user_id)
            .order_by(Calculation.created_at.desc())
            .all()
        )

    @staticmethod
    def get_calculation_by_id(
        db: Session,
        calculation_id: int,
        user_id: int
    ) -> Optional[Calculation]:
        """Получает расчёт по ID, проверяя принадлежность пользователю."""
        return (
            db.query(Calculation)
            .filter(
                Calculation.id == calculation_id,
                Calculation.user_id == user_id
            )
            .first()
        )
