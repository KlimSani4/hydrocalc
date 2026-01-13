from typing import List

from fastapi import APIRouter, HTTPException, status
from services.calculator import calculate_water
from db import fetch_one, fetch_all
from schemas.calculation import CalculationIn, CalculationOut

router = APIRouter()

@router.post("/calculations", response_model=CalculationOut, status_code=status.HTTP_201_CREATED)
def calculate(calc: CalculationIn):
    if calc.sex.lower() not in ("male", "female"):
        raise HTTPException(status_code=400, detail="sex must be 'male' or 'female'")

    if calc.activity.lower() not in ("low", "medium", "high"):
        raise HTTPException(status_code=400, detail="activity must be one of: low, medium, high")

    water = calculate_water(calc.weight, calc.sex, calc.activity)

    row = fetch_one(
        "INSERT INTO calc_res (user_id, water_amount, weight, sex, activity_level) VALUES (%s, %s, %s, %s, %s) RETURNING id, water_amount, created_at, weight, sex, activity_level",
        (calc.user_id, water, calc.weight, calc.sex, calc.activity)
    )

    return row

@router.get("/calculations/{user_id}", response_model=List[CalculationOut])
def history(user_id: int):
    return fetch_all(
        "SELECT id, water_amount, created_at, sex, activity_level, weight FROM calc_res WHERE user_id=%s ORDER BY created_at DESC",
        (user_id,)
    )