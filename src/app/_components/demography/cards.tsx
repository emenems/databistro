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
import {
    demographySeriesDemo,
    valueFormatterMil,
    valueFormatterPercent,
    separateEU,
    separateCountry,
    findCurrentYearValue,
    getMaxYear,
    calculateDiff,
    getColor
} from '@/app/_components/demography/utils';

export async function DemographySummaryCards ( { data = demographySeriesDemo }: { data: DemographySeries[] } ) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                <DemographySummaryCard data={data} country='EU' />
                <DemographySummaryCard data={data} country='SK'/>
                <DemographyMiniGraph data={data} country="SK"/>
                <DemographyDonoughtChart data={data}/>
            </div>
        </>
    );
}

async function DemographyMiniGraph( { data = demographySeriesDemo, country = "SK" }: { data: DemographySeries[], country: string }) {
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

async function DemographySummaryCard ( { data = demographySeriesDemo, country = "SK"}: { data: DemographySeries[], country: string } ) {
    const dataCountrymaxYear = getMaxYear(data, country)
    const dataCountry = separateCountry(data, country, dataCountrymaxYear);
    let valueCountry = 0;
    if (dataCountry) {
        valueCountry = dataCountry[0]?.value

    }
    const dataDiff = calculateDiff(data, country, 1);
    const dataDiff10 = calculateDiff(data, country, 10);
    const dataDiff20 = calculateDiff(data, country, 20);
    return (
        <Card key={"demography-summary-card"+country} className='max-w-full sm:max-w-sm mx-auto'>

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

export async function DemographyDonoughtChart( { data = demographySeriesDemo}: { data: DemographySeries[] } ) {
    const dataEUmaxYear = getMaxYear(data, 'EU')
    const dataMinusEU = separateEU(data, dataEUmaxYear).dataMinusEU;
    const dataMinusEUsorted = dataMinusEU.sort((a, b) => b.value - a.value);
    const transformedData = dataMinusEUsorted.map((item: DemographySeries) => ({
        name: item.full_name,
        value: item.value,
    }));
    return (
        <Card key={"demography-donought-chart-eu"} className='max-w-full sm:max-w-sm mx-auto'>
            <div >
                <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Rozdelenie popolácie v EU podľa krajín
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
