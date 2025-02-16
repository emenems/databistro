import os
import re
import pandas as pd
import xml.etree.ElementTree as ET
from typing import Dict, Optional


def _read_xml_data(file_path: str) -> Optional[int]:
    """Reads and processes XML data to find a specific value."""
    tree = ET.parse(file_path)
    root = tree.getroot()
    slovenska_republika_found = False
    namespaces = {'ss': 'urn:schemas-microsoft-com:office:spreadsheet'}

    for row in root.findall('.//ss:Row', namespaces):
        cell = row.find('.//ss:Cell/ss:Data', namespaces)
        if not slovenska_republika_found:
            if cell is not None and cell.text == "Slovenská republika":
                slovenska_republika_found = True
        else:
            if cell is not None and cell.text == "OSOBNÉ VOZIDLO":
                cells = row.findall('.//ss:Cell/ss:Data', namespaces)
                row_values = [cell.text for cell in cells]
                return int(row_values[-1])
    return None

def _read_xlsx_data(file_path: str) -> Optional[int]:
    """Reads and processes Excel data to find a specific value."""
    df = pd.read_excel(file_path)
    sr_index = df[df['Počet novoevidovaných vozidiel'] == 'Slovenská republika'].index[0]
    df_filtered = df.iloc[sr_index + 1:]
    df_osobne_vozidla = df_filtered[df_filtered['Počet novoevidovaných vozidiel'] == 'OSOBNÉ VOZIDLO']
    return df_osobne_vozidla.iloc[-1, 10]

def get_month_from_filename(filename: str) -> Optional[int]:
    """Extracts the month number from the filename."""
    mapping = {
        "januar": 1, "februar": 2, "marc": 3, "april": 4, "maj": 5, "jun": 6,
        "jul": 7, "august": 8, "septemb": 9, "oktob": 10, "novemb": 11, "decemb": 12
    }
    for month_name, month_number in mapping.items():
        if month_name in filename.lower():
            return month_number
    return None

def _read_all_files_in_directory(directory_path: str) -> Dict[int, int]:
    """Reads all XML and XLSX files in the directory and processes them."""
    monthly_data = {}

    for filename in os.listdir(directory_path):
        month = get_month_from_filename(filename)
        if month is None:
            continue

        file_path = os.path.join(directory_path, filename)
        if filename.endswith('.xml'):
            value = _read_xml_data(file_path)
        elif filename.endswith('.xlsx'):
            value = _read_xlsx_data(file_path)
        else:
            continue

        if value is not None:
            monthly_data[month] = value

    return monthly_data

def process_monthly_registrations(
        file_path: str = './_data/elektroauta/mesacne/',
        start_year: int = 2021,
        end_year: int = 2024
    ) -> pd.DataFrame:
    """Processes monthly total registrations for a given range of years.
    Use to process data downloaded from `https://www.minv.sk/?celkovy-pocet-evidovanych-vozidiel-v-sr`

    Args:
        file_path (str): The path to the directory containing the data files.
        start_year (int): The starting year for processing the data.
        end_year (int): The ending year for processing the data.
    
    Returns:
        pd.DataFrame: A DataFrame containing the processed data.
      
    Example:
        >>> df = process_monthly_registrations('./_data/elektroauta/mesacne/', 2021, 2024)
        >>> print(df)
        >>> # Save the processed data to a new excel
        >>> df.to_excel('./api/data/interim/data_table_monthly_registrations.xlsx', index=False)
        >>> # yearly values
        >>> print(df.groupby('year')['registrations'].sum())
    """
    df = pd.DataFrame()

    for year in range(start_year, end_year + 1):
        year_directory = os.path.join(file_path, str(year))
        monthly_data = _read_all_files_in_directory(year_directory)
        temp_df = pd.DataFrame(list(monthly_data.items()), columns=['month', 'registrations'])
        df = pd.concat([df, temp_df.assign(year=year)], ignore_index=True)

    df = df.sort_values(by=['year', 'month']).reset_index(drop=True)
    return df[['year', 'month', 'registrations']]

def _fix_znacka_name(df: pd.DataFrame) -> pd.DataFrame:
    """Unify the brand names in the DataFrame."""
    replacements = {
        'ABARTH': 'FIAT',
        'BMW I': 'BMW',
        'BWW': 'BMW',
        'FERRI': 'FERRARI',
        'FORD-CNG-TECHNIK': 'FORD',
        'MERCEDES BENZ': 'MERCEDES-BENZ',
        'MERCEDES-AMG': 'MERCEDES-BENZ',
        'MERCEDES BENZ AMG': 'MERCEDES-BENZ',
        'MG ROEWE': 'MG',
        'TESLA MOTORS': 'TESLA',
    }
    df['znacka'] = df['znacka'].replace(replacements)
    return df

def _standardize_model_name(name):
    name = str(name).strip().replace(',','')
    # Standardize eDrive and xDrive names
    name = re.sub(r'(eDrive|xDrive)(\d+)', r' \1\2', name)
    name = re.sub(r'(\w+)\s*(eDrive|xDrive)(\d+)', r'\1 \2\3', name)

    # Standardize the kWh usage
    if "kw" in name.lower():
        name = re.sub(r'(\d+)\s*[Kk]?[Ww]?[Hh]?', lambda x: x.group(1) + ' kWh', name)
        # Add space after kWh if followed by any alphabetic characters
        name = re.sub(r'kWh([a-zA-Z])', r'kWh \1', name)

    # Remove double spaces and strip leading/trailing spaces
    name = re.sub(r'\s+', ' ', name).strip()

    # some weird BMW stuff
    for num in [1,3,5,7,9]:
        name = name.replace(f"is{num}", f"i{num}")
        name = name.replace(f"i-{num}", f"i{num}")
        name = name.replace(f"i {num}", f"i{num}")
        name = name.replace(f"BMW i{num} ", f"i{num}")
    
    name = name.replace("BMW I","i1").replace("BMW i","i1").replace("BMWi","i1").replace("BMW ","")

    # Standardize Tesla models
    name = name.replace("TESLA","Model X")
    if name == "Y":
        name = "Model Y"
    name = name.replace("model ","Model ").replace("MODEL ","Model ").replace("Tesla ","").replace("MODEL3","Model 3")

    # skoda
    for model in ["CITIGO-E", "CITIGO-E", "CITIGO-e IV", "CITIGOe IV"]:
        name = name.replace(model, "CITIGO")
    for model in ["UP !", "UP!"]:
        name = name.replace(model, "UP")
    
    # others
    name = name.replace("ATTO3", "ATTO 3")
    return name

def process_electric_registrations(
        file_path: str,
        min_date: str = '2021-01-01',
        filter_engine: str = 'ELEKTRINA',
        personal_only: bool = True) -> pd.DataFrame:
    """Loads and processes the Excel data with all electric vehicle registrations.
    Use to process data downloade from `https://www.minv.sk/?pocet-evidovanych-elektromobilov-a-hybridov`

    Args:
        file_path (str): The path to the Excel file containing the data.
        min_date (str): The minimum date for filtering the data.
        filter_engine (str): The type of fuel to filter the data by.
        personal_only (bool): Whether to include only personal vehicles.
    
    Returns:
        pd.DataFrame: A DataFrame containing the processed data.
    
    
    Example:
        >>> df = process_electric_registrations('./_data/elektroauta/rocne/elektro_k_31-12-2024.xlsx')
        >>> print(df.head())
        >>> # Save the processed data to a new Excel file
        >>> df.to_excel('./api/data/interim/data_table_elektroauta.xlsx', index=False)
    """
    df = pd.read_excel(file_path)

    # Filter data based on conditions
    df = df[df['Dátum prvej evidencie v SR'] >= min_date]
    df = df[df['Druh paliva'] == filter_engine]
    if personal_only:
        df = df[df['Kategória vozidla'].str.match(r'^M1')]

    # Select relevant columns
    df = df[['Dátum prvej evidencie v SR', 'Značka', 'Obchodný názov', 'Pracovisko priradenia', 'Prevádzková hmotnosť', 'Max výkon']]
    df = df.rename(columns={
        'Dátum prvej evidencie v SR': 'registracia',
        'Značka': 'znacka',
        'Obchodný názov': 'model',
        'Pracovisko priradenia': 'pracovisko',
        'Prevádzková hmotnosť': 'hmotnost',
        'Max výkon': 'vykon'
    })

    # Drop rows with missing values and filter out invalid brand names
    df = df.dropna()
    df = df[df.znacka.str.len() > 1]

    df['vykon'] = pd.to_numeric(df['vykon'], errors='coerce').fillna(0).astype(int)
    df['hmotnost'] = pd.to_numeric(df['hmotnost'], errors='coerce').fillna(0).astype(int)
    df['model'] = df['model'].astype(str)

    # Avoid using HH:MM:SS in the date format
    df['registracia'] = df['registracia'].apply(lambda x: x.strftime('%Y-%m-%d'))

    # Use only the city name not the prefix (ODI City)
    df['pracovisko'] = df['pracovisko'].apply(lambda x: ' '.join(x.split(' ')[1:]))

    # Standardize brand names
    df = _fix_znacka_name(df)
    df['model'] = df['model'].apply(_standardize_model_name)

    return df
