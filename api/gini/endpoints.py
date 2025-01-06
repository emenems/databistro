from fastapi import APIRouter, Query, Body
from typing import List
from api.gini.schema import GiniInput
from api.gini.ginicalc import calculate_gini

router = APIRouter()

@router.post("/calc")
async def calc_gini(
    gini_input: GiniInput = Body(..., description="Gini calculation input data")
):
    population = gini_input.population
    incomes = [item.income for item in gini_input.data]
    percentages = [item.percentage for item in gini_input.data]
    return calculate_gini(population, incomes, percentages)
