from pydantic import BaseModel

class QuestionnaireIn(BaseModel):
    weight: float
    sex: str
    activity_level: str
