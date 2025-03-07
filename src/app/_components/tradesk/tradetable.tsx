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
import { dataTable as data } from './tradedata';
import { valueFormatter } from './tradeutils';

interface DataItem {
  id: number;
  year: number;
  country: string;
  dovoz: number;
  vyvoz: number;
  bilancia: number;
}

export default function TradeTable() {
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const countryOptions = Array.from(new Set(data.map((item: DataItem) => item.country))).sort();
  const yearOptions = Array.from(new Set(data.map((item: DataItem) => item.year.toString()))).sort();

  const isCountrySelected = (item: DataItem) =>
    (selectedCountry.length === 0 || selectedCountry.includes(item.country)) &&
    (selectedYears.length === 0 || selectedYears.includes(item.year.toString()));

  const filteredData = data.filter((item) => isCountrySelected(item));

  return (
    <Card className="p-0 h-96 overflow-y-auto max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between md:space-x-8">
        <div className="ml-4 mt-4 sm:flex sm:items-start sm:justify-end sm:space-x-2">
          <MultiSelect
            onValueChange={(value: string[]) => setSelectedCountry(value)}
            placeholder="Vybrať krajinu"
            className="w-full sm:w-44 [&>button]:rounded-tremor-small"
          >
            {countryOptions.map((country) => (
              <MultiSelectItem key={country} value={country}>
                {country}
              </MultiSelectItem>
            ))}
          </MultiSelect>
          <MultiSelect
            onValueChange={(value: string[]) => setSelectedYears(value)}
            placeholder="Vybrať rok"
            className="mt-2 w-full sm:mt-0 sm:w-44 [&>button]:rounded-tremor-small"
          >
            {yearOptions.map((item) => (
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
              Krajina
            </TableHeaderCell>
            <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Bilancia (mil. €)
            </TableHeaderCell>
            <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Vývoz (mil. €)
            </TableHeaderCell>
            <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Dovoz (mil. €)
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
                <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {item.country.length > 24 ? item.country.slice(0, 24) + "..." : item.country}
                </TableCell>
                <TableCell className="text-right">{valueFormatter(item.bilancia,2,'')}</TableCell>
                <TableCell className="text-right">{valueFormatter(item.vyvoz,2,'')}</TableCell>
                <TableCell className="text-right">{valueFormatter(item.dovoz,2,'')}</TableCell>
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