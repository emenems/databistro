from typing import Annotated, Union

from fastapi import APIRouter, Query

from api.demography.datastore import DataStore
from api.demography.utils import prep_output
from api.demography.schema import DemographySeriesSum, DemographySeriesAge #DemographyCountries

router = APIRouter(
    prefix="/api/demography",
    tags=["demography"],
    responses={404: {"description": "Not found"}},
)

@router.get("/series/sum", response_model=Annotated[list[DemographySeriesSum], "DemographySeriesSum"])
async def read_demography_series(
    country: str = Query(defaul="all", description="Country code, for example SK (or 'all')", max_length=3, min_length=2),
    year: Union[int, str] = Query(default="all", description="Year in YYYY format (or 'all')"),
    region: str = Query(default="all", description="Region code, for example EU (or 'all')"),
):
    datastore = DataStore()
    data_filtered = prep_output(datastore.get_data_sum(), year, country, region, "all")
    return [DemographySeriesSum(**row) for row in data_filtered]


# @router.get("/countries", response_model=Annotated[list[DemographyCountries], "List of strings"])
# async def read_countries(
#     year: Union[int, str] = Query(default="all", description="Year in YYYY format (or 'all')"),
#     region: str = Query(default="all", description="Region code, for example EU (or 'all')"),
# ):
#     datastore = DataStore()
#     data_filtered = prep_output(datastore.get_data_sum(), year, "all", region, "all", ["geo","full_name"])
#     return [DemographyCountries(**row) for row in data_filtered]


@router.get("/series/age", response_model=Annotated[list[DemographySeriesAge], "DemographySeriesAge"])
async def read_demography_series_age(
    country: str = Query(defaul="all", description="Country code, for example SK (or 'all')", max_length=3, min_length=2),
    year: Union[int, str] = Query(default="all", description="Year in YYYY format (or 'all')"),
    region: str = Query(default="all", description="Region code, for example EU (or 'all')"),
    age: Union[int, str] = Query(default="all", description="Age group, e.g. 20 (or 'all')"),
):
    datastore = DataStore()
    data_filtered = prep_output(datastore.get_data_age(), year, country, region, age)
    return [DemographySeriesAge(**row) for row in data_filtered]

@router.get("/series/age/median", response_model=Annotated[list[DemographySeriesSum], "DemographySeriesSum"])
async def read_demography_series_age_median(
    country: str = Query(defaul="all", description="Country code, for example SK (or 'all')", max_length=3, min_length=2),
    year: Union[int, str] = Query(default="all", description="Year in YYYY format (or 'all')"),
    region: str = Query(default="all", description="Region code, for example EU (or 'all')"),
):
    datastore = DataStore()
    data_filtered = prep_output(datastore.get_data_age_median(), year, country, region, "all")
    return [DemographySeriesSum(**row) for row in data_filtered]
