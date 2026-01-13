from fastapi import APIRouter
from schemas.questionnaire import QuestionnaireIn

router = APIRouter()

@router.post("/questionnaire/validate")
def validate_questionnaire(data: QuestionnaireIn):
    return {"status": "ok", "data": data}