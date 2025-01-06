from pydantic import BaseModel, validator
from typing import List

class IncomePercentage(BaseModel):
    income: float
    percentage: float

    @validator('income', 'percentage')
    def check_non_negative(cls, v):
        if v < 0:
            raise ValueError('Values in income and percentage must be non-negative')
        return v

class GiniInput(BaseModel):
    data: List[IncomePercentage]
    population: int = 5430000

    @validator('population')
    def check_population_non_negative(cls, v):
        if v < 0:
            raise ValueError('Population must be non-negative')
        return v

    @validator('data')
    def check_percentages_sum(cls, v):
        percentages = [item.percentage for item in v]
        if sum(percentages) != 100:
            raise ValueError('Percentages must add up to 100')
        return v

    @validator('data')
    def check_lengths_equal(cls, v):
        incomes = [item.income for item in v]
        percentages = [item.percentage for item in v]
        if len(incomes) != len(percentages):
            raise ValueError('The lengths of incomes and percentages must be equal')
        return v