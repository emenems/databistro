import numpy as np

def calculate_gini(population, incomes, percentages):
    """
    Calculate the Gini index for a given income distribution
    
    Args:
        population (int): Total population
        incomes (list): List of income values
        percentages (list): List of population percentages for each income value
    
    Returns:
        float: Gini coefficient
    """
    # Convert percentages to actual population numbers
    population_counts = [int((p/100) * population) for p in percentages]
    
    # Create arrays of income and population counts
    income_array = np.repeat(incomes, population_counts)
    
    # Calculate cumulative proportions
    n = len(income_array)
    income_sorted = np.sort(income_array)
    cumsum = np.cumsum(income_sorted)
    total_income = cumsum[-1]
    
    # Calculate Lorenz curve points
    lorenz_curve = cumsum / total_income
    population_props = np.arange(1, n + 1) / n
    
    # Calculate area under Lorenz curve using trapezoidal rule
    area_under_lorenz = np.trapz(lorenz_curve, population_props)
    
    # Calculate Gini coefficient
    area_of_equality = 0.5  # Area under the line of perfect equality
    gini = (area_of_equality - area_under_lorenz) / area_of_equality
    
    gini_rounded = np.round(gini,3)
    # can be only 0.0 to 1.0
    if gini_rounded <= 0.0:
        return 0.0
    if gini_rounded >= 1.0:
        return 1.0

