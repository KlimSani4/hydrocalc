from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.calculation import (
    CalculationHistoryItem,
    CalculationDetail,
    CalculationParams,
    Breakdown,
    CategoryBreakdown,
    Coefficients
)
from app.services.auth import get_current_user
from app.services.calculator import (
    CalculatorService,
    WATER_NORMS,
    SEASON_COEFFICIENTS,
    ACTIVITY_COEFFICIENTS
)

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=List[CalculationHistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Получение истории расчётов пользователя.

    Требует авторизации. Возвращает список расчётов
    в хронологическом порядке (новые сначала).
    """
    calculations = CalculatorService.get_user_calculations(db, current_user.id)

    result = []
    for calc in calculations:
        item = CalculationHistoryItem(
            id=calc.id,
            total_water=calc.total_water,
            created_at=calc.created_at,
            params=CalculationParams(
                junior_count=calc.junior_count,
                middle_count=calc.middle_count,
                senior_count=calc.senior_count,
                staff_count=calc.staff_count,
                season=calc.season,
                activity=calc.activity
            )
        )
        result.append(item)

    return result


@router.get("/{calculation_id}", response_model=CalculationDetail)
def get_calculation_detail(
    calculation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Получение детальной информации о расчёте.

    Требует авторизации. Возвращает полную информацию
    включая breakdown по категориям.
    """
    calculation = CalculatorService.get_calculation_by_id(
        db,
        calculation_id,
        current_user.id
    )

    if not calculation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Расчёт не найден"
        )

    # Пересчитываем детализацию
    junior_subtotal = calculation.junior_count * WATER_NORMS["junior"]
    middle_subtotal = calculation.middle_count * WATER_NORMS["middle"]
    senior_subtotal = calculation.senior_count * WATER_NORMS["senior"]
    staff_subtotal = calculation.staff_count * WATER_NORMS["staff"]

    ks = SEASON_COEFFICIENTS[calculation.season]
    ka = ACTIVITY_COEFFICIENTS[calculation.activity]

    total_people = (
        calculation.junior_count +
        calculation.middle_count +
        calculation.senior_count +
        calculation.staff_count
    )

    breakdown = Breakdown(
        junior=CategoryBreakdown(
            count=calculation.junior_count,
            norm=WATER_NORMS["junior"],
            subtotal=round(junior_subtotal, 2)
        ),
        middle=CategoryBreakdown(
            count=calculation.middle_count,
            norm=WATER_NORMS["middle"],
            subtotal=round(middle_subtotal, 2)
        ),
        senior=CategoryBreakdown(
            count=calculation.senior_count,
            norm=WATER_NORMS["senior"],
            subtotal=round(senior_subtotal, 2)
        ),
        staff=CategoryBreakdown(
            count=calculation.staff_count,
            norm=WATER_NORMS["staff"],
            subtotal=round(staff_subtotal, 2)
        )
    )

    return CalculationDetail(
        id=calculation.id,
        total_water=calculation.total_water,
        created_at=calculation.created_at,
        params=CalculationParams(
            junior_count=calculation.junior_count,
            middle_count=calculation.middle_count,
            senior_count=calculation.senior_count,
            staff_count=calculation.staff_count,
            season=calculation.season,
            activity=calculation.activity
        ),
        breakdown=breakdown,
        coefficients=Coefficients(season=ks, activity=ka),
        total_people=total_people
    )
