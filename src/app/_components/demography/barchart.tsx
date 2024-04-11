'use client';
import {
    Card,
    BarChart
} from '@tremor/react';

import { 
    DemographySeries
} from '@/interfaces/demography';

import {
    demographySeriesDemo,
    valueFormatterMil,
    getMaxYear,
    separateEU
} from '@/app/_components/demography/utils';

export async function DemographyBarCharts ( { data = demographySeriesDemo }: { data: DemographySeries[] } ) {
    return (
        <>
            <div className="grid grid-cols-1 w-full">
                <DemographyBarChart data={data} />
            </div>
        </>
    );
}

export async function DemographyBarChart( { data = demographySeriesDemo}: { data: DemographySeries[] } ) {
    const dataEUmaxYear = getMaxYear(data, 'EU')
    const dataMinusEU = separateEU(data, dataEUmaxYear).dataMinusEU;
    const dataMinusEUminus20 = separateEU(data, dataEUmaxYear-20).dataMinusEU;
    const dataMinusEUsorted = dataMinusEU.sort((a, b) => b.value - a.value);
    const combinedData = dataMinusEUsorted.map(item => {
        const correspondingItem = dataMinusEUminus20.find(i => i.full_name === item.full_name);
        return {
            name: item.full_name,
            [dataEUmaxYear]: item.value,
            [dataEUmaxYear-20]: correspondingItem ? correspondingItem.value : 0
        };
    });
    const diffCombinedData = combinedData.map(item => {
        return {
            ...item,
            prírastok: item[dataEUmaxYear] - item[dataEUmaxYear-20]
        };
    });
    return (
        <Card key={"demography-barchart-eu"} className='max-w-full mx-auto'>
            <div >
                <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Počet obyvateľov v roku {dataEUmaxYear} a prírastok/úbudok od roku {dataEUmaxYear-20}
                </h3>
                <div >
                    <BarChart
                        className='mt-4'
                        data={diffCombinedData}
                        index="name"
                        categories={[dataEUmaxYear.toString(), "prírastok"]}
                        valueFormatter={valueFormatterMil}
                        stack={true}
                        colors={["blue", "red"]}
                    />
                </div>
            </div>
        </Card>
    );
}
