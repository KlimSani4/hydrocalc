"""
Хранилище истории расчётов в памяти.

Бот не хранит персональные данные постоянно - сессия анонимная и временная.
История хранится только в оперативной памяти и очищается при перезапуске бота.
"""
from datetime import datetime
from typing import Dict, List, Optional


MAX_HISTORY_SIZE = 5


_user_history: Dict[int, List[dict]] = {}


def save_calculation(user_id: int, total_water: float, params: dict) -> None:
    """
    Сохраняет результат расчёта в историю пользователя.

    Args:
        user_id: Telegram ID пользователя.
        total_water: Рассчитанное количество воды в литрах.
        params: Параметры расчёта (количество людей, сезон, активность).
    """
    if user_id not in _user_history:
        _user_history[user_id] = []

    record = {
        "total_water": total_water,
        "params": params,
        "timestamp": datetime.now(),
    }

    _user_history[user_id].append(record)

    if len(_user_history[user_id]) > MAX_HISTORY_SIZE:
        _user_history[user_id] = _user_history[user_id][-MAX_HISTORY_SIZE:]


def get_history(user_id: int) -> List[dict]:
    """
    Возвращает историю расчётов пользователя.

    Args:
        user_id: Telegram ID пользователя.

    Returns:
        Список записей истории (от старых к новым).
    """
    return _user_history.get(user_id, [])


def clear_history(user_id: int) -> None:
    """
    Очищает историю расчётов пользователя.

    Args:
        user_id: Telegram ID пользователя.
    """
    if user_id in _user_history:
        del _user_history[user_id]
