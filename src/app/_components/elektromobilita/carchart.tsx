'use client';

import {
  BarChart,
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { dataHist } from './cardata';

function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('sk').format(number).toString()}`;

const chartData = dataHist.map(item => ({
  date: `${item.year}-${String(item.month).padStart(2, '0')}`,
  'Elektrické': item.pocet_elektro,
  'Klasické a hybrid': item.pocet_neelektro,
}));

const tabs = [
  {
    name: 'Celkovo',
    data: chartData,
    categories: ['Klasické a hybrid', 'Elektrické'],
    colors: ['blue', 'rose'],
    summary: [
      {
        name: 'Klasické a hybrid',
        total: 23450,
        color: 'bg-blue-500',
      },
      {
        name: 'Elektrické',
        total: 1397,
        color: 'bg-rose-500',
      },
    ],
  },
  {
    name: 'Elektroautá',
    data: chartData,
    categories: ['Elektrické'],
    colors: ['rose'],
    summary: [
      {
        name: 'Elektrické',
        total: 23450,
        color: 'bg-rose-500',
      }
    ],
  },
];

export default function Example() {
  return (
    <Card className="p-0">
      <div className="border-t border-tremor-border p-6 dark:border-dark-tremor-border">
        <TabGroup>
          <div className="md:flex md:items-center md:justify-between">
            <TabList
              variant="solid"
              className="w-full rounded-tremor-small md:w-60"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className="w-full justify-center ui-selected:text-tremor-content-strong ui-selected:dark:text-dark-tremor-content-strong"
                >
                  {tab.name}
                </Tab>
              ))}
            </TabList>
          </div>
          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.name}>
                <ul
                  role="list"
                  className="mt-6 flex flex-wrap gap-x-20 gap-y-10"
                >
                  {tab.summary.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-center space-x-2">
                        <span
                          className={classNames(
                            item.color,
                            'size-3 shrink-0 rounded-sm',
                          )}
                          aria-hidden={true}
                        />
                        <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          {item.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <BarChart
                  data={tab.data}
                  index="date"
                  categories={tab.categories}
                  colors={tab.colors}
                  stack={true}
                  showLegend={false}
                  yAxisWidth={45}
                  valueFormatter={valueFormatter}
                  className="mt-10 hidden h-72 md:block"
                />
                <BarChart
                  data={tab.data}
                  index="date"
                  categories={tab.categories}
                  colors={tab.colors}
                  stack={true}
                  showLegend={false}
                  showYAxis={false}
                  valueFormatter={valueFormatter}
                  className="mt-6 h-72 md:hidden"
                />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </Card>
  );
}