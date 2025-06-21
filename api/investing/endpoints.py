from fastapi import APIRouter, Query
from functools import lru_cache

# TODO use response_model instead of converted to_dict
# from api.investing.schema import InvestingReturnsInput, InvestingReturnsOutput
from api.investing.stockreturnscalculator import StockReturnsCalculator

router = APIRouter(
    prefix="/api/investing",
    tags=["investing"],
    responses={404: {"description": "Not found"}},
)


@lru_cache(maxsize=256)
def _get_stock_returns_calculator(index: str, start_date: str, end_date: str):
    return StockReturnsCalculator(index, start_date, end_date).calculate_returns()


@router.get("/index/returns")
async def index_returns(
    index: str = Query(..., description="Index ticker symbol, e.g. ^DJI for Dow Jones, or MSFT for Microsoft"),
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format"),
):
    results = _get_stock_returns_calculator(index, start_date, end_date)
    return results.to_dict(orient="records")
