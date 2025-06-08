"""This script downloads PDF files from the Slovak financial administration website for specified years
using https://www.financnasprava.sk/sk/infoservis/statistiky/plnenie-statneho-rozpoctu

Example usage:

>>> python tax_income_download_pdfs.py --start-year 2010 --end-year 2025

"""

import argparse
import logging
import re
import requests
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def generate_year_url(year: int) -> str:
    """
    Generate a URL for the given year based on the identified pattern.

    Args:
        year: The year for which to generate the URL.

    Returns:
        The generated URL.

    Raises:
        ValueError: If the URL pattern for the given year is not available.
    """
    base_url = "https://www.financnasprava.sk/sk/infoservis/statistiky/plnenie-statneho-rozpoctu/_1/D%c3%a1tum%20publikovania/MTA=/NjQ=/"
    year_to_segment = {
        2010: "ODI=",
        2011: "ODM=",
        2012: "ODQ=",
        2013: "Njc=",
        2014: "Njg=",
        2015: "Njk=",
        2016: "NzA=",
        2017: "NzE=",
        2018: "NzI=",
        2019: "NzM=",
        2020: "NzQ=",
        2021: "NzU=",
        2022: "NzY=",
        2023: "Nzc=",
        2024: "OTg=",
        2025: "MTA0",
    }
    segment = year_to_segment.get(year)
    if segment is None:
        raise ValueError(f"URL pattern for the year {year} is not available.")
    return f"{base_url}{segment}/MQ==/NTA=/bnVsbA==/opb"


def extract_pdf_urls(text: str) -> list[str]:
    """
    Extract all PDF URLs from the given text that match the pattern.

    The pattern matches URLs ending with variations like "SR_YYYY_MM.pdf",
    where "SR" is case-insensitive, and may include parts like "_dan".

    Args:
        text: The text to search for PDF URLs.

    Returns:
        A list of extracted PDF URLs.
    """
    pattern = r'https://www\.financnasprava\.sk/[^"]*?(?:[sS][rR]_)?(?:\d{4}_)?\d{2}(?:_dan)?\.pdf'
    return re.findall(pattern, text, re.IGNORECASE)


def download_pdf(url: str, output_dir: str = "pdfs") -> None:
    """
    Download a PDF from the given URL and save it to the specified directory, if it doesn't already exist.

    Args:
        url: The URL of the PDF to download.
        output_dir: The directory to save the PDF.

    Raises:
        requests.exceptions.RequestException: If the download fails.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    filename = url.split("/")[-1]
    file_path = output_path / filename
    if file_path.exists():
        logging.info(f"File already exists: {filename}")
        return
    response = requests.get(url)
    response.raise_for_status()
    with open(file_path, "wb") as f:
        f.write(response.content)
    logging.info(f"Downloaded: {filename}")


def process_year(year: int, download_to: str) -> None:
    """
    Process a single year: generate URL, fetch page, extract PDF URLs, and download them.

    Args:
        year: The year to process.
        download_to: The directory to save downloaded PDFs.
    """
    try:
        url = generate_year_url(year)
        logging.info(f"Fetching PDF URLs for year {year} from {url}")
        response = requests.get(url)
        response.raise_for_status()
        pdf_urls = extract_pdf_urls(response.text)
        if not pdf_urls:
            logging.warning(f"No PDF URLs found for year {year}.")
            return
        logging.info(f"Found {len(pdf_urls)} PDF URLs for year {year}.")
        for pdf_url in pdf_urls:
            try:
                download_pdf(pdf_url, download_to)
            except requests.exceptions.RequestException as e:
                logging.error(f"Failed to download {pdf_url}: {e}")
    except ValueError as e:
        logging.error(f"Error for year {year}: {e}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to fetch data for year {year}: {e}")


def main(start_year: int, end_year: int, download_to: str) -> None:
    """
    Process PDF downloads for the specified range of years.

    Args:
        start_year: The starting year for processing (inclusive).
        end_year: The ending year for processing (inclusive).
        download_to: The directory to save downloaded PDFs.

    Raises:
        ValueError: If start_year is greater than end_year.
    """
    if start_year > end_year:
        raise ValueError("start_year must not be greater than end_year")
    for year in range(start_year, end_year + 1):
        process_year(year, download_to)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download PDFs for specified years from financnasprava.sk")
    parser.add_argument("--start-year", type=int, default=2010, help="Start year for downloading PDFs (default: 2010)")
    parser.add_argument("--end-year", type=int, default=2025, help="End year for downloading PDFs (default: 2025)")
    parser.add_argument(
        "--download-to", type=str, default="pdfs", help="Directory to save downloaded PDFs (default: pdfs)"
    )
    args = parser.parse_args()
    try:
        main(args.start_year, args.end_year, args.download_to)
    except ValueError as e:
        logging.error(f"Invalid input: {e}")
        exit(1)
