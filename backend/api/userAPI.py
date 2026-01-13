from fastapi import APIRouter, HTTPException, status
import psycopg2
from passlib.context import CryptContext

from db import fetch_one
from schemas.user import UserCreate, UserOut

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/auth/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate):
    hashed = pwd_context.hash(user.password)

    try:
        row = fetch_one(
            "INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id, email",
            (user.email, hashed)
        )
        return row
    except psycopg2.IntegrityError:
        raise HTTPException(status_code=400, detail="User already exists")
    except Exception as e:
        print("REGISTER ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/login")
def login(user: UserCreate):
    row = fetch_one(
        "SELECT id, password_hash FROM users WHERE email=%s",
        (user.email,)
    )

    if not row or not pwd_context.verify(user.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}

@router.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int):
    row = fetch_one(
        "SELECT id, email FROM users WHERE id=%s",
        (user_id,)
    )

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return row
