import pandas as pd
import numpy as np


def get_mapping() -> pd.DataFrame:
    """Reads the country_geo_lookup.csv file and returns it as pandas dataframe.

    Returns:
        pd.DataFrame: The country_geo_lookup.csv file as pandas dataframe.
    """
    return pd.read_csv("api/data/interim/country_geo_lookup.csv")

def read_eurostat_tsv(input_file: str) -> pd.DataFrame:
    """Reads the raw data and returns it as pandas dataframe.
    
    Args:
        input_file (str): The path to the raw data file.
    
    Returns:
        pd.DataFrame: The raw data.
    """
    data = pd.read_csv(
        input_file,
        sep="\t",
        na_values=[':', '']
    ).rename(columns={"freq,indic_de,geo\\TIME_PERIOD": "geo_meta"})

    data = data.assign(
        geo = data.geo_meta.str.split(",").str[-1]
    )

    return data

def prep_demography_data(data: pd.DataFrame, id_vars: list) -> pd.DataFrame:
    """Prepares the raw data for further processing (applies melt. drops unused 
    columns, etc.) and Joins with country_geo_lookup.csv

    Args:
        data (pd.DataFrame): The raw data.
        id_vars (list): The id_vars for the melt function.
    
    Returns:
        pd.DataFrame: The prepared data.
    """
    data = data.drop(columns=['geo_meta'])

    data.geo = data.geo.str.upper().replace("EU27_2020", "EU")

    data = data.melt(id_vars=id_vars, var_name='year', value_name='value')

    data = data.merge(get_mapping(), on='geo', how='left')

    data.value = data.value.apply(value_parser)

    data.year = data.year.apply(value_parser).astype(int)

    data = data.dropna(subset=['value'])

    return data

def get_demography_sum(input_file: str = "api/data/raw/eurostat_demography_sum.tsv") -> pd.DataFrame:
    """Reads the raw data and returns it as pandas dataframe.

    Returns:
        pd.DataFrame: The raw data after join with country_geo_lookup.csv
    """
    data = read_eurostat_tsv(input_file)

    data = prep_demography_data(data, "geo")

    return data

def get_demography_age(input_file: str = "api/data/raw/eurostat_demography_age.tsv") -> pd.DataFrame:
    """Reads the raw data and returns it as pandas dataframe.

    Returns:
        pd.DataFrame: The raw data after join with country_geo_lookup.csv
    """
    data = read_eurostat_tsv(input_file)

    data = data.assign(
        age_from = data.geo_meta.str.split(",").apply(lambda x: x[1].split("_")[1])\
            .str.replace("Y","").astype(int)
    )
    data = data.assign(
        age_to = data.geo_meta.str.split(",").apply(lambda x: x[1].split("_")[2])\
            .str.replace("Y","").str.replace("MAX","100").astype(int)
    )
    data = prep_demography_data(data, ["geo","age_from","age_to"])

    return data

def get_demography_age_median(input_file: str = "api/data/raw/eurostat_demography_age_median.tsv") -> pd.DataFrame:
    """Reads the raw data and returns it as pandas dataframe.

    Returns:
        pd.DataFrame: The raw data after join with country_geo_lookup.csv
    """
    data = read_eurostat_tsv(input_file)

    data = prep_demography_data(data, ["geo"])

    return data

def value_parser(value):
    """Parses a string to a float.
    """
    value = value.replace(":","").strip()
    if len(value) > 0:
        return float(value.split()[0])
    else:
        return np.nan

def prep_output(
        data: pd.DataFrame,
        year: int,
        geo: str,
        region: str,
        age: int,
        subset: list = None) -> list[dict]:
    """Prepares the output for the API.

    Args:
        data (pd.DataFrame): The data to be prepared.

    Returns:
        list[dict]: The prepared data.
    """
    if geo != "all":
        data = data[data.geo == geo.upper()]
    if year != "all":
        data = data[data.year == int(year)]
    if region.upper() == "EU":
        data = data[data.eu == 1]
    elif region.upper() == "CE":
        data = data[data.ce == 1]
    if age != "all" and "age_from" in data.columns and "age_to" in data.columns:
        data = data[(data.age_from <= int(age)) & (data.age_to >= int(age))]
    if subset is not None:
        data = data.drop_duplicates(subset=subset)
    output = []
    for row in data.iterrows():
        output.append(row[1].to_dict())
    return output