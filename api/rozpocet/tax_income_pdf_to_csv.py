"""This script reads PDF files containing tax income data from the Slovak financial administration website,
extracts the relevant tables, and saves them as CSV files.

Example usage:

>>> python tax_income_pdf_to_csv.py --input_folder pdfs --output_folder csvs

"""

import os
import re
import pdfplumber
import pandas as pd
from datetime import datetime
import logging
import warnings
import argparse


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Suppress pdfminer and FutureWarning logs
logging.getLogger("pdfminer").setLevel(logging.ERROR)
warnings.simplefilter(action="ignore", category=FutureWarning)


def _extract_date_from_text(text):
    """
    Extract date in the format DD.MM.YYYY from the given text.

    Args:
        text (str): The text to search for a date.

    Returns:
        datetime.date: The extracted date, or None if not found.
    """
    date_match = re.search(r"(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})", text)
    if date_match:
        date_str = date_match.group(1)
        date_parts = date_str.split(".")
        if len(date_parts) == 3:
            year, month, day = date_parts[2], date_parts[1], date_parts[0]
            return datetime(int(year), int(month), int(day)).date()
    return None


def _process_row(danove_prijmy_str, skutocnost_str, date):
    """
    Process a single row's data into a DataFrame.

    Args:
        danove_prijmy_str (str): The string from the 'DAŇOVÉ PRÍJMY' column.
        skutocnost_str (str): The string from the 'SKUTOČNOSŤ' column.
        date (datetime.date): The date associated with the data.

    Returns:
        pd.DataFrame: A DataFrame containing the processed row data.
    """
    if not danove_prijmy_str:
        return pd.DataFrame()

    danove_prijmy = [val.replace(",", "") for val in danove_prijmy_str.split("\n")]
    skutocnost_lines = (skutocnost_str or "").split("\n")
    skutocnost = [float(val.replace(",", ".").replace(" ", "")) for val in skutocnost_lines if val.strip()]

    if len(danove_prijmy) == len(skutocnost):
        pass
    elif len(danove_prijmy) == len(skutocnost) + 2:
        colne_urady_row = next((i for i, val in enumerate(danove_prijmy) if val.lower() == "colné úrady"), -1)
        danove_urady_row = next((i for i, val in enumerate(danove_prijmy) if val.lower() == "daňové úrady"), -1)
        if colne_urady_row != -1 and danove_urady_row != -1:
            skutocnost.insert(colne_urady_row, None)
            skutocnost.insert(danove_urady_row, None)
        else:
            logger.error(f"Headers not found in {danove_prijmy}")
            return pd.DataFrame()
    else:
        logger.error(f"Row length mismatch: {len(danove_prijmy)}, {len(skutocnost)}")
        return pd.DataFrame()

    return pd.DataFrame(
        {
            "datum": [date.strftime("%Y-%m-%d") for _ in range(len(danove_prijmy))],
            "nazov": danove_prijmy,
            "skutocnost": skutocnost,
        }
    )


def extract_table_from_pdf(pdf_path):
    """
    Extract table data from the first page of a PDF and return a DataFrame and the extracted date.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        tuple: (pd.DataFrame, datetime.date) containing the extracted data and date,
               or an empty DataFrame and None if extraction fails.
    """
    with pdfplumber.open(pdf_path) as pdf:
        first_page = pdf.pages[0]
        table = first_page.extract_table()
        text = first_page.extract_text()

        date = _extract_date_from_text(text)
        if date is None:
            return pd.DataFrame(), None

        df = pd.DataFrame(table[1:], columns=table[0])
        df = df[df[df.columns[0]].str.len() > 0]  # Filter out empty rows in the first column

        # Identify columns with validation
        danove_prijmy_cols = [col for col in df.columns if "daňové" in col.lower()]
        skutocnost_cols = [col for col in df.columns if "skutočn" in col.lower()]
        if len(danove_prijmy_cols) != 1 or len(skutocnost_cols) != 1:
            logger.error(
                f"Expected one 'DAŇOVÉ PRÍJMY' and one 'SKUTOČNOSŤ' column, "
                f"found {len(danove_prijmy_cols)} and {len(skutocnost_cols)} respectively in {pdf_path}"
            )
            return pd.DataFrame(), date

        danove_prijmy_col = danove_prijmy_cols[0]
        skutocnost_col = skutocnost_cols[0]

        df_output = pd.DataFrame(columns=["datum", "nazov", "skutocnost"])
        logger.info(f"Processing date: {date} from {pdf_path}")
        for _, row in df.iterrows():
            df_row = _process_row(row[danove_prijmy_col], row[skutocnost_col], date)
            df_output = pd.concat([df_output, df_row], ignore_index=True)

        return df_output, date


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract tax income tables from PDFs to CSVs.")
    parser.add_argument(
        "--input_folder", "-i", type=str, required=True, help="Path to the folder containing PDF files."
    )
    parser.add_argument(
        "--output_folder", "-o", type=str, required=True, help="Path to the folder where CSV files will be saved."
    )
    args = parser.parse_args()

    input_folder = args.input_folder
    output_folder = args.output_folder

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    file_list = os.listdir(input_folder)
    for file_name in file_list:
        if file_name.endswith(".pdf"):
            pdf_path = os.path.join(input_folder, file_name)
            df, date = extract_table_from_pdf(pdf_path)
            if df.empty:
                logger.warning(f"No data extracted from {file_name}")
            else:
                csv_path = os.path.join(output_folder, f"danove_prijmy_sr_{date.year}_{date.month:02d}.csv")
                df.to_csv(csv_path, index=False, encoding="utf-8")
