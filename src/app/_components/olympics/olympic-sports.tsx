'use client';

import React from 'react';
import { BarChart, FunnelChart, Divider, Card, Switch } from '@tremor/react';
import { DataEntry, sports, aggregateVotesBySport, formatForFunnel, sportsSlovak } from './utils';

const data: DataEntry[] = [
    { 
        model: 'mixtral', prompt: 1, 
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 0 , modern_pentathlon: 1, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'mixtral', prompt: 2,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 1, curling: 0 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'claude', prompt: 1,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 1 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'claude', prompt: 2,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 1 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'llama', prompt: 1,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 1 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'llama', prompt: 2,
        archery: 0, equestrian: 1, sailing: 1, shooting: 0, table_tennis: 0, curling: 1 , modern_pentathlon: 1, biathlon: 1, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'chatgpt4o', prompt: 1,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 1 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'chatgpt4o', prompt: 2,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 1 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'pi', prompt: 1,
        archery: 1, equestrian: 0, sailing: 0, shooting: 1, table_tennis: 1, curling: 0 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 1, wrestling: 1
    },
    { 
        model: 'pi', prompt: 2,
        archery: 1, equestrian: 0, sailing: 0, shooting: 1, table_tennis: 0, curling: 0 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
    { 
        model: 'gemini', prompt: 1,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 0 , modern_pentathlon: 0, biathlon: 0, golf: 1, rowing: 0, wrestling: 0
    },
    { 
        model: 'gemini', prompt: 2,
        archery: 1, equestrian: 1, sailing: 1, shooting: 1, table_tennis: 0, curling: 1 , modern_pentathlon: 0, biathlon: 0, golf: 0, rowing: 0, wrestling: 0
    },
];

const podiumData = [
    {
        name: "curling",
        value: 60,
    },
    {
        name: "archery & shooting",
        value: 100,
    },
    {
        name: "equestrian & sailing",
        value: 80,
    },
];

const podiumDataSlovak = [
    {
        name: "curling",
        value: 60,
    },
    {
        name: "lukostreľba & streľba",
        value: 100,
    },
    {
        name: "jazdenie na koni & jachting",
        value: 80,
    },
];

export default function OlympicSports() {

    const [isSwitchOn, setIsSwitchOn] = React.useState<boolean>(false);
    const handleSwitchChange = (value: boolean) => {
        setIsSwitchOn(value);
    };

    const aggregatedVotesBySport = aggregateVotesBySport(data, sports);
    const funnelData = formatForFunnel(aggregatedVotesBySport);

    const aggregatedData: { [key: string]: any } = {};

    data.forEach(entry => {
        if (!aggregatedData[entry.model]) {
            aggregatedData[entry.model] = {
                model: entry.model,
                archery: 0,
                equestrian: 0,
                sailing: 0,
                shooting: 0,
                table_tennis: 0,
                curling: 0,
                modern_pentathlon: 0,
                biathlon: 0,
                golf: 0,
                rowing: 0,
                wrestling: 0,
            };
        }

        aggregatedData[entry.model].archery += entry.archery;
        aggregatedData[entry.model].equestrian += entry.equestrian;
        aggregatedData[entry.model].sailing += entry.sailing;
        aggregatedData[entry.model].shooting += entry.shooting;
        aggregatedData[entry.model].table_tennis += entry.table_tennis;
        aggregatedData[entry.model].curling += entry.curling;
        aggregatedData[entry.model].modern_pentathlon += entry.modern_pentathlon;
        aggregatedData[entry.model].biathlon += entry.biathlon;
        aggregatedData[entry.model].golf += entry.golf;
        aggregatedData[entry.model].rowing += entry.rowing;
        aggregatedData[entry.model].wrestling += entry.wrestling;
    });

    const funnelDataSlovak = funnelData.map(entry => {
        return {
            name: sportsSlovak[sports.indexOf(entry.name)],
            value: entry.value,
        };
    });

    const barData = Object.values(aggregatedData);
    const barDataSlovak = barData.map(entry => {
        return {
            model: entry.model,
            'lukostreľba': entry.archery,
            'jazdenie na koni': entry.equestrian,
            'jachting': entry.sailing,
            'streľba': entry.shooting,
            'stolný tenis': entry.table_tennis,
            'curling': entry.curling,
            'moderný päťboj': entry.modern_pentathlon,
            'biatlon': entry.biathlon,
            'golf': entry.golf,
            'veslovanie': entry.rowing,
            'zápasenie': entry.wrestling,
        };
    });

    console.log(podiumData);
    return (
        <div className="mx-auto w-full">
            <Card className='w-full'>
                <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    { isSwitchOn ? 'Overall winner' : 'Celkový výťaz' }
                </h3>
                <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    { isSwitchOn ? 'Archery or Shooting' : 'Lukostreľba alebo Streľba' }
                </p>
                <div className="flex justify-center">
                    <FunnelChart
                        evolutionGradient
                        showArrow={false}
                        gradient={false}
                        showGridLines={false}
                        showTooltip={true}
                        className="w-full sm:w-1/2 mt-8"
                        showYAxis={false}
                        data={isSwitchOn ? podiumData : podiumDataSlovak}
                    />
                </div>
            </Card>
            <Divider />
            <Card className='w-full'>
                <h1 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    { isSwitchOn ? 'Results by sport' : 'Výsledky podľa športu' }
                </h1>
                <FunnelChart
                    evolutionGradient
                    gradient={false}
                    className="w-full mt-8"
                    showYAxis={false}
                    data={isSwitchOn ? funnelData.sort((a, b) => b.value - a.value) : funnelDataSlovak.sort((a, b) => b.value - a.value)}
                />
            </Card>
            <Divider />
            <Card className='w-full'>
                <h1 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {isSwitchOn ? 'Results by model' : 'Výsledky podľa modelu'}
                </h1>
                <BarChart
                    className="h-72"
                    data={ isSwitchOn ? barData : barDataSlovak }
                    index="model"
                    categories={ isSwitchOn ? sports : sportsSlovak }
                    colors={['slate', 'zinc', 'stone', 'red','amber', 'lime', 'emerald', 'cyan', 'blue', 'violet', 'fuchsia', 'pink', 'rose']}
                    yAxisWidth={30}
                />
            </Card>

            <div className="flex items-center space-x-3 mt-12">
                <Switch
                    id="switch"
                    name="switch"
                    checked={isSwitchOn}
                    onChange={handleSwitchChange}
                />
                <label htmlFor="switch" className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    {isSwitchOn ? 'English' : 'English'}
                </label>
            </div>
        </div>
    );
}
