import { Card, CategoryBar } from '@tremor/react';
import { classNames } from './tradeutils';
const legendColor: Record<string, string> = {
  'Vývoz': 'bg-sky-500',
  'Dovoz': 'bg-rose-500',
};


export default function TradeCard({ item }: { item: any }) {
  return (
    <Card key={item.name} className="max-w-sm">
      <dt className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        {item.name}
      </dt>
      <dd className="mt-1 text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {item.total}
      </dd>
      <CategoryBar
        values={item.split}
        colors={['sky', 'rose']}
        showLabels={false}
        className="mt-6"
      />
      <ul
        role="list"
        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        {item.details.map((category: any) => (
          <li key={category.name} className="flex items-center space-x-2">
            <span
              className={classNames(
                legendColor[category.name],
                'size-3 shrink-0 rounded-sm',
              )}
              aria-hidden={true}
            />
            <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              <span className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
                {category.value}
              </span>{' '}
              {category.name}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}