"""
Главный модуль Telegram бота HydroCalc.

Запуск бота, инициализация диспетчера и подключение обработчиков.
"""
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from app.config import config
from app.handlers import setup_routers


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def main() -> None:
    """
    Точка входа в приложение.

    Создаёт бота, настраивает диспетчер и запускает polling.
    """
    # Проверяем конфигурацию
    config.validate()

    # Создаём бота
    bot = Bot(token=config.BOT_TOKEN, parse_mode=ParseMode.HTML)

    # Создаём диспетчер с хранилищем состояний в памяти
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    # Подключаем обработчики
    main_router = setup_routers()
    dp.include_router(main_router)

    # Запускаем бота
    logger.info("Бот запускается...")

    try:
        # Удаляем вебхук и запускаем polling
        await bot.delete_webhook(drop_pending_updates=True)
        await dp.start_polling(bot)
    finally:
        await bot.session.close()
        logger.info("Бот остановлен")


if __name__ == "__main__":
    asyncio.run(main())
