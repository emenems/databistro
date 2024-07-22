import yfinance as yf
import pandas as pd
import numpy as np

class StockReturnsCalculator:
    def __init__(self, ticker: str, start_date: str, end_date: str):
        self.ticker = ticker
        self.start_date = start_date
        self.end_date = end_date
        self.data = self._fetch_data()

    def _fetch_data(self):
        data = yf.download(self.ticker, start=self.start_date, end=self.end_date)
        data.sort_index(inplace=True)
        return data

    def calculate_returns(self):
        average_returns = {}
        min_returns = {}
        max_returns = {}

        for years in range(1, 11):
            rolling_returns = self.data['Adj Close'].pct_change(years * 252).dropna()
            average_returns[years] = np.round(rolling_returns.mean(),4)
            min_returns[years] = np.round(rolling_returns.min(),4)
            max_returns[years] = np.round(rolling_returns.max(),4)

        results_df = pd.DataFrame({
            'year': list(average_returns.keys()),
            'mean': list(average_returns.values()),
            'min': list(min_returns.values()),
            'max': list(max_returns.values())
        })

        return results_df
