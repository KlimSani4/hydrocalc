from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.userAPI import router as user_router
from api.calcresAPI import router as calcres_router
from api.questionnaireAPI import router as questionnaire_router

app = FastAPI(
    title="HydroCalc API",
    description="Backend API for personal daily water intake calculation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"])
def healthcheck():
    return {"status": "System is running"}

app.include_router(user_router, prefix="/api", tags=["Users"])
app.include_router(calcres_router, prefix="/api", tags=["Calculations"])
app.include_router(questionnaire_router, prefix="/api", tags=["Questionnaire"])