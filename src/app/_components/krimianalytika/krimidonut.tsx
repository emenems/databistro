'use client';

import {
  Card,
  ProgressCircle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { dataSolvedPercentage } from './krimidata';
import KrimiTable from './krimitable';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function KrimiDonut() {
  function getColorByRegion(name: string): string {
    switch (name) {
      case 'Násilná':
        return 'bg-red-500';
      case 'Mravnostná':
        return 'bg-cyan-500';
      case 'Ekonomická':
        return 'bg-indigo-500';
      case 'Majetková':
        return 'bg-blue-500';
      case 'Ostatná':
        return 'bg-amber-500';
      case 'Zostávajúca':
        return 'bg-stone-500';
      default:
        return 'bg-gray-500';
    }
  }

  const summary = [
    {
      name: '2024',
      data: dataSolvedPercentage.find((d) => d.date === '2024'),
    },
    {
      name: '2023',
      data: dataSolvedPercentage.find((d) => d.date === '2023'),
    },
    {
      name: '2022',
      data: dataSolvedPercentage.find((d) => d.date === '2022'),
    },
    {
      name: '2021',
      data: dataSolvedPercentage.find((d) => d.date === '2021'),
    },
    {
      name: '2020',
      data: dataSolvedPercentage.find((d) => d.date === '2020'),
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* TabGroup Container Card */}
      <Card className="p-0">
        <TabGroup>
          <TabList className="px-6 pt-4">
            {summary.map((item) => (
              <Tab key={item.name} value={item.name}>
                {item.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="px-6 pb-6">
            {summary.map((category) => (
              <TabPanel key={category.name}>
                <div className="items-start p-6 sm:flex sm:space-x-10">
                  <ProgressCircle
                    value={category.data?.Celková || 0}
                    radius={70}
                    strokeWidth={10}
                    color="sky"
                  >
                    <p className="text-center">
                      <span className="block text-sm">Celkovo</span>
                      <span className="inline-block text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {category.data?.Celková}
                        <span className="ml-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                          /100
                        </span>
                      </span>
                    </p>
                  </ProgressCircle>
                  <ul role="list" className="mt-4 w-full sm:mt-0">
                    {Object.entries(category.data!)
                      .filter(([key]) => key !== 'date' && key !== 'Celková')
                      .map(([regionName, value]) => (
                        <li
                          key={regionName}
                          className="relative rounded-tremor-small px-3 py-1 hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-subtle"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={classNames(
                                  getColorByRegion(regionName),
                                  'size-2.5 rounded-sm'
                                )}
                                aria-hidden="true"
                              />
                              <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                <a href="#" className="focus:outline-none">
                                  <span
                                    className="absolute inset-0"
                                    aria-hidden="true"
                                  />
                                  {regionName}
                                </a>
                              </p>
                            </div>
                            <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                              {value}%
                            </p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </Card>
      {/* KrimiTable Container Card */}
      <KrimiTable />
    </div>
  );
}