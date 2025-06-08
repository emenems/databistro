'use client';

import { Divider, Card } from '@tremor/react';
import { PiCigarette, PiChampagne, PiBeerBottleLight} from 'react-icons/pi';
import { CiBeerMugFull } from "react-icons/ci";
import { currencyFormatter } from './utils';

const data = [
  {
    name: 'Cigarety',
    category: 'Tabakové výrobky',
    description: 'krabička v cene 5.20 €',
    info: 'fix 0,0913 eur/kus + 25% z ceny (minimálne však 0.148 eur/kus)',
    value: 3.13,
    icon: <PiCigarette className="text-blue-500" size={32} />,
  },
  {
    name: 'Rum',
    category: 'Liehoviny',
    description: 'fľaša 0,7 litra a obsahom alkoholu 40%',
    info: '1490.40 eur na 100 litrov a 100% alkoholu',
    value: 4.172,
    icon: <PiBeerBottleLight className='text-cyan-500' size={32} />,
  },
  {
    name: 'Pivo',
    category: 'Pivo',
    description: 'pol litra a obsah alkoholu 4,4%',
    info: 'percento alkoholu * 3,587 na 100 litrov (malé pivovary 2,652/100 litrov)',
    value: 0.08,
    icon: <CiBeerMugFull className="text-fuchsia-500" size={32}/>,
  },
  {
    name: 'Šumivé víno',
    category: 'Víno',
    description: 'fľaša 0,75 litra a obsahom alkoholu nad 8,5% (na tiché víno sa daň nevzťahuje)',
    info: '0 na normálne (tiché víno) a 79,65 eur na 100 litrov na šumivé víno (alkohol nad 8,5%)',
    value: 0.60,
    icon: <PiChampagne className="text-violet-500" size={32}/>,
  }
];

export default function DetailChart() {
  return (
    <>
      <Divider className="my-10">Detail</Divider>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Dane za alkohol a cigarety
          </h4>
          {data.map((item) => (
            <p key={item.name} className="mt-4 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {item.category}
              </span>
              : {item.info} <br />
            </p>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((item) => (
            <Card key={item.name} className="flex flex-col items-center p-4">
              <div className="mb-2 text-3xl">{item.icon}</div>
              <div className="text-xl font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {currencyFormatter(item.value, 2)}
              </div>
              <div className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {item.name}
              </div>
              <div className="text-tremor-default text-tremor-content dark:text-dark-tremor-content mb-2 text-center">
                {item.description}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}