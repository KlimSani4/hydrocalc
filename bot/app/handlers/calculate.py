"""
Обработчик команды /calculate и FSM диалога расчёта.
"""
from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext

from app.states import CalculationStates
from app.keyboards import get_season_keyboard, get_activity_keyboard
from app.services import ApiClient, save_calculation

router = Router()
api_client = ApiClient()


@router.message(Command("calculate"))
async def cmd_calculate(message: Message, state: FSMContext) -> None:
    """
    Начинает диалог расчёта потребления воды.

    Очищает предыдущее состояние и запрашивает первый параметр.
    """
    await state.clear()
    await state.set_state(CalculationStates.waiting_junior_count)

    await message.answer(
        "📝 <b>Расчёт потребления воды</b>\n\n"
        "Введите количество <b>младших школьников (7-10 лет)</b>:\n"
        "<i>Введите число от 0 и выше</i>",
        parse_mode="HTML"
    )


@router.message(CalculationStates.waiting_junior_count)
async def process_junior_count(message: Message, state: FSMContext) -> None:
    """Обрабатывает ввод количества младших школьников."""
    if not message.text or not message.text.isdigit():
        await message.answer("❌ Пожалуйста, введите корректное число.")
        return

    count = int(message.text)
    if count < 0:
        await message.answer("❌ Число не может быть отрицательным.")
        return

    await state.update_data(junior_count=count)
    await state.set_state(CalculationStates.waiting_middle_count)

    await message.answer(
        "Введите количество <b>средних школьников (11-14 лет)</b>:",
        parse_mode="HTML"
    )


@router.message(CalculationStates.waiting_middle_count)
async def process_middle_count(message: Message, state: FSMContext) -> None:
    """Обрабатывает ввод количества средних школьников."""
    if not message.text or not message.text.isdigit():
        await message.answer("❌ Пожалуйста, введите корректное число.")
        return

    count = int(message.text)
    if count < 0:
        await message.answer("❌ Число не может быть отрицательным.")
        return

    await state.update_data(middle_count=count)
    await state.set_state(CalculationStates.waiting_senior_count)

    await message.answer(
        "Введите количество <b>старших школьников (15-17 лет)</b>:",
        parse_mode="HTML"
    )


@router.message(CalculationStates.waiting_senior_count)
async def process_senior_count(message: Message, state: FSMContext) -> None:
    """Обрабатывает ввод количества старших школьников."""
    if not message.text or not message.text.isdigit():
        await message.answer("❌ Пожалуйста, введите корректное число.")
        return

    count = int(message.text)
    if count < 0:
        await message.answer("❌ Число не может быть отрицательным.")
        return

    await state.update_data(senior_count=count)
    await state.set_state(CalculationStates.waiting_staff_count)

    await message.answer(
        "Введите количество <b>персонала (18+ лет)</b>:",
        parse_mode="HTML"
    )


@router.message(CalculationStates.waiting_staff_count)
async def process_staff_count(message: Message, state: FSMContext) -> None:
    """Обрабатывает ввод количества персонала."""
    if not message.text or not message.text.isdigit():
        await message.answer("❌ Пожалуйста, введите корректное число.")
        return

    count = int(message.text)
    if count < 0:
        await message.answer("❌ Число не может быть отрицательным.")
        return

    await state.update_data(staff_count=count)
    await state.set_state(CalculationStates.waiting_season)

    await message.answer(
        "Выберите <b>сезон</b>:",
        parse_mode="HTML",
        reply_markup=get_season_keyboard()
    )


@router.callback_query(CalculationStates.waiting_season, F.data.startswith("season:"))
async def process_season(callback: CallbackQuery, state: FSMContext) -> None:
    """Обрабатывает выбор сезона через inline кнопку."""
    season = callback.data.split(":")[1]
    await state.update_data(season=season)
    await state.set_state(CalculationStates.waiting_activity)

    season_text = "❄️ Холодный" if season == "cold" else "☀️ Тёплый"
    await callback.message.edit_text(f"Сезон: {season_text}")

    await callback.message.answer(
        "Выберите <b>тип активности</b>:",
        parse_mode="HTML",
        reply_markup=get_activity_keyboard()
    )
    await callback.answer()


@router.callback_query(CalculationStates.waiting_activity, F.data.startswith("activity:"))
async def process_activity(callback: CallbackQuery, state: FSMContext) -> None:
    """
    Обрабатывает выбор активности и выполняет расчёт.

    После выбора активности собирает все данные из FSM,
    отправляет запрос к API и показывает результат.
    """
    activity = callback.data.split(":")[1]
    await state.update_data(activity=activity)

    activity_names = {
        "normal": "📚 Обычный день",
        "sport": "⚽ Физкультура",
        "trip": "🏕 Поход"
    }
    await callback.message.edit_text(f"Активность: {activity_names.get(activity, activity)}")

    # Получаем все собранные данные
    data = await state.get_data()
    await state.clear()

    # Отправляем запрос к API
    await callback.message.answer("⏳ Выполняю расчёт...")

    result = await api_client.calculate_water(
        junior_count=data["junior_count"],
        middle_count=data["middle_count"],
        senior_count=data["senior_count"],
        staff_count=data["staff_count"],
        season=data["season"],
        activity=data["activity"],
    )

    if result:
        # Формируем красивый ответ
        season_text = "❄️ Холодный" if data["season"] == "cold" else "☀️ Тёплый"

        response = (
            "✅ <b>Результат расчёта</b>\n\n"
            f"<b>Исходные данные:</b>\n"
            f"• Младшие школьники: {data['junior_count']} чел.\n"
            f"• Средние школьники: {data['middle_count']} чел.\n"
            f"• Старшие школьники: {data['senior_count']} чел.\n"
            f"• Персонал: {data['staff_count']} чел.\n"
            f"• Сезон: {season_text}\n"
            f"• Активность: {activity_names.get(data['activity'], data['activity'])}\n\n"
            f"💧 <b>Итого:</b> {result.total_water:.1f} литров в день\n"
            f"👥 <b>Всего людей:</b> {result.total_people}\n"
        )

        # Добавляем детализацию, если есть
        if result.breakdown:
            category_names = {
                "junior": "Младшие",
                "middle": "Средние",
                "senior": "Старшие",
                "staff": "Персонал",
            }
            response += "\n<b>Детализация:</b>\n"
            for group, info in result.breakdown.items():
                name = category_names.get(group, group)
                response += f"• {name}: {info['subtotal']:.1f} л ({info['count']} чел. × {info['norm']} л)\n"

        await callback.message.answer(response, parse_mode="HTML")

        save_calculation(callback.from_user.id, result.total_water, data)
    else:
        # Если API недоступен, делаем локальный расчёт
        total = calculate_local(data)
        season_text = "❄️ Холодный" if data["season"] == "cold" else "☀️ Тёплый"

        response = (
            "✅ <b>Результат расчёта</b> <i>(локальный)</i>\n\n"
            f"<b>Исходные данные:</b>\n"
            f"• Младшие школьники: {data['junior_count']} чел.\n"
            f"• Средние школьники: {data['middle_count']} чел.\n"
            f"• Старшие школьники: {data['senior_count']} чел.\n"
            f"• Персонал: {data['staff_count']} чел.\n"
            f"• Сезон: {season_text}\n"
            f"• Активность: {activity_names.get(data['activity'], data['activity'])}\n\n"
            f"💧 <b>Итого:</b> {total:.1f} литров в день\n\n"
            f"<i>⚠️ API сервер недоступен, использован упрощённый расчёт</i>"
        )

        await callback.message.answer(response, parse_mode="HTML")

        save_calculation(callback.from_user.id, total, data)

    await callback.answer()


def calculate_local(data: dict) -> float:
    """
    Локальный расчёт нормы воды (резервный вариант).

    Используется когда Backend API недоступен.

    Args:
        data: Словарь с данными расчёта.

    Returns:
        Общее количество литров воды.
    """
    # Базовые нормы потребления (литров в день) по МР 2.3.1.0253-21
    base_rates = {
        "junior": 1.6,   # 7-10 лет
        "middle": 1.85,  # 11-14 лет
        "senior": 2.15,  # 15-17 лет
        "staff": 2.25,   # 18+ лет
    }

    # Коэффициент сезона
    season_multiplier = 1.3 if data["season"] == "warm" else 1.0

    # Коэффициент активности
    activity_multipliers = {
        "normal": 1.0,
        "sport": 1.5,
        "trip": 2.0,
    }
    activity_multiplier = activity_multipliers.get(data["activity"], 1.0)

    # Расчёт
    total = (
        data["junior_count"] * base_rates["junior"] +
        data["middle_count"] * base_rates["middle"] +
        data["senior_count"] * base_rates["senior"] +
        data["staff_count"] * base_rates["staff"]
    )

    total *= season_multiplier * activity_multiplier

    return total
