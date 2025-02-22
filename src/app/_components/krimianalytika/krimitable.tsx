'use client';

import { useState } from 'react';
import {
  Card,
  MultiSelect,
  MultiSelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { dataTable as data } from './krimidata';

interface DataItem {
  id: number;
  year: string;
  category: string;
  registered: number;
  explained: number;
}

export default function KrimiTable() {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const isStatusSelected = (item: DataItem) =>
    (selectedStatus.length === 0 || selectedStatus.includes(item.category)) &&
    (selectedYears.length === 0 || selectedYears.includes(item.year));

  const filteredData = data.filter((item) => isStatusSelected(item));

  return (
    <Card className="p-0 h-96 overflow-y-auto">
      <div className="md:flex md:items-center md:justify-between md:space-x-8">
        <div className="ml-4 mt-4 sm:flex sm:items-start sm:justify-end sm:space-x-2">
          <MultiSelect
            onValueChange={(value: string[]) => setSelectedStatus(value)}
            placeholder="Vybrať kategóriu"
            className="w-full sm:w-44 [&>button]:rounded-tremor-small"
          >
            <MultiSelectItem value="Ekonomická">Ekonomická</MultiSelectItem>
            <MultiSelectItem value="Majetková">Majetková</MultiSelectItem>
            <MultiSelectItem value="Násilná">Násilná</MultiSelectItem>
            <MultiSelectItem value="Mravnostná">Mravnostná</MultiSelectItem>
            <MultiSelectItem value="Ostatná">Ostatná</MultiSelectItem>
            <MultiSelectItem value="Zostávajúca">Zostávajúca</MultiSelectItem>
            <MultiSelectItem value="Celková">Celková</MultiSelectItem>
          </MultiSelect>
          <MultiSelect
            onValueChange={(value: string[]) => setSelectedYears(value)}
            placeholder="Vybrať rok"
            className="mt-2 w-full sm:mt-0 sm:w-44 [&>button]:rounded-tremor-small"
          >
            {['2012','2013','2014','2015','2016','2017','2018','2019','2020','2011','2022','2023','2024'].map((item) => (
              <MultiSelectItem key={item} value={item}>
                {item}
              </MultiSelectItem>
            ))}
          </MultiSelect>
        </div>
      </div>
      <Table className="mt-2">
        <TableHead>
          <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
            <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Rok
            </TableHeaderCell>
            <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Kategória
            </TableHeaderCell>
            <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Zistené
            </TableHeaderCell>
            <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Objasnené
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {item.year}
                </TableCell>
                <TableCell className='font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>
                  {item.category}
                </TableCell>
                <TableCell className="text-right">{item.registered}</TableCell>
                <TableCell className="text-right">{item.explained}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Žiadne záznamy
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}