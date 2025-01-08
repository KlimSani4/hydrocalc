from app.routers.auth import router as auth_router
from app.routers.calculate import router as calculate_router
from app.routers.history import router as history_router

__all__ = ["auth_router", "calculate_router", "history_router"]
