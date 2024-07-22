from fastapi import FastAPI

from api.demography.endpoints import router as demography_router
from api.investing.endpoints import router as investing_router

app = FastAPI()

app.include_router(demography_router)
app.include_router(investing_router)

@app.get("/api/test")
def hello_world():
    return {"message": "Hi there, the API is working!"}