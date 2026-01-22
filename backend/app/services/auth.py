from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer

from app.config import get_settings
from app.database import get_db
from app.models.user import User

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# OAuth2 для login endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_token_from_header(
    x_auth_token: Optional[str] = Header(None, alias="X-Auth-Token")
) -> Optional[str]:
    """
    Извлекает токен из заголовка X-Auth-Token.

    Используется вместо Authorization чтобы обойти Istio JWT validation.
    """
    return x_auth_token


class AuthService:
    """Сервис аутентификации и работы с пользователями."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Хеширует пароль с использованием bcrypt."""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Проверяет соответствие пароля хешу."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(user_id: int) -> str:
        """
        Создаёт JWT токен для пользователя.

        Токен содержит user_id и время истечения.
        """
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        payload = {
            "sub": str(user_id),
            "exp": expire
        }
        return jwt.encode(
            payload,
            settings.secret_key,
            algorithm=settings.algorithm
        )

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Находит пользователя по email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Находит пользователя по ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(db: Session, email: str, password: str) -> User:
        """
        Создаёт нового пользователя.

        Хеширует пароль и сохраняет в БД.
        """
        hashed = AuthService.hash_password(password)
        user = User(email=email, password_hash=hashed)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """
        Аутентифицирует пользователя по email и паролю.

        Возвращает пользователя если данные верны, иначе None.
        """
        user = AuthService.get_user_by_email(db, email)
        if not user:
            return None
        if not AuthService.verify_password(password, user.password_hash):
            return None
        return user


def get_current_user(
    token: Optional[str] = Depends(get_token_from_header),
    db: Session = Depends(get_db)
) -> User:
    """
    Получает текущего пользователя из JWT токена.

    Используется как зависимость для защищённых endpoints.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учётные данные",
        headers={"WWW-Authenticate": "Bearer"}
    )

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = AuthService.get_user_by_id(db, int(user_id))
    if user is None:
        raise credentials_exception

    return user


def get_current_user_optional(
    token: Optional[str] = Depends(get_token_from_header),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Получает текущего пользователя если токен предоставлен.

    Возвращает None если токен отсутствует или невалиден.
    """
    if not token:
        return None

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        user_id = payload.get("sub")
        if user_id is None:
            return None
        return AuthService.get_user_by_id(db, int(user_id))
    except JWTError:
        return None
