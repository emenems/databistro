'use client';

import { AreaChart, Card } from '@tremor/react';

// Data Sources:
//    - Telekom: https://finstat.sk/35763469
//    - Orange: https://finstat.sk/35697270
//    - O2 https://finstat.sk/35848863 and https://finstat.sk/47259116
// Figures 2023-2025 taken from the statements of selected data (individual financial
// statements, "Tržby celkom" and profit after tax) filed in https://www.registeruz.sk
const profitData = [
    {
        'year': 2018,
        'O2 Slovakia*': 50775000.0,
        'Orange Slovensko': 74297000.0,
        'Slovak Telekom': 106302000.0,
    },
    {
        'year': 2019,
        'O2 Slovakia*': 53148000.0,
        'Orange Slovensko': 72897000.0,
        'Slovak Telekom': 111899000.0,
    },
    {
        'year': 2020,
        'O2 Slovakia*': 52975000.0,
        'Orange Slovensko': 71502000.0,
        'Slovak Telekom': 95510000.0,
    },
    {
        'year': 2021,
        'O2 Slovakia*': 50894000.0,
        'Orange Slovensko': 70695000.0,
        'Slovak Telekom': 143529000.0,
    },
    {
        'year': 2022,
        'O2 Slovakia*': 33212000.0,
        'Orange Slovensko': 71852000.0,
        'Slovak Telekom': 148356000.0,
    },
    {
        'year': 2023,
        'O2 Slovakia*': 26919000.0,
        'Orange Slovensko': 82224000.0,
        'Slovak Telekom': 156871000.0,
    },
    {
        'year': 2024,
        'O2 Slovakia*': 29065000.0,
        'Orange Slovensko': 85659000.0,
        // Slovak Telekom changed its accounting period in 2024: 1-5/2024 (86 729 000) + 6-12/2024 (54 160 000)
        'Slovak Telekom': 140889000.0,
    },
    {
        'year': 2025,
        'O2 Slovakia*': 29445000.0,
        'Orange Slovensko': 90493000.0,
        'Slovak Telekom': 124303000.0,
    }
]

const revenueData = [
    {
        'year': 2018,
        'O2 Slovakia*': 287556000.0,
        'Orange Slovensko': 549504000.0,
        'Slovak Telekom': 695579000.0,
    },
    {
        'year': 2019,
        'O2 Slovakia*': 292024000.0,
        'Orange Slovensko': 545044000.0,
        'Slovak Telekom': 715295000.0,
    },
    {
        'year': 2020,
        'O2 Slovakia*': 283081000.0,
        'Orange Slovensko': 540916000.0,
        'Slovak Telekom': 708834000.0,
    },
    {
        'year': 2021,
        'O2 Slovakia*': 298197000.0,
        'Orange Slovensko': 543096000.0,
        'Slovak Telekom': 730775000.0,
    },
    {
        'year': 2022,
        'O2 Slovakia*': 315583000.0,
        'Orange Slovensko': 572571000.0,
        'Slovak Telekom': 750183000.0,
    },
    {
        'year': 2023,
        'O2 Slovakia*': 339309000.0,
        'Orange Slovensko': 590951000.0,
        'Slovak Telekom': 792523000.0,
    },
    {
        'year': 2024,
        'O2 Slovakia*': 349593000.0,
        'Orange Slovensko': 576441000.0,
        // Slovak Telekom changed its accounting period in 2024: 1-5/2024 (339 827 000) + 6-12/2024 (507 268 000)
        'Slovak Telekom': 847095000.0,
    },
    {
        'year': 2025,
        'O2 Slovakia*': 364576000.0,
        'Orange Slovensko': 583487000.0,
        'Slovak Telekom': 864525000.0,
    }
]

const dataFormatter = (number: number) =>
    `${Intl.NumberFormat('sk').format(number/1000000).toString()} mil €`;
  
export function TelcoAreaChart() {
    return (
        <Card key={"demography-barchart-eu"} className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
            <div >
                <h3 className="text-center text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Obrat
                </h3>
                <AreaChart
                    className="h-80"
                    data={revenueData}
                    index="year"
                    categories={['Slovak Telekom', 'Orange Slovensko', 'O2 Slovakia*']}
                    colors={['pink', 'orange', 'blue']}
                    valueFormatter={dataFormatter}
                    yAxisWidth={60}
                    minValue={200000000}
                    maxValue={1000000000}
                    onValueChange={(v) => console.log(v)}
                />
            </div>
            <div >
                <h3 className="text-center text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Zisk
                </h3>
                <AreaChart
                    className="h-80"
                    data={profitData}
                    index="year"
                    categories={['Slovak Telekom', 'Orange Slovensko', 'O2 Slovakia*']}
                    colors={['pink', 'orange', 'blue']}
                    valueFormatter={dataFormatter}
                    yAxisWidth={60}
                    minValue={20000000}
                    maxValue={160000000}
                    onValueChange={(v) => console.log(v)}
                />
            </div>
        </Card>
    );
}