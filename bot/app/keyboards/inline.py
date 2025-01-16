"""
Inline клавиатуры для выбора параметров расчёта.
"""
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def get_season_keyboard() -> InlineKeyboardMarkup:
    """
    Создаёт клавиатуру для выбора сезона.

    Returns:
        InlineKeyboardMarkup с кнопками выбора сезона.
    """
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="❄️ Холодный", callback_data="season:cold"),
                InlineKeyboardButton(text="☀️ Тёплый", callback_data="season:warm"),
            ]
        ]
    )
    return keyboard


def get_activity_keyboard() -> InlineKeyboardMarkup:
    """
    Создаёт клавиатуру для выбора типа активности.

    Returns:
        InlineKeyboardMarkup с кнопками выбора активности.
    """
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📚 Обычный день", callback_data="activity:normal")],
            [InlineKeyboardButton(text="⚽ Физкультура", callback_data="activity:sport")],
            [InlineKeyboardButton(text="🏕 Поход", callback_data="activity:trip")],
        ]
    )
    return keyboard
