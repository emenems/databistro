export function calculateGini(incomes: number[], percentages: number[]): number {
    const population = 5430000;

    // Convert percentages to actual population numbers
    const populationCounts = percentages.map(p => Math.round((p / 100) * population));

    // Create arrays of income and population counts
    const incomeArray: number[] = [];
    for (let i = 0; i < incomes.length; i++) {
        for (let j = 0; j < populationCounts[i]; j++) {
            incomeArray.push(incomes[i]);
        }
    }

    // Calculate cumulative proportions
    const n = incomeArray.length;
    const incomeSorted = incomeArray.sort((a, b) => a - b);
    const cumsum = incomeSorted.map((sum => value => sum += value)(0));
    const totalIncome = cumsum[cumsum.length - 1];

    // Calculate Lorenz curve points
    const lorenzCurve = cumsum.map(value => value / totalIncome);
    const populationProps = Array.from({ length: n }, (_, i) => (i + 1) / n);

    // Calculate area under Lorenz curve using trapezoidal rule
    const areaUnderLorenz = lorenzCurve.reduce((acc, value, i) => {
        if (i === 0) return acc;
        return acc + (lorenzCurve[i] + lorenzCurve[i - 1]) / 2 * (populationProps[i] - populationProps[i - 1]);
    }, 0);

    // Calculate Gini coefficient
    const areaOfEquality = 0.5; // Area under the line of perfect equality
    let gini = (areaOfEquality - areaUnderLorenz) / areaOfEquality;

    // Round Gini coefficient to 3 decimal places and ensure it's between 0.0 and 1.0
    gini = Math.round(gini * 1000) / 1000;
    if (gini <= 0.0) return 0.0;
    if (gini >= 1.0) return 1.0;

    return gini;
}

export const initialIncomeValuesSK = [946, 1196, 1446, 1696, 1946, 2196, 2446, 2696, 2946, 3196, 3446, 3696, 3946, 4196];
export const initialIncomeValuesUS = [1250.0, 2083.0, 2917.0, 3750.0, 4583.0, 5417.0, 6250.0, 7083.0, 7917.0, 9375.0, 11458.0, 14583.0, 20833.0, 41667.0]
export const initialPopulationPercentagesSK = [13, 13, 15, 14, 12, 9, 6, 5, 3, 3, 1, 1, 1, 4];
export const initialPopulationPercentagesUS = [9.0, 8.1, 8.3, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 11.0, 8.0, 7.5, 4.6, 3.0];

export type Language = 'en' | 'sk';

export const translations: Record<Language, { title: string; country: string; giniCoefficient: string; averageIncome: string; medianIncome: string; note: string; percentagesWarning: string; realValues: string; populationShare: string; xAxisLabel: string; yAxisLabel: string; cumulativeXAxisLabel: string; cumulativeYAxisLabel: string; }> = {
    sk: {
        title: "Výpočet Gini koeficientu podľa vlastných hodnôt",
        giniCoefficient: "Gini koefficient",
        averageIncome: "Priemerný príjem",
        medianIncome: "Mediánový príjem",
        note: "Poznámka: Tieto hodnoty sú len približné.",
        percentagesWarning: "Percentá musia byť spolu 100%. Aktuálny súčet: ",
        realValues: "Reálne hodnoty podľa Eurostatu",
        populationShare: "Podiel obyvateľstva",
        xAxisLabel: "Rozdelenie príjmov do skupín",
        yAxisLabel: "Podiel obyvateľstva (%)",
        cumulativeXAxisLabel: "Kumulatívny príjem (rovnomerný graf = príjmová rovnosť)",
        cumulativeYAxisLabel: "Podiel z celkového príjmu (%)",
        country: "Krajina",
    },
    en: {
        title: "Calculate the Gini coefficient based on own values",
        giniCoefficient: "Gini coefficient",
        averageIncome: "Average income",
        medianIncome: "Median income",
        note: "Note: These values are only approximations.",
        percentagesWarning: "Percentages must add up to 100%. Current total: ",
        realValues: "Real values according to Eurostat",
        populationShare: "Population share",
        xAxisLabel: "Income distribution by bins",
        yAxisLabel: "Population share (%)",
        cumulativeXAxisLabel: "Cumulative income (linear increase = income equality)",
        cumulativeYAxisLabel: "Share of total income (%)",
        country: "Country",
    },
};

export const euroStatData = [
    {
      "year": 2014,
      "Bulgarsko": 0.35,
      "Česko": 0.25,
      "EU primer": 0.31,
      "Nemecko": 0.31,
      "Slovensko": 0.26
    },
    {
      "year": 2015,
      "Bulgarsko": 0.37,
      "Česko": 0.25,
      "EU primer": 0.31,
      "Nemecko": 0.3,
      "Slovensko": 0.24
    },
    {
      "year": 2016,
      "Bulgarsko": 0.38,
      "Česko": 0.25,
      "EU primer": 0.31,
      "Nemecko": 0.3,
      "Slovensko": 0.24
    },
    {
      "year": 2017,
      "Bulgarsko": 0.4,
      "Česko": 0.24,
      "EU primer": 0.3,
      "Nemecko": 0.29,
      "Slovensko": 0.23
    },
    {
      "year": 2018,
      "Bulgarsko": 0.4,
      "Česko": 0.24,
      "EU primer": 0.3,
      "Nemecko": 0.31,
      "Slovensko": 0.21
    },
    {
      "year": 2019,
      "Bulgarsko": 0.41,
      "Česko": 0.24,
      "EU primer": 0.3,
      "Nemecko": 0.3,
      "Slovensko": 0.23
    },
    {
      "year": 2020,
      "Bulgarsko": 0.4,
      "Česko": 0.24,
      "EU primer": 0.3,
      "Nemecko": 0.3,
      "Slovensko": 0.21
    },
    {
      "year": 2021,
      "Bulgarsko": 0.4,
      "Česko": 0.25,
      "EU primer": 0.3,
      "Nemecko": 0.31,
      "Slovensko": 0.22
    },
    {
      "year": 2022,
      "Bulgarsko": 0.38,
      "Česko": 0.25,
      "EU primer": 0.3,
      "Nemecko": 0.29,
      "Slovensko": 0.21
    },
    {
      "year": 2023,
      "Bulgarsko": 0.37,
      "Česko": 0.24,
      "EU primer": 0.3,
      "Nemecko": 0.29,
      "Slovensko": 0.22
    }
  ]