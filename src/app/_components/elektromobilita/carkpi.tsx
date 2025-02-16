'use client';

import { Card, FunnelChart, AreaChart} from '@tremor/react';
import { RiArrowDownSFill, RiArrowUpSFill } from '@remixicon/react';

function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
interface FunnelData {
  name: string;
  value: number;
}
interface FunFactCardProps {
  dataPlot: FunnelData[];
  title: string;
  unit: string;
  secondDescription: string;
  currentYearData: number;
  previousYearData: number;
  ratio: number;
  showYear: number;
}



const FunFactCard: React.FC<FunFactCardProps> = ({ dataPlot, title, unit, secondDescription, currentYearData, previousYearData, ratio, showYear }) => {
  const statsChange = currentYearData - previousYearData;

  return (
    <Card>
      <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
        {title}
      </dt>
      <dd className="mt-2 flex items-baseline space-x-2.5">
        <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {currentYearData} {unit}
        </span>
      </dd>
      <dd className="mt-2 flex items-center space-x-2">
        <p className="flex items-center space-x-0.5">
          {statsChange > 0 ? (
            <RiArrowUpSFill
              className="size-5 shrink-0 text-emerald-700 dark:text-emerald-500"
              aria-hidden={true}
            />
          ) : (
            <RiArrowDownSFill
              className="size-5 shrink-0 text-red-700 dark:text-red-500"
              aria-hidden={true}
            />
          )}
          <span
            className={classNames(
              statsChange > 0
                ? 'text-emerald-700 dark:text-emerald-500'
                : 'text-red-700 dark:text-red-500',
              'text-tremor-default font-medium',
            )}
          >
            {Math.abs(statsChange / previousYearData * 100).toFixed(1)}%
          </span>
        </p>
        <p className="text-tremor-default text-tremor-content">
          oproti roku {showYear - 1}
        </p>
      </dd>
      <dd className="mt-0 flex items-center space-x-2">
        <p className="flex items-center space-x-0.5">
          {ratio > 0.15 && secondDescription !== "" ? (
            <RiArrowUpSFill
              className="size-5 shrink-0 text-emerald-700 dark:text-emerald-500"
              aria-hidden={true}
            />
          ) : (
            secondDescription !== "" && (
              <RiArrowUpSFill
                className="size-5 shrink-0 text-red-700 dark:text-red-500"
                aria-hidden={true}
              />
            )
          )}
          {secondDescription !== "" ? (
            <span
              className={classNames(
                ratio > 0.15
                  ? 'text-emerald-700 dark:text-emerald-500'
                  : 'text-red-700 dark:text-red-500',
                'text-tremor-default font-medium',
              )}
            >
              {Math.abs(ratio * 100).toFixed(1)}%
            </span>
          ) : (
            <span className='mb-5'></span>
          )}
        </p>
        <p className="text-tremor-default text-tremor-content">
          {secondDescription}
        </p>
      </dd>
      {/* <AreaChart
        className="-mb-2 mt-0 h-24"
        data={data}
        index='name'
        categories={['value']}
        showYAxis={false}
        showXAxis={false}
        // startEndOnly={true}
        showLegend={false}
        showGridLines={false}
        showGradient={true}
      /> */}
      <FunnelChart
        className="-mb-2 mt-2 h-24"
        data={dataPlot}
        gradient={false}
        showYAxis={false}
        showXAxis={true}
        showGridLines={false}
        barGap={20}
        evolutionGradient
      />
    </Card>
  );
};

export default FunFactCard;