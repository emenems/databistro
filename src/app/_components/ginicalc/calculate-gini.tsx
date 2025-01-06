'use client'
import { useState, useMemo } from 'react';
import { Card, LineChart, BarChart, NumberInput, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Select, SelectItem } from '@tremor/react';
// import { RiMoneyEuroCircleLine, RiDiscountPercentLine } from '@remixicon/react';
import { Language, translations, calculateGini, initialIncomeValuesSK, initialPopulationPercentagesSK, initialIncomeValuesUS, initialPopulationPercentagesUS, euroStatData } from './utils';

export default function GiniCalc() {
    const [language, setLanguage] = useState('sk');
    const [incomeValues, setIncomeValues] = useState(initialIncomeValuesSK);

    const [populationPercentages, setPopulationPercentages] = useState(initialPopulationPercentagesSK);

    const handleIncomeChange = (index: number, value: number) => {
        const newIncomeValues = [...incomeValues];
        newIncomeValues[index] = value;
        setIncomeValues(newIncomeValues);
    };

    const handlePercentageChange = (index: number, value: number) => {
        const newPopulationPercentages = [...populationPercentages];
        newPopulationPercentages[index] = value;
        setPopulationPercentages(newPopulationPercentages);
    };

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        if (value === 'sk') {
            setIncomeValues(initialIncomeValuesSK);
            setPopulationPercentages(initialPopulationPercentagesSK);
        } else {
            setIncomeValues(initialIncomeValuesUS);
            setPopulationPercentages(initialPopulationPercentagesUS);
        }
    };

    const chartData = incomeValues.map((income, index) => ({
        income,
        percentage: populationPercentages[index],
    }));

    const totalPercentage = useMemo(() => {
        return populationPercentages.reduce((acc, percentage) => acc + percentage, 0);
    }, [populationPercentages]);

    const weightedAverageIncome = useMemo(() => {
        const totalPercentage = populationPercentages.reduce((acc, percentage) => acc + percentage, 0);
        const weightedSum = incomeValues.reduce((acc, income, index) => acc + (income * populationPercentages[index]), 0);
        return weightedSum / totalPercentage;
    }, [incomeValues, populationPercentages]);

    const medianIncome = useMemo(() => {
        const sortedData = chartData
            .map((data, index) => ({ ...data, cumulativePercentage: populationPercentages.slice(0, index + 1).reduce((acc, percentage) => acc + percentage, 0) }))
            .sort((a, b) => a.income - b.income);

        const below50 = sortedData.find(data => data.cumulativePercentage >= 50);
        const above50 = sortedData.reverse().find(data => data.cumulativePercentage <= 50);
        if (below50 && above50 && below50.cumulativePercentage !== 50) {
            const weight = (50 - above50.cumulativePercentage) / (below50.cumulativePercentage - above50.cumulativePercentage);
            return above50.income + weight * (below50.income - above50.income);
        }

        return below50?.income || 0;
    }, [chartData, populationPercentages]);

    const t = translations[language as Language];

    const giniCoefficient = useMemo(() => {
        return calculateGini(incomeValues, populationPercentages);
    }, [incomeValues, populationPercentages]);

    const cumulativeChartData = useMemo(() => {
        const cumulativeIncome = incomeValues.map((income, index) => ({
            cumulativePercentage: (populationPercentages.slice(0, index + 1).reduce((acc, percentage) => acc + percentage, 0)).toFixed(1),
            cumIncome: incomeValues.slice(0, index + 1).reduce((acc, income) => acc + income, 0),
            cumIncomeShare: 100*incomeValues.slice(0, index + 1).reduce((acc, income) => acc + income, 0) / incomeValues.reduce((acc, income) => acc + income, 0),
        }));
        return cumulativeIncome;
    }, [incomeValues, populationPercentages]);

    type CustomTooltipTypeBar = {
        payload: any;
        active: boolean | undefined;
        label: any;
    };
    
    const customTooltip = (props: CustomTooltipTypeBar) => {
        const { payload, active } = props;
        if (!active || !payload) return null;
        return (
          <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
            {payload.map((category: any, idx: number) => (
              <div key={idx} className="flex flex-1 space-x-2.5">
                <div
                  className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
                />
                <div className="space-y-1">
                  <p className="text-tremor-content">{t.populationShare}</p>
                  <p className="font-medium text-tremor-content-emphasis">
                    {category.value}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
    };
    const customTooltipCumulative = (props: CustomTooltipTypeBar) => {
        const { payload, active } = props;
        if (!active || !payload) return null;
        return (
          <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
            {payload.map((category: any, idx: number) => (
              <div key={idx} className="flex flex-1 space-x-2.5">
                <div
                  className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
                />
                <div className="space-y-1">
                  <p className="text-tremor-content">{t.cumulativeYAxisLabel}</p>
                  <p className="font-medium text-tremor-content-emphasis">
                    {category.value.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
    };

    const euroStatData2023 = euroStatData.find((data) => data.year === 2023);
    const euroStatTableData = euroStatData2023 ? Object.entries(euroStatData2023).filter(([key]) => key !== 'year').map(([country, giniIndex]) => ({ country, giniIndex })) : [];
    const euroStatTableDataSorted = euroStatTableData.sort((a, b) => a.giniIndex - b.giniIndex);

    return (
        <>
            <div className="max-w-32 min-w-34 w-32 justify-end mb-4">
                <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectItem value="sk">Slovakia (SK)</SelectItem>
                    <SelectItem value="en">English (US)</SelectItem>
                </Select>
            </div>
            <h2 className="text-2xl font-bold mb-4 ml-0 text-center">
                {t.title}
            </h2>
            {totalPercentage !== 100 ? (
                <>
                    <h3 className="text-xl font-medium mb-4 ml-0 text-center">
                        {t.percentagesWarning} {totalPercentage}%
                    </h3>
                    <p className="text-base font-light mb-4 ml-0 text-center">
                        {t.averageIncome}: -
                    </p>
                    <h3 className="text-base font-light mb-4 ml-0 text-center">
                        {t.medianIncome}: - 
                    </h3>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-medium mb-4 ml-0 text-center">
                        {t.giniCoefficient}<sup>*</sup>: {giniCoefficient.toFixed(3)}
                    </h3>
                    <h3 className="text-base font-light mb-4 ml-0 text-center">
                        {t.averageIncome}<sup>**</sup>: {weightedAverageIncome.toFixed(2)} €
                    </h3>
                    <h3 className="text-base font-light mb-4 ml-0 text-center">
                        {t.medianIncome}<sup>**</sup>: {medianIncome.toFixed(2)} €
                    </h3>
                </>
            )}
            <div className="mx-auto mt-8">
                <Table>
                    <TableHead>
                        <TableRow>
                            {incomeValues.map((_, index) => (
                                <TableHeaderCell key={index} className="text-center text-tremor-label">{index + 1}. €/%</TableHeaderCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {incomeValues.map((income, index) => (
                                <TableCell key={index} className="text-center text-tremor-label w-24 min-w-24 max-w-24">
                                    <NumberInput
                                        id={`income-${index}`}
                                        name={`income-${index}`}
                                        value={income}
                                        onChange={(e) => handleIncomeChange(index, parseFloat(e.target.value))}
                                        className="mt-0 w-20 min-w-20 max-w-20 text-tremor-label"
                                        required
                                        // icon={RiMoneyEuroCircleLine}
                                        min={0}
                                        step={50}
                                        enableStepper={false}
                                        placeholder='€'
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {populationPercentages.map((percentage, index) => (
                                <TableCell key={index} className="text-center text-tremor-label w-24 min-w-24 max-w-24">
                                    <NumberInput
                                        id={`percentage-${index}`}
                                        name={`percentage-${index}`}
                                        value={percentage}
                                        onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value))}
                                        className="mt-0 w-20 min-w-20 max-w-20 text-tremor-label"
                                        required
                                        // icon={RiDiscountPercentLine}
                                        min={0}
                                        max={100}
                                        step={1}
                                        enableStepper={false}
                                        placeholder='%'
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
                <p className="text-center text-sm text-gray-500 mt-2">
                    {t.explain}
                </p>
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-8">
                <div className="lg:w-1/2 p-3">
                    <h3 className="text-base font-light mb-4 ml-0 text-center">
                        {t.xAxisLabel}
                    </h3>
                    <BarChart
                        data={chartData}
                        index="income"
                        categories={['percentage']}
                        colors={['blue']}
                        customTooltip={customTooltip}
                        yAxisWidth={48}
                        showLegend={false}
                        // xAxisLabel={t.xAxisLabel}
                        yAxisLabel={t.yAxisLabel}
                    />
                </div>
                <div className="lg:w-1/2 p-3">
                    <h3 className="text-base font-light mb-4 ml-0 text-center">
                        {t.cumulativeXAxisLabel}
                    </h3>
                    <BarChart
                        data={cumulativeChartData}
                        index="cumulativePercentage"
                        categories={['cumIncomeShare']}
                        customTooltip={customTooltipCumulative}
                        yAxisWidth={48}
                        showLegend={false}
                        // xAxisLabel={t.cumulativeXAxisLabel}
                        yAxisLabel={t.cumulativeYAxisLabel}
                    />
                </div>
            </div>
            <h2 className="text-2xl font-bold mt-12 text-center">
                {t.realValues}
            </h2>
            <div className="flex flex-col lg:flex-row justify-between mt-8">
                <div className="lg:w-1/2 p-3">
                    <LineChart
                    className="h-80"
                    data={euroStatData}
                    index="year"
                    categories={['Slovensko', 'Bulgarsko', 'Česko', 'Nemecko', 'EU primer']}
                    colors={['blue', 'pink', 'yellow', 'green', 'gray']}
                    //   valueFormatter={dataFormatter}
                    yAxisWidth={60}
                    onValueChange={(v) => console.log(v)}
                    />
                </div>
                <div className="lg:w-1/2 p-3">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell className="text-center">{t.country}</TableHeaderCell>
                            <TableHeaderCell className="text-center">Gini Index 2023</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {euroStatTableDataSorted.map((data, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{data.country}</TableCell>
                                <TableCell className="text-center">{data.giniIndex}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </div>
        </>
    );
}