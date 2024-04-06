from pydantic import BaseModel

class DemographyCountries(BaseModel):
    geo: str
    full_name: str

class DemographySeriesSum(DemographyCountries):
    year: int
    value: float

class DemographySeriesAge(DemographySeriesSum):
    age_from: int
    age_to: int