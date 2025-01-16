"""
Модуль обработчиков команд бота.
"""
from aiogram import Router

from .start import router as start_router
from .help import router as help_router
from .calculate import router as calculate_router


def setup_routers() -> Router:
    """
    Собирает все роутеры в один главный роутер.

    Returns:
        Router со всеми подключёнными обработчиками.
    """
    main_router = Router()

    main_router.include_router(start_router)
    main_router.include_router(help_router)
    main_router.include_router(calculate_router)

    return main_router
