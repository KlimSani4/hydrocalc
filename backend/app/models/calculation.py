from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class Calculation(Base):
    """Модель сохранённого расчёта потребления воды."""

    __tablename__ = "calculations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True
    )

    # Количество людей по категориям
    junior_count: Mapped[int] = mapped_column(Integer, default=0)
    middle_count: Mapped[int] = mapped_column(Integer, default=0)
    senior_count: Mapped[int] = mapped_column(Integer, default=0)
    staff_count: Mapped[int] = mapped_column(Integer, default=0)

    # Параметры расчёта
    season: Mapped[str] = mapped_column(String(10))  # cold/warm
    activity: Mapped[str] = mapped_column(String(10))  # normal/sport/trip

    # Результат
    total_water: Mapped[float] = mapped_column(Float)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    # Связь с пользователем
    user: Mapped[Optional["User"]] = relationship(back_populates="calculations")
