'use client'; 

import { DonutChart } from '@tremor/react';
import { monthlyAverage } from '@/app/_components/alcotax/data';
import { currencyFormatter, percentageFormatter, classNames } from '@/app/_components/alcotax/utils';


const totalSum = monthlyAverage.reduce((total, item) => total + item.amount, 0);

export default function HeaderChart() {
  return (
    <>
        <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Mesačný výber dane za alkohol a tabakové výrobky
        </h3>
        <div className="mt-6 lg:flex lg:items-end lg:justify-between">
          <div className="flex items-center justify-start space-x-4 lg:items-end">
            <DonutChart
              data={monthlyAverage}
              category="amount"
              index="name"
              valueFormatter={currencyFormatter}
              showTooltip={false}
              className="h-20 w-20"
              showLabel={false}
              colors={monthlyAverage.map(item => item.borderColor.split('-')[1])}
              showAnimation={true}
            />
            <div>
              <p className="text-tremor-title font-semibold text-tremor-content-strong">
                {currencyFormatter(totalSum)}{' '}
              </p>
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Priemer za mesiac od roku 2024
              </p>
            </div>
          </div>
          <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-px bg-tremor-border dark:bg-dark-tremor-border lg:mt-0 lg:grid-cols-4"
          >
            {monthlyAverage.map((item) => (
              <li
                key={item.name}
                className="bg-tremor-background px-0 py-3 lg:px-4 lg:py-0 lg:text-right"
              >
                <p className="text-tremor-default font-semibold text-tremor-content-strong ">
                  {currencyFormatter(item.amount)}{' '}
                  <span className="font-normal">({percentageFormatter(item.amount/totalSum)})</span>
                </p>
                <div className="flex items-center space-x-2 lg:justify-end">
                  <span
                    className={classNames(
                      item.borderColor,
                      'size-2.5 shrink-0 rounded-sm',
                    )}
                    aria-hidden={true}
                  />
                  <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    {item.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
    </>
  );
}