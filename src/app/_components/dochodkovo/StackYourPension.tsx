'use client';

import { useState } from 'react';
import { Card, BarChart, Badge } from '@tremor/react';
import { RiAddFill, RiCloseLine } from '@remixicon/react';
import { valueFormatterTotal as valueFormatter } from './utils';
import { dataMeasures } from './data';


const colorPalette = [
  'rose', 'amber', 'emerald', 'blue', 'violet', 'cyan', 'indigo', 'green', 'pink', 'orange', 'teal', 'fuchsia', 'lime', 'stone'
];

const pensionCost = 920; // in mil. EUR

// Prepare availableMeasures from dataMeasures
const availableMeasures = Object.entries(dataMeasures).map(([name, obj], idx) => ({
  name,
  color: colorPalette[idx % colorPalette.length],
  value: obj.náklady,
  vysvetlenie: obj.vysvetlenie,
}));

export default function StackYourPension() {
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>(
    availableMeasures.slice(0, 9).map(m => m.name)
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const remainingOptions = availableMeasures.filter(
    (m) => !selectedMeasures.includes(m.name)
  );

  const addMeasure = (name: string) => {
    setSelectedMeasures((prev) => [...prev, name]);
    setShowDropdown(false);
  };

  const removeMeasure = (name: string) => {
    setSelectedMeasures((prev) => prev.filter((n) => n !== name));
  };

  // Prepare data for the stacked bar
  const barData = [
    {
      name: '13. dôchodok (2025)',
      'Pension cost': pensionCost,
    },
    {
      name: 'Vaše opatrenia',
      ...Object.fromEntries(
        selectedMeasures.map((name) => {
          const m = availableMeasures.find((m) => m.name === name);
          return [name, m?.value ?? 0];
        })
      ),
    },
  ];

  const categories = [...selectedMeasures];
  const colors = selectedMeasures.map(
    (name) => availableMeasures.find((m) => m.name === name)?.color || 'gray'
  );

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Aké náklady sú spojené s 13. dôchodkom a ako ich pokryť?
      </h3>
      <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
        V roku 2024 boli náklady na 13. dôchodok <a href="(https://www.socpoist.sk/news/socialna-poistovna-zacala-vyplacat-13-dochodok-dostane-ho-takmer-jeden-pol-miliona-dochodcov" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">830 mil. €</a>, zatiaľčo odhadované náklady na rok 2025 sú <a href="https://www.forbes.sk/statny-rozpocet-2025-dochodky-zhltnu-az-13-miliard-eur-na-podporu-vedy-pojde-menej/" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">912 mil. €</a>. Príjmy z konsolidačných balíčkov boli získané z prezentácií Ministra Fininacií SR z roku <a href="https://www.mfsr.sk/files/archiv/66/KONSOLIDACNE-OPATRENIA-2024.pdf" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">2023</a>, <a href="https://www.mfsr.sk/files/archiv/71/KONSOLIDACNE-OPATRENIA-PREZENTACIA.pdf" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">2024</a> a <a href="https://www.mfsr.sk/files/archiv/25/KONSOLIDACIA-3-2026.pdf" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">2025</a>.
      </p>
      <div className="mt-12 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <BarChart
            data={barData}
            index="name"
            categories={['Pension cost', ...categories]}
            colors={['slate', ...colors]}
            stack={true}
            showLegend={false}
            valueFormatter={valueFormatter}
            yAxisWidth={120}
            className="h-80"
          />
        </div>
        <div className="w-full md:w-64">
          <ul className="divide-y divide-tremor-border dark:divide-dark-tremor-border md:-mt-5">
              <span className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content font-semibold">
                Vaše opatrenia:
              </span>
            {selectedMeasures.map((name) => {
              const m = availableMeasures.find((m) => m.name === name);
              return (
                <li key={name} className="flex items-center justify-between py-2">
                  <div className="flex w-full items-center">
                    <span className="text-xs font-normal text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      {name}
                    </span>
                    <span className="flex-1" />
                    {/* <Tooltip content={m?.vysvetlenie}>
                      <Badge color={m?.color as any} className="font-normal cursor-help">
                        {valueFormatter(m?.value ?? 0)}
                      </Badge>
                    </Tooltip> */}
                  </div>
                  <button
                    onClick={() => removeMeasure(name)}
                    className="text-tremor-brand hover:text-tremor-brand-emphasis ml-2"
                  >
                    <RiCloseLine size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="relative mt-0 flex justify-center">
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="inline-flex items-center gap-1 py-1.5 px-2 rounded border border-tremor-border font-medium text-tremor-default text-tremor-brand hover:text-tremor-brand-emphasis"
            >
              <RiAddFill size={16} />
              Pridať opatrenie
            </button>
            {showDropdown && remainingOptions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded shadow dark:bg-dark sm:w-64">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {remainingOptions.map((option) => (
                    <li key={option.name}>
                      <button
                        onClick={() => addMeasure(option.name)}
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
        </div>
      </div>
    </Card>
  );
}