from datetime import date
from pydantic import BaseModel, validator

class InvestingReturnsInput(BaseModel):
    index: str
    start_date: date
    end_date: date

    @validator('start_date', 'end_date')
    def date_format_and_range(cls, v):
        if v < date(2010, 1, 1):
            raise ValueError('Date must be after 2010-01-01')
        if v > date.today():
            raise ValueError('Date cannot be in the future')
        return v

    @validator('index')
    def index_length(cls, v):
        if len(v) < 4:
            raise ValueError('Index must be at least 4 characters long')
        return v

class InvestingReturnsOutput(BaseModel):
    year: int
    mean: float
    min: float
    max: float