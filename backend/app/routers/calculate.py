from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.calculation import CalculationRequest, CalculationResponse
from app.services.auth import get_current_user_optional
from app.services.calculator import CalculatorService

router = APIRouter(tags=["calculate"])


@router.post("/calculate", response_model=CalculationResponse)
def calculate_water(
    request: CalculationRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Расчёт потребления воды.

    Доступен всем, но если пользователь авторизован -
    расчёт сохраняется в историю.
    """
    result = CalculatorService.calculate(request)

    # Сохраняем в БД если пользователь авторизован
    if current_user:
        CalculatorService.save_calculation(
            db,
            request,
            result.total_water,
            current_user.id
        )

    return result
