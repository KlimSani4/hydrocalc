"""
Обработчик команды /history.
"""
from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

from app.services.session_storage import get_history

router = Router()


@router.message(Command("history"))
async def cmd_history(message: Message) -> None:
    """
    Показывает историю последних расчётов пользователя.

    История хранится в памяти и очищается при перезапуске бота.
    """
    user_id = message.from_user.id
    history = get_history(user_id)

    if not history:
        await message.answer(
            "📋 <b>История расчётов</b>\n\n"
            "У вас пока нет сохранённых расчётов.\n"
            "Используйте /calculate для выполнения расчёта.",
            parse_mode="HTML"
        )
        return

    activity_names = {
        "normal": "Обычный день",
        "sport": "Физкультура",
        "trip": "Поход",
    }

    response = "📋 <b>История расчётов</b>\n\n"

    for i, record in enumerate(reversed(history), 1):
        params = record["params"]
        timestamp = record["timestamp"].strftime("%d.%m %H:%M")

        season_text = "холодный" if params.get("season") == "cold" else "тёплый"
        activity_text = activity_names.get(params.get("activity", ""), params.get("activity", ""))

        total_people = (
            params.get("junior_count", 0) +
            params.get("middle_count", 0) +
            params.get("senior_count", 0) +
            params.get("staff_count", 0)
        )

        response += (
            f"<b>{i}.</b> {timestamp}\n"
            f"   💧 {record['total_water']:.1f} л • {total_people} чел.\n"
            f"   {season_text}, {activity_text}\n\n"
        )

    response += "<i>История хранится до перезапуска бота</i>"

    await message.answer(response, parse_mode="HTML")
