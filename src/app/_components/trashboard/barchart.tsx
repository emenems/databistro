'use client';

import { BarChart } from '@tremor/react';
import { revenueSeries as originalChartData } from "./data";

interface CustomBarChartProps {
  subtract: number;
  color: string;
  animation: boolean;
  minValue: number;
  maxValue: number;
}

export default function CustomBarChart({ subtract, color, animation, minValue, maxValue }: CustomBarChartProps) {
  type CustomTooltipTypeBar = {
    payload: any;
    active: boolean | undefined;
    label: any;
  };

  const customTooltip = (props: CustomTooltipTypeBar) => {
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((category: any, idx: number) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              <p className="text-tremor-content">{category.dataKey}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {category.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const adjustedChartData = originalChartData.map((item) => ({
    ...item,
    Revenue: item.Revenue - subtract,
  }));

  return (
    <>
      <BarChart
        className="mt-4 h-72 w-full"
        data={adjustedChartData}
        index="date"
        categories={['Revenue']}
        colors={[color]}
        yAxisWidth={80}
        customTooltip={customTooltip}
        showAnimation={animation}
        minValue={minValue}
        maxValue={maxValue}
      />
    </>
  );
}