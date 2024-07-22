from typing import Annotated, Union

from fastapi import APIRouter, Query

# TODO use response_model instead of converted to_dict
# from api.investing.schema import InvestingReturnsInput, InvestingReturnsOutput
from api.investing.stockreturnscalculator import StockReturnsCalculator

router = APIRouter(
    prefix="/api/investing",
    tags=["investing"],
    responses={404: {"description": "Not found"}},
)

@router.get("/index/returns")
async def index_returns(
    index: str = Query(..., description="Index ticker symbol, e.g. ^DJI"),
    start_date: str = Query(..., description="Start date for the analysis"),
    end_date: str = Query(..., description="End date for the analysis"),
):
    data = StockReturnsCalculator(index, start_date, end_date)
    results = data.calculate_returns()
    return results.to_dict(orient='records')
