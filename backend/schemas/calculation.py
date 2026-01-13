from pydantic import BaseModel
from datetime import datetime

class CalculationOut(BaseModel):
    id: int
    water_amount: float
    created_at: datetime
    sex: str
    activity_level: str
    weight: float


class CalculationIn(BaseModel):
    user_id: int
    weight: float
    sex: str
    activity: str
