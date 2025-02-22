import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from datetime import datetime

def fetch_html(url):
    """Function to fetch the HTML content of the webpage"""
    response = requests.get(url)
    response.raise_for_status()
    return response.text

def extract_yearly_page_link(html, year):
    """Function to parse the HTML and extract CSV file links from a yearly page"""
    soup = BeautifulSoup(html, 'html.parser')
    yearly_link = None
    
    # Find the <a> tag that contains the year of interest
    for link in soup.find_all('a', href=True):
        if link.text.strip() == str(year):
            yearly_link = link['href']
            break
    
    return yearly_link


def download_csv_files(csv_links, download_dir="_data/krimianalytika/raw"):
    """Function to download CSV files"""
    
    # Create the download directory if it doesn't exist
    os.makedirs(download_dir, exist_ok=True)
    files_downloaded = []
    for link in csv_links:
        file_name = os.path.join(download_dir, os.path.basename(link))
        
        print(f"Downloading {link}...")
        response = requests.get(link)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        with open(file_name, 'wb') as file:
            file.write(response.content)
        files_downloaded.append(file_name)
        print(f"Saved to {file_name}")
    return files_downloaded

def get_crime_statistics_href(url):
    """Function to extract the link to the CSV file from the yearly page/table"""
    response = requests.get(url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, "html.parser")

    tables = soup.find_all("table")
    
    for table in tables:
        rows = table.find_all("tr")
        if rows:
            last_row = rows[-1]  # Get the last row
            secocnd_column = last_row.find_all("td")[1]
            if secocnd_column:
                link = secocnd_column.find("a")
                if link and "href" in link.attrs:
                    return link["href"]
    
    return None

def load_and_clean_data(file):
    """
    Loads the CSV file, cleans and converts numeric columns.
    """
    df = pd.read_csv(file, encoding="cp1250", sep=",", skiprows=6)
    # Keep only the first three non-Unnamed columns
    df = df[[col for col in df.columns if "Unnamed" not in col][:3]]
    df = df.dropna()
    df = df[df['Druh kriminality'].apply(lambda x: x.replace(' ', '')) != '']
    for col in df.columns[1:]:
        df[col] = df[col].apply(lambda x: x.replace(' ', ''))
        df[col] = df[col].apply(lambda x: x.replace('\xa0', ''))
        df[col] = df[col].apply(lambda x: '0' if x == '' else x).astype(int)
    return df

def process_main_categories(df):
    """
    Extracts and cleans main categories:
     - Rows with names in all upper-case
     - Excludes rows containing 'SPOLU'
     - Cleans up the name.
    """
    main_cat = df[df['Druh kriminality'].apply(lambda x: x.isupper())]
    main_cat = main_cat[~main_cat['Druh kriminality'].str.contains('SPOLU')]
    # Clean up: remove double spaces, trailing spaces, set to lowercase
    main_cat = main_cat.copy()
    main_cat['Druh kriminality'] = main_cat['Druh kriminality'].apply(
        lambda x: x.replace('  ', ' ').strip().lower().split(' ')[0]
    )
    return main_cat

def process_sub_categories(df):
    """
    Extracts sub-categories: rows that are not all uppercase and do not contain " - ".
    """
    temp_sub = df[~df['Druh kriminality'].apply(lambda x: x.isupper())]
    sub_cat = temp_sub[~temp_sub['Druh kriminality'].str.contains(' - ')]
    return sub_cat

def process_sub_sub_categories(df):
    """
    Extracts sub-sub-categories: rows that are not main categories, excluding a specific string,
    then for each row with ' - ', constructs a new row including a parent category.
    """
    temp_sub = df[~df['Druh kriminality'].apply(lambda x: x.isupper())]
    temp_sub = temp_sub[~temp_sub['Druh kriminality'].str.contains('škoda značná a vyššia')]
    temp_sub = temp_sub.reset_index(drop=True)
    
    sub_sub_cat = pd.DataFrame()
    name_parent = ""
    for i, row in temp_sub.iterrows():
        if ' - ' in row['Druh kriminality']:
            name_item = row['Druh kriminality'].split(' - ')[1].strip().lower()
            # Use the last stored name_parent; if not set, simply use name_item
            new_name = f"{name_parent} - {name_item}" if name_parent else name_item
            sub_sub_cat = pd.concat([
                sub_sub_cat,
                pd.DataFrame({
                    'Druh kriminality': [new_name],
                    'Zistené': [row['Zistené']],
                    'Objasnené': [row['Objasnené']]
                })
            ], ignore_index=True)
        else:
            # Update name_parent for later sub-sub-categories
            name_parent = row['Druh kriminality'].split(' ')[0]
    return sub_sub_cat

def combine_categories(main_cat, sub_cat, sub_sub_cat):
    """
    Combines the three categories adding a level indicator.
    Level 0 for main categories, 1 for sub-categories and 2 for sub-sub-categories.
    """
    main_cat = main_cat.assign(level=0)
    sub_cat = sub_cat.assign(level=1)
    sub_sub_cat = sub_sub_cat.assign(level=2)
    
    combined = pd.concat([main_cat, sub_cat, sub_sub_cat], ignore_index=True)
    combined['Druh kriminality'] = combined['Druh kriminality'].apply(lambda x: x.replace('  ', ' ').strip())
    return combined.reset_index(drop=True)

def save_output(df, path='_data/krimianalytika/interim/test.csv'):
    """
    Saves the DataFrame to a CSV file.
    """
    df.to_csv(path, index=False)

def process_crime_data(file):
    """
    Full processing pipeline:
      1. Load and clean CSV data from file.
      2. Process main categories, sub-categories and sub-sub-categories.
      3. Combine them and return the final DataFrame.
    """
    df = load_and_clean_data(file)
    # Optional: Save cleaned version if needed
    df.to_csv('_data/krimianalytika/interim/test.csv', index=False)
    
    main_cat = process_main_categories(df)
    sub_cat = process_sub_categories(df)
    sub_sub_cat = process_sub_sub_categories(df)
    combined = combine_categories(main_cat, sub_cat, sub_sub_cat)
    return combined


def main():
    """Main function to execute the script"""
    base_url = "https://www.minv.sk/"
    crime_url_suffix = "?statistika-kriminality-v-slovenskej-republike-csv"
    html_content = fetch_html(base_url+crime_url_suffix)
    all_csv_links = []
    all = pd.DataFrame()
    for year in range(2012,datetime.now().year+1):
        # print(f"Extracting links for year {year}...")
        yearly_link = extract_yearly_page_link(html_content, year)
        # print(f"Found yearly page: {yearly_link}")
        yearly_page_url = base_url + yearly_link
        csv_link = get_crime_statistics_href(yearly_page_url)
        if csv_link:
            all_csv_links.append((base_url+csv_link))
            print(f"Found {csv_link} CSV files for year {year}")
        else:
            print(f"No CSV files found for year {year}")
    
    files = download_csv_files(all_csv_links)

    for file in files:
        print(f"Clearning up file: {file}")
        df = process_crime_data(file)
        year = re.search(r"(\d{4})", file).group(1)
        df = df.assign(year=int(year))
        save_output(df, path=f'_data/krimianalytika/interim/sk_crime_data{year}.csv')
        all = pd.concat([all, df], ignore_index=True)

    save_output(all, path='_data/krimianalytika/interim/sk_crime_data_all.csv')

if __name__ == "__main__":
    main()


