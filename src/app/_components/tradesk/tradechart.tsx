'use client';

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { BarChart } from '@tremor/react';
import { classNames, valueFormatter } from './tradeutils';
import { data, summaryData as tabs } from './tradedata';



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