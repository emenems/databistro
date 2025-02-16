from fastapi import APIRouter, Query
from enum import Enum
from api.elektroauta.datastore import load_data_monthly_all, monthly_to_yearly_all, prep_data_monthly_electric, prep_data_yearly_electric, filter_data_electric, aggraget_data_electric

router = APIRouter(
    prefix="/api/elektroauta",
    tags=["elektroauta"],
    responses={404: {"description": "Not found"}},
)

@router.get("/table/electric")
async def get_data_electric(
    year: int = Query(None, description="Year to filter data by"),
    znacka: str = Query(None, description="Brand to filter data by"),
    model: str = Query(None, description="Model to filter data by"),
    pracovisko: str = Query(None, description="Pracovisko to filter data by")
):
    data = filter_data_electric(year, znacka, model, pracovisko)
    return data

@router.get("/table/electric/yearly")
async def get_data_yearly_electric():
    return prep_data_yearly_electric().to_dict(orient='records')

@router.get("/table/electric/monthly")
async def get_data_monthly_electric():
    return prep_data_monthly_electric().to_dict(orient='records')

@router.get("/table/electric/monthly")
async def get_data_monthly_electric():
    return load_data_monthly_all().to_dict(orient='records')

class AggregateEnum(str, Enum):
    znacka = "znacka"
    pracovisko = "pracovisko"
    model = "model"

@router.get("/table/electric/aggregate")
async def get_data_aggregate_electric(
    year: int = Query(..., description="Year to filter data by"),
    aggregate: AggregateEnum = Query(..., description="Aggregate to filter data by")
):
    data = aggraget_data_electric(year, aggregate).to_dict(orient='records')
    return data

@router.get("/table/all/monthly")
async def get_data_monthly_all():
    return load_data_monthly_all().to_dict(orient='records')

@router.get("/table/all/yearly")
async def get_data_yearly_all():
    return monthly_to_yearly_all().to_dict(orient='records')
