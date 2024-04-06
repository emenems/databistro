'use client';

import {
    Card,
    CategoryBar,
    LineChart,
    TabPanel,
    TabPanels,
    TabGroup,
    TabList,
    Tab,
    Metric,
    AreaChart,
} from '@tremor/react';

import { DemographySeries, DemographySeriesAge } from '@/interfaces/demography';

function valueFormatterPercent(value: number) {
    return `${value.toFixed(1)}%`;
}
function valueFormatterAge(value: number) {
    return `${value.toFixed(0)} rokov`;
}
function fitAgeCategory(dataAge: DemographySeriesAge[], country: string) {
    const ageRanges = ["0-14", "15-19", "20-39", "40-59", "60-64", "65-79"];
    const ageValues = ageRanges.map(age => parseFloat(filterCountry(dataAge, country, age).value.toFixed(0)))
    // add the last as the sum of all minus 100 to fix exact 100% in the chart
    ageValues.push(100 - ageValues.reduce((acc, curr) => acc + curr, 0));
    const ageValuesRound = ageValues.map((v) => Math.round(v));
    return ageValuesRound;
};

function filterCountry(data: DemographySeriesAge[] | DemographySeries[], country: string, ageRange: string = "median") {
    let ageData = data;
    if (ageRange !== 'median') {
        const [ageFrom, ageTo] = ageRange.split('-').map(Number);
        ageData = data.filter((d) => d.age_from === ageFrom && d.age_to === ageTo);
    }
    const dataCountry = ageData.filter((d) => d.geo === country);
    const dataCountrymaxYear = dataCountry.reduce((acc, curr) => {
        return acc.year > curr.year ? acc : curr;
    });
    return dataCountrymaxYear;
}

function transformAgeSeries (data: DemographySeriesAge[] | DemographySeries[], ageRange: string) {
    let seriesFilteredAgeTo = data;

    if (ageRange !== 'median') {
        const [ageFrom, ageTo] = ageRange.split('-').map(Number);
        const seriesFilteredAgeFrom = data.filter((d) => d.age_from === ageFrom);
        seriesFilteredAgeTo = seriesFilteredAgeFrom.filter((d) => d.age_to === ageTo);
    }

    const seriesTransformed = seriesFilteredAgeTo.map((d) => {
        return {
            year: d.year,
            [d.geo]: d.value
        }
    });

    const combinedList = seriesTransformed.reduce((acc, curr) => {
        const existingYear = acc.find(item => item.year === curr.year);
        if (existingYear) {
            Object.assign(existingYear, curr);
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);

    return combinedList;
}

export async function DemographySummaryAgeCards ( { dataAge, dataAgeMedian }: { dataAge: DemographySeriesAge[], dataAgeMedian: DemographySeries[] } ) {
    return (
        <>
            <div className="grid grid-cols-2 gap-4 w-full">
                <DemographyAgeSeries dataAge={dataAge} dataAgeMedian={dataAgeMedian}/>
                <DemographyMiniGraph dataAge={dataAge} dataAgeMedian={dataAgeMedian}/>
            </div>
        </>
    );
}

export async function DemographyAgeSeries ({ dataAge, dataAgeMedian }: { dataAge: DemographySeriesAge[], dataAgeMedian: DemographySeries[] }) {
    const ageCategories = ["0-14", "15-19", "20-39", "40-59", "60-64", "65-79", "80-100", "median"];
    const countryCategories = ["SK", "AT", "CZ", "HU", "PL"];
    const colors = ["red", "blue", "yellow", "emerald", "stone"]
    return (
        <Card>
            <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Percentuálne zastúpenie vekových kategórií & vekový medián
            </h3>
            <TabGroup>
                <TabList>
                    {ageCategories.map((age) => {
                        return <Tab key={age}>
                            <h3>
                                {age==="80-100"? "80+": age==='median'? "Medián": age}
                            </h3>
                        </Tab>
                    })}
                </TabList>
                <TabPanels>
                    {ageCategories.map((age) => {
                        return <TabPanel key={age}>
                            <LineChart
                                className="mt-4 h-72"
                                key={age}
                                data={age !== 'median' ? transformAgeSeries(dataAge, age) : transformAgeSeries(dataAgeMedian, age)}
                                index="year"
                                categories={countryCategories}
                                colors={colors}
                                minValue={age !== 'median' ? 0 : 30}
                                maxValue={age !== 'median' ? 32 : 45}
                                onValueChange={(v) => console.log(v)}
                                valueFormatter={age !== 'median' ? valueFormatterPercent : valueFormatterAge}
                            />
                        </TabPanel>
                    })}
                </TabPanels>
            </TabGroup>
        </Card>
    );
}

async function DemographyMiniGraph( { dataAge, dataAgeMedian}: { dataAge: DemographySeriesAge[], dataAgeMedian: DemographySeries[]}) {
    const ageRanges = ["0-14", "15-19", "20-39", "40-59", "60-64", "65-79", "80-100"];
    const countryCategories = ["SK", "AT", "CZ", "HU", "PL"];
    console.log(fitAgeCategory(dataAge, "CZ"))
    return (
        <Card>
            <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Vekové rozdelienie pre 2023 a príslušný medián
            </h3>
            {countryCategories.map((countryCode) => (
                <div key={"demography-mini-graph-"+countryCode} className='mt-2'>
                    <div className="flex items-center space-x-2.5">
                        <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">{countryCode}</p>
                    </div>
                    <CategoryBar 
                        values={fitAgeCategory(dataAge, countryCode)}
                        colors={["emerald", "green", "lime", "yellow", "amber", "orange", "red"]}
                        markerValue={filterCountry(dataAgeMedian, countryCode, 'median').value}
                        showLabels={true}
                    />
                </div>
            ))}
        </Card>
    );
}