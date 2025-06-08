'use client';

import { BarChart } from '@tremor/react';
import { currencyMillionFormatter } from '@/app/_components/alcotax/utils';
import { monthlyAverage, dataHist } from '@/app/_components/alcotax/data';


export default function BarChartTax() {
  return (
      <div className="mt-6">
          <BarChart
            data={dataHist}
            index="date"
            categories={monthlyAverage.map(item => item.name)}
            colors={monthlyAverage.map(item => item.borderColor.split('-')[1])}
            stack={true}
            showLegend={false}
            yAxisWidth={90}
            valueFormatter={currencyMillionFormatter}
            className="mt-6"
            showAnimation={true}
          />
      </div>
  );
}