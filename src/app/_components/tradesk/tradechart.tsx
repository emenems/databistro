'use client';

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { BarChart } from '@tremor/react';
import { classNames, valueFormatter } from './tradeutils';

const tabs = [
  { name: 'Bilancia', value: 4503401.6 },
  { name: 'Vývoz', value: 108446857.9 },
  { name: 'Dovoz', value: 103943456.3 },
];

const data: {date: number, 'Bilancia': number, 'Vývoz': number, 'Dovoz': number}[] = [
  { date: 2010, 'Bilancia': 814150.400000006, 'Vývoz': 49251715.2, 'Dovoz': 48437564.8 },
  { date: 2011, 'Bilancia': 1289805.3000000045, 'Vývoz': 56754877.1, 'Dovoz': 55465071.8 },
  { date: 2012, 'Bilancia': 4000364.400000006, 'Vývoz': 62201724.7, 'Dovoz': 58201360.3 },
  { date: 2013, 'Bilancia': 4570869.5, 'Vývoz': 64131459.7, 'Dovoz': 59560590.2 },
  { date: 2014, 'Bilancia': 4772635.3999999985, 'Vývoz': 64565418.1, 'Dovoz': 59792782.7 },
  { date: 2015, 'Bilancia': 3159968.8000000045, 'Vývoz': 67606968.4, 'Dovoz': 64446999.6 },
  { date: 2016, 'Bilancia': 3366992.899999991, 'Vývoz': 69554585.6, 'Dovoz': 66187592.7 },
  { date: 2017, 'Bilancia': 3073685.600000009, 'Vývoz': 73851898.4, 'Dovoz': 70778212.8 },
  { date: 2018, 'Bilancia': 2309490.099999994, 'Vývoz': 79144529.0, 'Dovoz': 76835038.9 },
  { date: 2019, 'Bilancia': 1062641.200000003, 'Vývoz': 80337657.9, 'Dovoz': 79275016.7 },
  { date: 2020, 'Bilancia': 3316526.900000006, 'Vývoz': 75916244.5, 'Dovoz': 72599717.6 },
  { date: 2021, 'Bilancia': 1875612.400000006, 'Vývoz': 88551676.9, 'Dovoz': 86676064.5 },
  { date: 2022, 'Bilancia': -4524118.299999997, 'Vývoz': 102786059.9, 'Dovoz': 107310178.2 },
  { date: 2023, 'Bilancia': 4503401.600000009, 'Vývoz': 108446857.9, 'Dovoz': 103943456.3 }
];



export default function TradeChart() {
  const [selectedRegion, setSelectedRegion] = useState<'Bilancia' | 'Dovoz' | 'Vývoz'>('Bilancia');

  const formatedData = data.map((item) => {
    return {
      date: item.date,
      hodnota: item[selectedRegion],
    };
  });

  return (
    <>
     <div className="container relative flex flex-col items-center mt-8 mb-8 max-w-3xl mx-auto">
        <RadioGroup
          name="Region"
          value={selectedRegion}
          onChange={setSelectedRegion}
          className="mt-6 grid gap-3 grid-cols-3"
        >
          {tabs.map((tab) => (
            <RadioGroup.Option
              key={tab.name}
              value={tab.name}
              className={({ active }) =>
                classNames(
                  active
                    ? 'border-tremor-brand-subtle ring-2 ring-tremor-brand-muted dark:border-dark-tremor-brand-subtle dark:ring-dark-tremor-brand-muted'
                    : 'border-tremor-border dark:border-dark-tremor-border',
                  'relative block cursor-pointer rounded-tremor-default border bg-tremor-background px-4 py-3 transition dark:bg-dark-tremor-background sm:min-w-40 min-w-24',
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <h3 className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                    {tab.name}
                  </h3>
                  <p className="sm:text-tremor-title text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {valueFormatter(tab.value)}
                  </p>
                  <span
                    className={classNames(
                      active ? 'border' : 'border-2',
                      checked
                        ? 'border-tremor-brand dark:border-dark-tremor-brand'
                        : 'border-transparent',
                      'pointer-events-none absolute -inset-px rounded-tremor-default',
                    )}
                    aria-hidden={true}
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
        <BarChart
          data={formatedData}
          index="date"
          categories={['hodnota']}
          showLegend={false}
          showAnimation={true}
          animationDuration={300}
          valueFormatter={valueFormatter}
          yAxisWidth={120}
          className="mt-10 h-72 sm:block"
        />
      </div>
    </>
  );
}