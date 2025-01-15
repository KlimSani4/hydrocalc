"""
Состояния FSM для процесса расчёта потребления воды.
"""
from aiogram.fsm.state import State, StatesGroup


class CalculationStates(StatesGroup):
    """
    Группа состояний для пошагового ввода данных расчёта.

    Пользователь последовательно вводит количество людей в каждой
    возрастной группе, затем выбирает сезон и тип активности.
    """

    waiting_junior_count = State()    # Ввод количества младших школьников (7-10 лет)
    waiting_middle_count = State()    # Ввод количества средних школьников (11-14 лет)
    waiting_senior_count = State()    # Ввод количества старших школьников (15-17 лет)
    waiting_staff_count = State()     # Ввод количества персонала (18+ лет)
    waiting_season = State()          # Выбор сезона (холодный/тёплый)
    waiting_activity = State()        # Выбор типа активности
