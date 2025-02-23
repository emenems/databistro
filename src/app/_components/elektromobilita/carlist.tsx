'use client';

import { useState } from 'react';
import { RiSearchLine } from '@remixicon/react';
import { BarList, Card, Dialog, DialogPanel, TextInput } from '@tremor/react';
import { allowedZnacka } from './cardata';
import { DataItemBarChart as DataItem } from '../../../interfaces/elektromobilita';

interface CarBarListProps {
  title: string;
  countedVariable: string;
  data: DataItem[];
}

const CarIcon = (name?: string) => {
  if (!name) return undefined;
  let nameIcon = '';
  if (name.toLowerCase().includes('bmw')) {
    nameIcon = 'bmw';
  } else if (name.toLowerCase().includes('mercedes')) {
    nameIcon = 'mercedes%20benz';
  } else if (name.toLowerCase().includes('škoda')) {
    nameIcon = 'skoda';
  } else if (name.toLowerCase().includes('abarth')) {
    nameIcon = 'fiat';
  } else if (allowedZnacka.includes(name.toLowerCase())) {
    nameIcon = name;
  } else {
    return () => <img src='https://upload.wikimedia.org/wikipedia/commons/d/d9/Icon-round-Question_mark.svg' alt="Unkwnon" className='w-5 h-5 ml-2 mr-2' />;
  }
  const srcUrl = `https://raw.githubusercontent.com/dangnelson/car-makes-icons/refs/heads/master/svgs/${nameIcon}.svg`;
  return () => <img src={srcUrl} alt={name} className='w-5 h-5 ml-2 mr-2' />;
};


export default function CarBarList({ title, countedVariable, data }: CarBarListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dataWithIcons = data.map((item) => ({
    name: item.name,
    value: item.value,
    icon: item.znacka ? CarIcon(item.znacka.toLowerCase()) : undefined,
  }));
  const filteredItems = dataWithIcons.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <>
      <Card className="p-0 sm:mx-auto sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-tremor-border p-6 dark:border-dark-tremor-border">
          <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {title}
          </p>
        </div>
        <BarList
          data={dataWithIcons.slice(0, 5)}
          // valueFormatter={valueFormatter}
          className="p-6"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-center rounded-b-tremor-default bg-gradient-to-t from-tremor-background to-transparent py-7 dark:from-dark-tremor-background">
          <button
            className="flex items-center justify-center rounded-tremor-small border border-tremor-border bg-tremor-background px-2.5 py-2 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-dark-tremor-background-muted"
            onClick={() => setIsOpen(true)}
          >
            Viac
          </button>
        </div>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          static={true}
          className="z-[100]"
        >
          <DialogPanel className="overflow-hidden p-0">
            <div className="border-b border-tremor-border p-6 dark:border-dark-tremor-border">
              <div className="flex items-center justify-between">
                <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {countedVariable}
                </p>
              </div>
              <TextInput
                icon={RiSearchLine}
                placeholder="Search page..."
                className="mt-2 rounded-tremor-small"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <div className="h-96 overflow-y-scroll px-6 pt-4">
              {filteredItems.length > 0 ? (
                <BarList
                  data={filteredItems}
                />
              ) : (
                <p className="flex h-full items-center justify-center text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Žiadne výsledky
                </p>
              )}
            </div>
            <div className="mt-4 border-t border-tremor-border bg-tremor-background-muted p-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background">
              <button
                className="flex w-full items-center justify-center rounded-tremor-small border border-tremor-border bg-tremor-background py-2 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-dark-tremor-background-muted"
                onClick={() => setIsOpen(false)}
              >
                Späť
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </Card>
    </>
  );
}