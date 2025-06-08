'use client';

import { BarChart, Divider } from '@tremor/react';

import { fullYearAll } from './data';
import { currencyMillionFormatter } from './utils';


export default function CompareChart() {
  return (
    <>
      <Divider className="my-10">Porovnanie</Divider>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Spotrebné dane na Slovensku
          </h4>
          <p className="mt-4 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
            V roku 2024 vybral štát na spotrebnej dani {' '}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              z alkoholu a tabakových výrobkov 1319 miliónov €
            </span>
            . Približne rovnakú sumu vybral štát za minerálne oleje (pohonné látky).<br />Pre porovnanie,{' '}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              13. dôchodky{' '}
            </span>
            stáli štát v roku 2024{' '}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              823 miliónov €
            </span>
            . V roku 2025 to bude {' '}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              912 miliónov €
            </span>
            .<br />
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Najvačší prispievatelia (za rok 2024)
          </h4>
          <BarChart
            data={fullYearAll}
            index="name"
            categories={['celkovo']}
            colors={['gray-700']}
            showLegend={false}
            layout="vertical"
            yAxisWidth={85}
            className="mt-4"
            valueFormatter={currencyMillionFormatter}
            showAnimation={true}
          />
        </div>
      </div>
    </>
  );
}