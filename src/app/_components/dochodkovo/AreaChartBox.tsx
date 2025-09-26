'use client';
import { useState } from 'react';
import { AreaChart } from '@tremor/react';

type AreaChartBoxProps = {
  data: { year: string; value: number | null }[];
  color: string;
  label: string;
  valueFormatter?: (value: number) => string;
};

export default function AreaChartBox({ data, color, label, valueFormatter }: AreaChartBoxProps) {
  const [selectedChartData, setSelectedChartData] = useState<any>(null);

  // Default value formatter
  const fmt = valueFormatter || ((v: number) => v?.toString());

  const payload = selectedChartData?.payload?.[0];
  const lastNonNull = [...data].reverse().find(d => typeof d.value === 'number');
  const formattedValue = payload
    ? fmt(typeof payload?.payload?.value === 'number' ? payload.payload.value : 0)
    : fmt(lastNonNull && typeof lastNonNull.value === 'number' ? lastNonNull.value : 0);

  return (
    <div className="w-full mt-4">
      <div className="flex items-baseline justify-between">
        <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          {/* {payload
            ? payload?.payload?.year
            : lastNonNull
              ? lastNonNull.year
              : ''} */}
        </span>
        <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          {formattedValue}
        </span>
      </div>
      <AreaChart
        data={data}
        index="year"
        categories={['value']}
        colors={[color]}
        showLegend={false}
        showYAxis={false}
        // showXAxis={false}
        showGridLines={false}
        showGradient={false}
        startEndOnly={true}
        className="-mb-2 mt-0 h-20"
        customTooltip={(props) => {
          if (props.active) {
            setSelectedChartData((prev: any) => {
              if (prev?.label === props?.label) return prev;
              return props;
            });
          } else {
            setSelectedChartData(null);
          }
          return null;
        }}
      />
    </div>
  );
}