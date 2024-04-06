from fastapi import FastAPI

from api.demography.endpoints import router as demography_router

app = FastAPI()

app.include_router(demography_router)

@app.get("/api/test")
def hello_world():
    return {"message": "Hi there, the API is working!"}