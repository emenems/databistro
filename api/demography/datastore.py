"""Singleton object to store all data needed in demography
"""

from api.demography.utils import (
    get_demography_sum,
    get_mapping,
    get_demography_age,
    get_demography_age_median
)

class DataStore:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataStore, cls).__new__(cls)
            cls._instance.data_sum = get_demography_sum()
            cls._instance.data_age = get_demography_age()
            cls._instance.data_age_median = get_demography_age_median()
            cls._instance.mapping = get_mapping()
        return cls._instance
    
    def get_data_sum(self):
        return self.data_sum
    
    def get_mapping(self):
        return self.mapping
    
    def get_data_age(self):
        return self.data_age
    
    def get_data_age_median(self):
        return self.data_age_median