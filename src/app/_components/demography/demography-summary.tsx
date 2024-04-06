'use client';
import {
    Card,
    DonutChart,
    SparkLineChart,
    SparkAreaChart,
    BadgeDelta
} from '@tremor/react';
import { 
    DemographySeries
} from '@/interfaces/demography';

// Auxilliary functions
function valueFormatterMil(value: number) {
    return `${(value / 1000000).toFixed(1)} mil`;
}
function valueFormatterPercent(value: number, isAbsolute: boolean = false) {
    const sign = value > 0 ? '+' : '';
    if (isAbsolute) {
        return `${sign}${value.toFixed(1)}`;
    } else {
        return `${sign}${value.toFixed(1)}%`;
    }
}
function separateEU(data: DemographySeries[], year: number) {
    const dataEU = data.filter((item) => (item.geo === 'EU' && item.year === year));
    const dataMinusEU = data.filter((item) => (item.geo !== 'EU' && item.year === year));
    return { dataEU, dataMinusEU };
}
function separateCountry(data: DemographySeries[], country: string, year: number) {
    const dataCountry = data.filter((item) => (item.geo === country && item.year === year));
    return dataCountry;
}
function findCurrentYearValue(data: DemographySeries[], country: string): number {
    const dataFiltered = data.filter((item) => item.geo === country);
    const maxYear = Math.max(...dataFiltered.map((item) => item.year));
    // return the value for the most recent year. if empty, return 0
    return dataFiltered.find((item) => item.year === maxYear)?.value || 0;
}
function getMaxYear(data: DemographySeries[], country: string) {
    const dataFiltered = data.filter((item) => item.geo === country);
    return Math.max(...dataFiltered.map((item) => item.year));
}
function calculateDiff(data: DemographySeries[], country: string, years: number = 1): number {
    const year = getMaxYear(data, country)
    const dataCountry = separateCountry(data, country, year);
    const dataCountryprevious = separateCountry(data, country, year - years);
    return dataCountry[0].value - dataCountryprevious[0].value;
}
function getColor(value: number): string {
    value *= 100; // convert to percentage
    if (value > 1) {
        return 'green';
    } else if (value >= 0.5 && value <= 1) {
        return 'lime';
    } else if (value >= 0 && value < 0.5) {
        return 'amber';
    } else {
        return 'red';
    }
}

/**
 * `DemographySummaryCards` is a component that renders a grid of `DemographySummaryCard` and `DemographyMiniGraph` components.
 * Each card represents a different country.
 *
 * @param {Object} props - The properties that define the component's behavior and display.
 * @param {DemographySeries[]} props.data - The demographic data to be displayed in the cards.
 *
 * @returns {JSX.Element} A grid of `DemographySummaryCard` and `DemographyMiniGraph` components.
 */
export async function DemographySummaryCards ( { data }: { data: DemographySeries[] } ) {
    return (
        <>
            <div className="grid grid-cols-4 gap-4 w-full">
                <DemographySummaryCard data={data} country='EU' />
                <DemographySummaryCard data={data} country='SK'/>
                <DemographyMiniGraph data={data} country="SK"/>
                <DemographyDonoughtChart data={data}/>
            </div>
        </>
    );
}

/**
 * `DemographyMiniGraph` is a component that renders a mini graph of the demographic data for a specific country.
 *
 * @param {Object} props - The properties that define the component's behavior and display.
 * @param {DemographySeries[]} props.data - The demographic data to be displayed in the mini graph.
 * @param {string} props.country - The country code of the country to be displayed.
 *
 * @returns {JSX.Element} A mini graph of the demographic data for a specific country.
 */
async function DemographyMiniGraph( { data, country}: { data: DemographySeries[], country: string }) {
    const dataCountrymaxYear = getMaxYear(data, country)
    const countryCodes = ["AT", "CZ", "HU","PL"];
    return (
        <>
            <Card key={"demography-mini-graph-parent"+country}>
                <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Susedné štáty od roku {dataCountrymaxYear-20}
                </h3>
                {countryCodes.map((countryCode) => (
                    <div className="flex items-center space-x-2.5" key={"demography-mini-graph-"+countryCode}>
                        <div className="flex items-center space-x-2.5">
                            <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">{countryCode}</p>
                        </div>
                        <SparkLineChart 
                            data={data.filter((item) => item.geo === countryCode)}
                            categories={['value']}
                            index={"year"}
                            autoMinValue={true}
                        />
                        <div className="flex items-center space-x-2.5">
                            <span className="font-medium text-white">
                                <BadgeDelta
                                   deltaType={calculateDiff(data, countryCode, 20)>0 ? "moderateIncrease" : "moderateDecrease"} 
                                   isIncreasePositive={true}
                                   size="xs"
                                >
                                    {valueFormatterPercent(100 * calculateDiff(data, countryCode, 20) / findCurrentYearValue(data, countryCode))}
                                </BadgeDelta>
                            </span>
                        </div>
                    </div>
                ))}
            </Card>
        </>
    );
}

/**
 * `DemographySummaryCard` is a component that renders a card with a summary of the demographic data for a specific country.
 *
 * @param {Object} props - The properties that define the component's behavior and display.
 * @param {DemographySeries[]} props.data - The demographic data to be displayed in the card.
 * @param {string} props.country - The country code of the country to be displayed.
 *
 * @returns {JSX.Element} A card with a summary of the demographic data for a specific country.
 */
async function DemographySummaryCard ( { data, country }: { data: DemographySeries[], country: string } ) {
    const dataCountrymaxYear = getMaxYear(data, country)
    const dataCountry = separateCountry(data, country, dataCountrymaxYear);
    const valueCountry = dataCountry[0].value
    const dataDiff = calculateDiff(data, country, 1);
    const dataDiff10 = calculateDiff(data, country, 10);
    const dataDiff20 = calculateDiff(data, country, 20);
    return (
        <Card key={"demography-summary-card"+country} className='max-w-sm mx-auto'>

            <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Celková populácia v {country}  za rok {dataCountrymaxYear}
            </h3>
            <p className="mt-1 text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {valueFormatterMil(valueCountry)}
            </p>
            <p className="mt-1 text-tremor-default font-medium">
                <span className={`text-${getColor(dataDiff/valueCountry)}-700 dark:text-${getColor(dataDiff/valueCountry)}-500`}>
                    {dataDiff >0 ? `+`+valueFormatterMil(dataDiff) : valueFormatterMil(dataDiff)}
                </span>{' '}
                <span className="font-normal text-tremor-content dark:text-dark-tremor-content">
                    oproti roku {dataCountrymaxYear - 1} {' '}
                    {`(`+valueFormatterPercent(100*dataDiff/valueCountry)+`)`}
                </span>
                </p>
            <p className="mt-1 text-tremor-default font-medium">
                <span className={`text-${getColor(dataDiff10/valueCountry)}-700 dark:text-${getColor(dataDiff10/valueCountry)}-500`}>
                    {dataDiff10 >0 ? `+`+valueFormatterMil(dataDiff10) : valueFormatterMil(dataDiff10)}
                </span>{' '}
                <span className="font-normal text-tremor-content dark:text-dark-tremor-content">
                    oproti roku {dataCountrymaxYear - 10} {' '}
                    {`(`+valueFormatterPercent(100*dataDiff10/valueCountry)+`)`}
                </span>
            </p>
            <p className="mt-1 text-tremor-default font-medium">
                <span className={`text-${getColor(dataDiff20/valueCountry)}-700 dark:text-${getColor(dataDiff20/valueCountry)}-500`}>
                    {dataDiff20 >0 ? `+`+valueFormatterMil(dataDiff20) : valueFormatterMil(dataDiff20)}
                </span>{' '}
                <span className="font-normal text-tremor-content dark:text-dark-tremor-content">
                    oproti roku {dataCountrymaxYear - 20} {' '}
                    {`(`+valueFormatterPercent(100*dataDiff20/valueCountry)+`)`}
                </span>
            </p>
            <div className="w-full mt-2">
                <SparkAreaChart className='w-full'
                    data={data.filter((item) => item.geo === country)}
                    categories={['value']}
                    index={"year"}
                    autoMinValue={true}
                />
            </div>
        </Card>
    );
}


/**
 * `DemographyDonoughtChart` is a component that renders a DonutChart with demographic data.
 *
 * @param {Object} props - The properties that define the component's behavior and display.
 * @param {DemographySeries[]} props.data - The demographic data to be displayed in the chart.
 *
 * @returns {JSX.Element} A DonutChart component with demographic data.
 */
export async function DemographyDonoughtChart( { data }: { data: DemographySeries[] } ) {
    const dataEUmaxYear = getMaxYear(data, 'EU')
    const dataMinusEU = separateEU(data, dataEUmaxYear).dataMinusEU;
    const dataMinusEUsorted = dataMinusEU.sort((a, b) => b.value - a.value);
    const transformedData = dataMinusEUsorted.map((item: DemographySeries) => ({
        name: item.full_name,
        value: item.value,
    }));
    return (
        <Card key={"demography-donought-chart-eu"} className='max-w-sm mx-auto'>
            <div >
                <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Rozdelenie popolácie v EU
                </h3>
                <div >
                    <DonutChart
                        className='mt-4'
                        data={transformedData}
                        index="name"
                        category='value'
                        valueFormatter={valueFormatterMil}
                        label={'rok 2023'}
                    />
                </div>
            </div>
        </Card>
    );
}
