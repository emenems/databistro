'use client';

import {
    Card,
    CategoryBar,
    LineChart,
    TabPanel,
    TabPanels,
    TabGroup,
    TabList,
    Tab
} from '@tremor/react';

import { 
    DemographySeries,
    DemographySeriesAge
} from '@/interfaces/demography';

import {
    demographySeriesDemo,
    demographySeriesAgeDemo,
    valueFormatterPercent,
    valueFormatterAge,
    fitAgeCategory,
    filterCountryMedian,
} from '@/app/_components/demography/utils';

function transformData(data: DemographySeries[] | DemographySeriesAge[] = demographySeriesAgeDemo) {
    const seriesTransformed = data.map((d) => {
        return {
            year: d.year,
            geo: d.geo,
            full_name: d.full_name,
            value: d.value,
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
    }, [] as DemographySeries[]);

    return combinedList;
}

function transformAgeSeries (data: DemographySeriesAge[] = demographySeriesAgeDemo, ageRange: string = "0-14") {
    const [ageFrom, ageTo] = ageRange.split('-').map(Number);
    const seriesFilteredAgeFrom = data.filter((d) => d.age_from === ageFrom);
    const seriesFilteredAgeTo = seriesFilteredAgeFrom.filter((d) => d.age_to === ageTo);
    const seriesTransformed = transformData(seriesFilteredAgeTo)
    return seriesTransformed;
}

function transformAgeSeriesMedian (data: DemographySeries[] = demographySeriesDemo) {
    const seriesTransformed = transformData(data)
    return seriesTransformed;
}

export async function DemographyAgeSeries ( { dataAge = demographySeriesAgeDemo, dataAgeMedian = demographySeriesDemo }: { dataAge: DemographySeriesAge[], dataAgeMedian: DemographySeries[] } ) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <DemographyLineSeries dataAge={dataAge} dataAgeMedian={dataAgeMedian}/>
                <DemographyMiniGraph dataAge={dataAge} dataAgeMedian={dataAgeMedian}/>
            </div>
        </>
    );
}

async function DemographyLineSeries ({ dataAge = demographySeriesAgeDemo, dataAgeMedian = demographySeriesDemo }: { dataAge: DemographySeriesAge[], dataAgeMedian: DemographySeries[] }) {
    const ageCategories = ["0-14", "15-19", "20-39", "40-59", "60-64", "65-79", "80-100", "median"];
    const countryCategories = ["SK", "AT", "CZ", "HU", "PL"];
    const colors = ["red", "emerald", "sky", "slate", "stone"]
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
                                data={age !== 'median' ? transformAgeSeries(dataAge, age) : transformAgeSeriesMedian(dataAgeMedian)}
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

async function DemographyMiniGraph( {  dataAge = demographySeriesAgeDemo, dataAgeMedian = demographySeriesDemo }: { dataAge: DemographySeriesAge[], dataAgeMedian: DemographySeries[]}) {
    const countryCategories = ["SK", "AT", "CZ", "HU", "PL"];
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
                        markerValue={filterCountryMedian(dataAgeMedian, countryCode)}
                        showLabels={true}
                    />
                </div>
            ))}
        </Card>
    );
}