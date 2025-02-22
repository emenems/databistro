import pandas as pd
import numpy as np

import pandas as pd

def load_data(file_input, filter_level=1):
    """
    Load data from a CSV file and filter it based on the 'level' column.
    
    Parameters:
    file_input (str): The path to the CSV file.
    
    Returns:
    pd.DataFrame: The filtered DataFrame.
    """
    df = pd.read_csv(file_input, sep=',', encoding='utf-8')
    df = df.query(f"level=={filter_level}")
    return df

def prep_data(df):
    """
    Prepare the data by pivoting the DataFrame and selecting desired columns.
    
    Parameters:
        df (pd.DataFrame): The DataFrame to be prepared.
    
    Returns:
        tuple: A tuple containing the original DataFrame and the pivoted DataFrame.
    """
    # Pivot the dataframe so that "year" becomes the index (later renamed to date) and
    # columns are the crime categories with their respective 'Zistené' values.
    pivot_df = df.pivot(index='year', columns='Druh kriminality', values='Zistené').reset_index()
    pivot_df.rename(columns={'year': 'date'}, inplace=True)
    
    wanted = [
        'date', 'dopravné nehody cestné', 'drogy', 'korupcia', 'krádež',
        'krádeže ostatné', 'krádeže vlámaním', 'lúpeže',
        'nedovolené ozbrojovanie', 'násilie na verej.činit.',
        'obchodovanie s ľuďmi',
        'ohroz. pod vplyvom návyk.látok',
        'organizovaný zločin', 'ostatné majetkové', 'podvod',
        'pohlavné zneužívanie', 'požiare a výbuchy',
        'skrátenie dane', 'sprenevera',
        'vraždy', 'výtržníctvo', 'znásilnenie',
        'úmyslené ublíženie na zdraví'
    ]
    pivot_df = pivot_df[wanted]

    return df, pivot_df

def percent_change(year, df):
    """
    Calculate the percentage change in each crime category comparing the given year with the previous year.
    
    Parameters:
      year (int or float): The year for which to calculate the percentage change.
      df (pd.DataFrame): The pivoted DataFrame with a "date" column and crime category columns.
    
    Returns:
      pd.DataFrame: A one-row DataFrame with the percentage change for each crime category.
    """
    # Ensure the dataframe is sorted by date.
    df = df.sort_values(by='date')
    
    current = df[df['date'] == year]
    previous = df[df['date'] == (year - 1)]
    
    if current.empty or previous.empty:
        raise ValueError(f"Data for year {year} or {year-1} is not available.")
    
    current = current.iloc[0]
    previous = previous.iloc[0]
    changes = {}
    for col in df.columns:
        if col == 'date':
            continue
        prev_value = previous[col]
        curr_value = current[col]
        # Avoid division by zero.
        if prev_value == 0:
            pct = np.nan
        else:
            pct = ((curr_value - prev_value) / prev_value) * 100
        changes[col] = round(pct, 2)
    result = pd.DataFrame(changes, index=[year])
    result.insert(0, 'Year', year)
    return result

def compute_trend(pivot_df):
    """
    Compute trend metrics for each crime category.
    
    Parameters:
        pivot_df (pd.DataFrame): The pivoted DataFrame.
    
    Returns:
        pd.DataFrame: A DataFrame containing the trend metrics for each crime category.
    """
    trend_results_data = []
    for col in pivot_df.columns:
        if col == 'date':
            continue
        x = pivot_df['date'].astype(float)
        y = pivot_df[col].astype(float)
        m, b = np.polyfit(x, y, 1)
        fitted = m * x + b
        rmse = np.sqrt(np.mean((y - fitted) ** 2))
        # Compute R² (coefficient of determination).
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        ss_res = np.sum((y - fitted) ** 2)
        r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else np.nan
        trend_results_data.append({
            'Category': col,
            'Slope': m,
            'RMSE': rmse,
            'R2': r2
        })
    return pd.DataFrame(trend_results_data).round(2).sort_values(by='Slope', ascending=False)

def compute_percent_change(pivot_df):
    """
    Compute the percentage change from the previous year for each crime category.
    
    Parameters:
        pivot_df (pd.DataFrame): The pivoted DataFrame.
    
    Returns:
        pd.DataFrame: A DataFrame containing the percentage change for each crime category.
    """
    percent_change_df = pivot_df.set_index('date').pct_change() * 100
    percent_change_df.reset_index(inplace=True)
    
    last_year = pivot_df['date'].max()
    last_change = percent_change_df[percent_change_df['date'] == last_year]
    
    last_change = last_change.drop(columns='date').transpose().round(0)
    last_change.columns = [last_year]
    last_change = last_change.rename(columns={last_year: 'Change'})
    last_change = last_change.sort_values(by="Change", ascending=False)
    
    return last_change

def convert_dataframe_to_list_of_dicts(df, col='Zistené'):
    crime_type_mapping = {
        'majetková': 'Majetková',
        'ekonomická': 'Ekonomická',
        'násilná': 'Násilná',
        'mravnostná': 'Mravnostná',
        'ostatná': 'Ostatná',
        'zostávajúca': 'Zostávajúca',
        'celková': 'Celková'
    }
    
    result = []
    grouped = df.groupby('year')
    
    for year, group in grouped:
        year_dict = {'date': str(year)}
        for _, row in group.iterrows():
            crime_type = row['Druh kriminality']
            if crime_type in crime_type_mapping:
                key = crime_type_mapping[crime_type]
                if col == 'diff':
                    year_dict[key] = int(np.round(((row['Objasnené'])/row['Zistené'])*100,0))
                else:
                    year_dict[key] = row[col]
        
        result.append(year_dict)
    
    return result

def convert_dataframe_to_data_table(df):
    """
    Converts a DataFrame to a list of dictionaries matching the DataItem interface.
    
    Parameters:
    df (pd.DataFrame): The input DataFrame.
    
    Returns:
    list: A list of dictionaries matching the DataItem interface.
    """
    data_items = []
    for index, row in df.iterrows():
        data_item = {
            'id': index + 1,
            'year': str(row['year']),
            'category': row['Druh kriminality'].title(),
            'registered': row['Zistené'],
            'explained': row['Objasnené']
        }
        data_items.append(data_item)
    return data_items


# Compute
if __name__ == '__main__':
    file_input = '_data/krimianalytika/interim/sk_crime_data_all.csv'
    df1 = load_data(file_input, filter_level=1)
    df0 = load_data(file_input, filter_level=0)
    df, pivot_df = prep_data(df1)
    trend_results_df = compute_trend(pivot_df)
    dfx = df0[df0['Druh kriminality']=='celková']
    dfx = dfx.assign(objasnenost = dfx['Objasnené']/dfx['Zistené']*100)
    trend_objasnenost = compute_trend(dfx.rename(columns={'year':'date'})[['date','objasnenost']])
    last_change = compute_percent_change(pivot_df)

    # Print the results
    print("Yearly data (dataYearly):")
    print(pivot_df.to_dict(orient='records'))
    print("\n\nTrend results:")
    print(trend_results_df)
    print("\n\nTrend results objasnenost:")
    print(trend_objasnenost)
    print("\n\nLast year change (dataChange):")
    print(last_change.to_dict()['Change'])
    print("\n\nTotal crime time series (data):")
    print(convert_dataframe_to_list_of_dicts(df0, col='Zistené'))
    print("\n\nTotal crime time series (dataSolved):")
    print(convert_dataframe_to_list_of_dicts(df0, col='Objasnené'))
    print("\n\nTotal crime time series (dataDiff):")
    print(convert_dataframe_to_list_of_dicts(df0, col='diff'))
    print("\n\nTotal crime table (dataTable):")
    print(convert_dataframe_to_data_table(df0))

