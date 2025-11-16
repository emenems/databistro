import marimo
from fastapi import FastAPI

from api.demography.endpoints import router as demography_router

# from api.investing.endpoints import router as investing_router
# from api.gini.endpoints import router as gini_router
from api.elektroauta.endpoints import router as elektroauta_router

server = marimo.create_asgi_app().with_app(path="/hazard", root="./api/hazard/financne_vysledky_firiem_v_hazarde.py")

app = FastAPI()

app.include_router(demography_router)
# app.include_router(investing_router)
# app.include_router(gini_router)
app.include_router(elektroauta_router)

app.mount("/", server.build())
