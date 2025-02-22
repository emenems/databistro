'use client';

import { BarChart, Card } from '@tremor/react';
import { dataRegistered } from './krimidata';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Majetková', value: 14044, color: 'bg-blue-500', description: 'krádeže'},
  { name: 'Ekonomická', value: 9544, color: 'bg-indigo-500', description: 'korupcia, skrátenie dane,...'},
  { name: 'Násilná', value: 4080, color: 'bg-red-500', description: 'vraždy, lúpeže,...'},
  { name: 'Mravnostná', value: 885, color: 'bg-cyan-500', description: 'znásilenia, zneužívanie,...'},
  { name: 'Ostatná', value: 5593, color: 'bg-amber-500', description: 'výtržníctvo, drogy,...'},
  { name: 'Zostávajúca', value: 10768, color: 'bg-stone-500', description: 'dopravné nehody,...'},
];


function valueFormatterShort(number: number) {
  const formatter = new Intl.NumberFormat('sk', {
    maximumFractionDigits: 0,
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(number);
}

function valueFormatter(number: number) {
  return `${Intl.NumberFormat('sk').format(number).toString()}`;
}

export default function KrimiBarChart() {
  return (
    <>
      <Card className="mt-0 w-full ">
        <ul
          role="list"
          className="grid gap-3 sm:grid-cols-2 md:grid-cols-3"
        >
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className="rounded-tremor-small border border-tremor-border px-3 py-2 text-left dark:border-dark-tremor-border"
            >
              <div className="flex items-center space-x-1.5">
                <span
                  className={classNames(tab.color, 'size-2.5 rounded-sm')}
                  aria-hidden={true}
                />
                <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                  {tab.name}
                </p>
              </div>
              <p className="mt-0.5 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {valueFormatter(tab.value)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ({tab.description})
              </p>
            </li>
          ))}
        </ul>
        <BarChart
          data={dataRegistered}
          index="date"
          categories={['Majetková', 'Ekonomická', 'Násilná', 'Mravnostná', 'Ostatná', 'Zostávajúca']}
          colors={['blue', 'indigo', 'red', 'cyan', 'amber', 'stone']}
          showLegend={false}
          valueFormatter={valueFormatterShort}
          yAxisWidth={50}
          stack={true}
          className="mt-6 h-56 sm:block"
        />
      </Card>
    </>
  );
}