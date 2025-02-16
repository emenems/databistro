'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Card,
  Button,
} from '@tremor/react';
import Spinner from './spinner';
import { DataItem } from '@/interfaces/elektromobilita';


const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const znacky = [
  'ACCES MOTOR', 'AIWAYS', 'ALFA ROMEO', 'AUDI', 'BMW',
  'BYD', 'CHEVROLET', 'CITROEN', 'CUPRA', 'DACIA', 'DFSK',
  'DONGFENG', 'DS', 'E.GO', 'FAW', 'FIAT', 'FORD', 'FORTHING', 'GMC',
  'HONDA', 'HYUNDAI', 'JAGUAR', 'JEEP', 'KIA', 'LEXUS', 'LOTUS',
  'MAZDA', 'MERCEDES-BENZ', 'MG', 'MINI', 'MITSUBISHI', 'NIO',
  'NISSAN', 'OPEL', 'PEUGEOT', 'POLESTAR', 'PORSCHE', 'RENAULT',
  'ROLLS ROYCE', 'SEAT', 'SERES', 'SMART', 'SSANGYONG', 'SUBARU',
  'TESLA', 'TOYOTA', 'VOLKSWAGEN', 'VOLVO', 'VOYAH', 'WULING',
  'XPENG', 'ZEEKR', 'ŠKODA'
];

export default function CarTable() {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedZnacka, setSelectedZnacka] = useState<string>('ŠKODA');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedPracovisko, setSelectedPracovisko] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/api/elektroauta/table/electric?year=${selectedYear}&znacka=${selectedZnacka}`;
        if (selectedModel) {
          url += `&model=${selectedModel}`;
        }
        if (selectedPracovisko) {
          url += `&pracovisko=${selectedPracovisko}`;
        }
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedZnacka, selectedModel, selectedPracovisko]);

  const clearFilters = () => {
    setSelectedYear('2024');
    setSelectedZnacka('ŠKODA');
    setSelectedModel('');
    setSelectedPracovisko('');
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <Card className="h-[500px] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4">
          <div className="md:flex md:items-center md:justify-between md:space-x-8">
            <div>
              <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {/* Workspaces */}
              </h3>
              <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                {/* Overview of all registered druhKaroseries within your organization. */}
              </p>
            </div>
            <div className="mt-4 sm:flex sm:items-center sm:space-x-2 md:mt-0">
              <Select
                onValueChange={setSelectedYear}
                placeholder="Vyberte rok..."
                className="w-full sm:w-44 [&>button]:rounded-tremor-small"
                value={selectedYear}
                defaultValue='2024'
              >
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </Select>
              <Select
                onValueChange={setSelectedZnacka}
                placeholder="Vyberte značku..."
                className="w-full sm:w-44 [&>button]:rounded-tremor-small"
                value={selectedZnacka}
              >
                {znacky.map((znacka) => (
                  <SelectItem key={znacka} value={znacka}>
                    {znacka}
                  </SelectItem>
                ))}
              </Select>
              <Select
                onValueChange={setSelectedModel}
                placeholder="Vyberte model..."
                className="w-full sm:w-44 [&>button]:rounded-tremor-small"
                value={selectedModel}
              >
                <SelectItem value="">Všetky</SelectItem>
                {Array.from(new Set(data.map((item) => item.model))).map((model) => (
                  <SelectItem key={model} value={String(model)}>
                    {model}
                  </SelectItem>
                ))}
              </Select>
              <Select
                onValueChange={setSelectedPracovisko}
                placeholder="Vyberte pracovisko..."
                className="w-full sm:w-44 [&>button]:rounded-tremor-small"
                value={selectedPracovisko}
              >
                <SelectItem value="">Všetky</SelectItem>
                {Array.from(new Set(data.map((item) => item.pracovisko))).map((pracovisko) => (
                  <SelectItem key={pracovisko} value={String(pracovisko)}>
                    {pracovisko}
                  </SelectItem>
                ))}
              </Select>
              <Button onClick={clearFilters} className="mt-2 sm:mt-0">
                Reset
              </Button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <Table className="mt-8">
            <TableHead>
              <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                <TableHeaderCell>Registrácia</TableHeaderCell>
                <TableHeaderCell>Značka</TableHeaderCell>
                <TableHeaderCell>Model</TableHeaderCell>
                <TableHeaderCell>Hmotnosť</TableHeaderCell>
                <TableHeaderCell>Výkon</TableHeaderCell>
                <TableHeaderCell className="text-right">Pracovisko</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length ? (
                data.map((item) => (
                  <TableRow key={`${item.registracia}-${item.model}-${item.pracovisko}`}>
                    <TableCell>{item.registracia}</TableCell>
                    <TableCell>{item.znacka}</TableCell>
                    <TableCell>{truncateText(item.model, 20)}</TableCell>
                    <TableCell>{item.hmotnost}</TableCell>
                    <TableCell>{item.vykon}</TableCell>
                    <TableCell className="text-right">{item.pracovisko}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Žiadne výsledky
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}