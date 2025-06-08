"""This script reads converted CSV files containing tax income data related to alcohol and tobacco,
aggregates the data, and saves it to a specified output CSV file.

Example usage:

>>> python tax_income_prep_alcohol_tabaco.py --input_folder csvs --output_file output/alcohol_tabaco_income.csv

"""

import os
import pandas as pd
import logging
import warnings
import argparse
import json


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Suppress pdfminer and FutureWarning logs
logging.getLogger("pdfminer").setLevel(logging.ERROR)
warnings.simplefilter(action="ignore", category=FutureWarning)

COLOR_MAPPING = {
    "Lieh": "bg-violet-500",
    "Pivo": "bg-fuchsia-500",
    "Víno": "bg-rose-500",
    "Tabák": "bg-blue-500",
    "Uhlie": "bg-stone-500",
    "Elektrina": "bg-yellow-500",
    "Plyn": "bg-slate-500",
    "Minerálne oleje": "bg-amber-500",
}


def filter_alcohol_tabaco(
    df: pd.DataFrame,
    keywords: dict = {
        "lieh": "Lieh",
        "piva": "Pivo",
        "vína": "Víno",
        "tabakov": "Tabák",
        "miner": "Minerálne oleje",
        "uhli": "Uhlie",
        "elektrin": "Elektrina",
        "plyn": "Plyn",
    },
) -> pd.DataFrame:
    """
    Filter the DataFrame to include only rows related to alcohol and tobacco income.

    Args:
        df (pd.DataFrame): The DataFrame containing income data.

    Returns:
        pd.DataFrame: Filtered DataFrame with only alcohol and tobacco income.
    """
    output = pd.DataFrame(columns=df.columns)
    for keyword, column in keywords.items():
        temp_df = df[df["nazov"].str.contains(keyword, case=False, na=False)]
        if temp_df.empty:
            logger.warning(
                f"No data found for keyword: {keyword} in {df['datum'].iloc[0] if not df.empty else 'unknown date'}"
            )
            continue
        elif temp_df.shape[0] > 2:
            logger.warning(f"Multiple rows found for keyword: {keyword}, returning first row only.")
        output = pd.concat(
            [
                output,
                pd.DataFrame(
                    {
                        "datum": temp_df["datum"].iloc[0],
                        "nazov": column,
                        "skutocnost": temp_df["skutocnost"].sum(),
                    },
                    index=[0],
                ),
            ],
            ignore_index=True,
        )
    return output


def df_to_json(df, output_json: str = None, value_column: str = "skutocnost"):
    """
    Convert the alcohol/tobacco DataFrame or CSV to a JSON array grouped by month, with columns for each commodity.
    Args:
        df (str or pd.DataFrame): Path to the input CSV or a DataFrame.
        output_json (str): If provided, write the result to this file.
        value_column (str): Column to use for values ("skutocnost" or "skutocnost_mesiac").

    Returns:
        list: List of dicts in the desired JSON format.
    """
    df["date"] = df["datum"].str.slice(0, 7)
    pivot = df.pivot_table(
        index="date",
        columns="nazov",
        values=value_column,
        aggfunc="sum",
        fill_value=0,
    ).reset_index()
    result = []
    for _, row in pivot.iterrows():
        entry = {"date": row["date"]}
        for col in ["Tabák", "Lieh", "Pivo", "Víno"]:
            if col in pivot.columns:
                entry[col] = int(round(row[col]))
        result.append(entry)
    if output_json:
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
    return result


def df_to_monthly_average_json(
    df, min_date: str = "2024-01-01", output_json: str = None, value_column: str = "skutocnost_mesiac"
):
    out_df = df[df["datum"] >= min_date][["nazov", value_column]].groupby("nazov").mean().round(0)
    out_df = out_df.reset_index().rename(columns={value_column: "amount"})
    out_df["borderColor"] = out_df["nazov"].map(COLOR_MAPPING)
    out_df = out_df.rename(columns={"nazov": "name"})
    out_df = out_df.sort_values(by="amount", ascending=False).reset_index(drop=True)
    if output_json:
        out_df.to_json(output_json, orient="records", force_ascii=False, indent=2)


def df_to_full_year_json(df, output_json: str = None, value_column: str = "skutocnost"):
    out_df = df[df["datum"] == "2024-12-31"]
    out_df = out_df.reset_index().rename(columns={value_column: "amount"})
    out_df["borderColor"] = out_df["nazov"].map(COLOR_MAPPING)
    out_df = out_df.rename(columns={"nazov": "name"})
    out_df = out_df.sort_values(by="amount", ascending=False).reset_index(drop=True)
    if output_json:
        out_df[["name", "amount", "borderColor", "date"]].to_json(
            output_json, orient="records", force_ascii=False, indent=2
        )


def main(input_folder: str, output_file: str, output_json: str):
    logger.info(f"Processing CSV files from {input_folder} to aggregate alcohol and tobacco income.")
    files = os.listdir(input_folder)
    output = pd.DataFrame(columns=["datum", "nazov", "skutocnost"])
    for file_name in files:
        if file_name.endswith(".csv"):
            csv_path = os.path.join(input_folder, file_name)
            try:
                df = pd.read_csv(csv_path, encoding="utf-8")
            except Exception as e:
                logger.error(f"Failed to read {csv_path}: {e}")
                continue
            filtered_df = filter_alcohol_tabaco(df)
            if not filtered_df.empty:
                output = pd.concat([output, filtered_df], ignore_index=True)
            else:
                logger.info(f"No relevant data found in {file_name}")
    if not output.empty:
        output = output.sort_values(by=["datum", "nazov"]).reset_index(drop=True)
        output.skutocnost = output.skutocnost.astype(float).round(0)
        output["skutocnost_mesiac"] = output.skutocnost.div(
            output["datum"].str.split("-").str[1].astype(int), fill_value=1
        ).round(0)
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        output.to_csv(output_file, index=False, encoding="utf-8")
        df_to_json(output, output_json=output_json, value_column="skutocnost")
        df_to_json(output, output_json=output_json.replace(".json", "_monthly.json"), value_column="skutocnost_mesiac")
        df_to_monthly_average_json(output, output_json=output_json.replace(".json", "_monthly_average.json"))
        df_to_full_year_json(output, output_json=output_json.replace(".json", "_full_year.json"))
        logger.info(f"Alcohol and tobacco income saved to {output_file}")
    else:
        logger.warning("No alcohol or tobacco income data found in any file.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Aggregate alcohol and tobacco income from CSV files.")
    parser.add_argument(
        "--input_folder", "-i", type=str, required=True, help="Path to the folder containing CSV files."
    )
    parser.add_argument(
        "--output_file", "-o", type=str, default="output/alcohol_tabaco_income.csv", help="Path to the output CSV file."
    )
    parser.add_argument(
        "--output_json",
        "-j",
        action="store_true",
        help="Output the result as JSON format suitable for frontend.",
        default="output/alcohol_tabaco_income.json",
    )
    args = parser.parse_args()
    main(args.input_folder, args.output_file, args.output_json)
