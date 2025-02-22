'use client';

import { useState } from 'react';
import { RiAddFill, RiCloseLine } from '@remixicon/react';
import { Card, LineChart, Badge } from '@tremor/react';
import { dataYearly, dataChange } from './krimidata';

// Define the available categories along with their colors.
const availableCategories = [
  { name: 'korupcia', bgColor: 'bg-violet-500' },
  { name: 'krádež', bgColor: 'bg-neutral-500' },
  { name: 'krádeže ostatné', bgColor: 'bg-stone-300' },
  { name: 'krádeže vlámaním', bgColor: 'bg-red-500' },
  { name: 'dopravné nehody cestné', bgColor: 'bg-red-300' },
  { name: 'drogy', bgColor: 'bg-gray-500' },
  { name: 'lúpeže', bgColor: 'bg-orange-500' },
  { name: 'nedovolené ozbrojovanie', bgColor: 'bg-yellow-300' },
  { name: 'násilie na verej.činit.', bgColor: 'bg-yellow-500' },
  { name: 'obchodovanie s ľuďmi', bgColor: 'bg-lime-500' },
  { name: 'ohroz. pod vplyvom návyk.látok', bgColor: 'bg-green-500' },
  { name: 'organizovaný zločin', bgColor: 'bg-emerald-500' },
  { name: 'ostatné majetkové', bgColor: 'bg-purple-500' },
  { name: 'podvod', bgColor: 'bg-cyan-500' },
  { name: 'pohlavné zneužívanie', bgColor: 'bg-sky-500' },
  { name: 'požiare a výbuchy', bgColor: 'bg-blue-500' },
  { name: 'skrátenie dane', bgColor: 'bg-indigo-500' },
  { name: 'sprenevera', bgColor: 'bg-zinc-500' },
  { name: 'vraždy', bgColor: 'bg-teal-500' },
  { name: 'výtržníctvo', bgColor: 'bg-fuchsia-500' },
  { name: 'znásilnenie', bgColor: 'bg-pink-500' },
  { name: 'úmyslené ublíženie na zdraví', bgColor: 'bg-rose-500' },
];

// Generate the color mapping by stripping "bg-" so that the chart receives, for example, "slate-500".
const colorMapping: { [key: string]: string } = Object.fromEntries(
  availableCategories.map((cat) => [cat.name, cat.bgColor.replace('bg-', '')])
);

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('sk').format(number).toString()}`;

export default function LineChartKrimi() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'korupcia',
    'vraždy',
    'znásilnenie',
    'násilie na verej.činit.',
  ]);
  const [showDropdown, setShowDropdown] = useState(false);

  const remainingOptions = availableCategories.filter(
    (cat) => !selectedCategories.includes(cat.name)
  );

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.filter((name) => name !== category)
    );
  };

  const addCategory = (category: string) => {
    setSelectedCategories((prev) => [...prev, category]);
    setShowDropdown(false);
  };

  // Use the selectedCategories order to generate the colors array.
  const chartColors = selectedCategories.map(
    (catName) => colorMapping[catName] || 'gray'
  );

  return (
    <>
      {/* <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        ETF performance comparison
      </h3>
      <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt.
      </p> */}
      <div className="mt-0 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Chart area: spans 2/3 on small screens and above */}
        <Card className="sm:col-span-2 w-full">
          <LineChart
            data={dataYearly}
            index="date"
            categories={selectedCategories}
            colors={chartColors}
            valueFormatter={valueFormatter}
            yAxisWidth={55}
            showLegend={false}
            className="hidden h-72 sm:block w-full"
          />
          <LineChart
            data={dataYearly}
            index="date"
            categories={selectedCategories}
            colors={chartColors}
            valueFormatter={valueFormatter}
            showYAxis={false}
            showLegend={false}
            startEndOnly={true}
            className="h-72 sm:hidden w-full"
          />
        </Card>

        {/* Legend area: spans 1/3 on small screens and above */}
        <Card className="sm:col-span-1 w-full">
          <ul
            role="list"
            className="divide-y divide-tremor-border dark:divide-dark-tremor-border"
          >
          {selectedCategories.map((catName) => {
            const cat = availableCategories.find(
              (item) => item.name === catName
            );
            const changeValue: number | undefined = dataChange?.[catName];
            const changeColor =
              changeValue !== undefined && changeValue >= 0 ? 'text-red-500' : 'text-green-500';
            return (
                <li
                  key={catName}
                  className="flex items-center justify-between space-x-3 py-4 first:py-0 first:pb-4"
                >
                  <div className="flex flex-1 items-center space-x-3 truncate">
                    {/* Color indicator */}
                    <span
                      className={classNames(cat?.bgColor, 'w-3 h-3 rounded-full')}
                      aria-hidden="true"
                    />
                    <div className="flex w-full justify-between items-center">
                      <span className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                        {catName}
                      </span>
                      {changeValue !== undefined && (
                        <Badge
                          size="xs"
                          color={changeValue < 0 ? 'green' : 'red'}
                          className="ml-2 min-w-16"
                        >
                          {changeValue}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCategory(catName)}
                    className="text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand dark:hover:text-dark-tremor-brand-emphasis"
                  >
                    <RiCloseLine size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap py-2 px-3 border border-tremor-border rounded font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand dark:hover:text-dark-tremor-brand-emphasis"
            >
              <RiAddFill size={16} />
              Pridať kategóriu
            </button>
            {showDropdown && remainingOptions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded shadow dark:bg-dark sm:w-64">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {remainingOptions.map((option) => (
                    <li key={option.name}>
                      <button
                        onClick={() => addCategory(option.name)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}