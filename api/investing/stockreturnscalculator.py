import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime


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

        years_range = (
            datetime.strptime(self.end_date, "%Y-%m-%d").year - datetime.strptime(self.start_date, "%Y-%m-%d").year + 1
        )
        for years in range(1, years_range):
            rolling_returns = self.data["Close"].pct_change(years * 252).dropna()
            if rolling_returns.mean().item():
                average_returns[years] = float(np.round(rolling_returns.mean(), 4)[self.ticker])
                min_returns[years] = float(np.round(rolling_returns.min(), 4)[self.ticker])
                max_returns[years] = float(np.round(rolling_returns.max(), 4)[self.ticker])

        results_df = pd.DataFrame(
            {
                "year": list(average_returns.keys()),
                "mean": list(average_returns.values()),
                "min": list(min_returns.values()),
                "max": list(max_returns.values()),
            }
        )

        return results_df
