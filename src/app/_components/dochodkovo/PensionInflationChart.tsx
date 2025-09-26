'use client';
import {
  Card,
  LineChart,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { RiExternalLinkLine } from '@remixicon/react';
import { pensionData } from './data';
import { valueFormatter } from './utils';

const chartTabs = [
  {
    name: 'Nominálny & reálny dôchodok (€)',
    categories: [
      'Priemerný dôchodok (nominálny)',
      'Reálny dôchodok (priemerný - inflácia)',
    ],
    colors: ['blue', 'rose'],
    valueFormatter: valueFormatter,
    yAxisWidth: 80,
    minValue: 100,
    maxValue: 700,
  },
  {
    name: 'Rast dôchodku a inflácia (%)',
    categories: [
      'Rast dôchodku (%)',
      'Inflácia (%)',
    ],
    colors: ['blue', 'rose'],
    valueFormatter: (n: number) => `${n?.toFixed(2)} %`,
    yAxisWidth: 60,
    minValue: -2,
    maxValue: 30,
  },
];

const chartData = pensionData.map(d => ({
  year: d.year.toString(),
  'Priemerný dôchodok (nominálny)': d.pension_average,
  'Reálny dôchodok (priemerný - inflácia)': d.pension_real,
  'Fitted line (nominálny)': d.pension_average_fit,
  'Fitted line (reálny)': d.pension_real_fit,
  'Rast dôchodku (%)': d.pension_growth,
  'Inflácia (%)': d.inflation,
}));

const PensionInflationChart = () => {
  return (
    <Card className="max-w-4xl mx-auto my-8">
      <div className="sm:flex sm:items-start sm:space-x-6">
        <div className="mt-4 sm:mt-0 flex-1">
          <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Vývoj priemerného dôchodku a inflácie na Slovensku
          </h3>
          <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
            Hodnoty starobného dôchodku očistené o infláciu ukazujú, že reálna hodnota dlhodobo rastie (v priemere o 5,2 €/rok, bez započítania inflácie o 17,8 €/rok). Výnimkov je len kovidové obdobie v rokoch 2021-2022. Vykreslené hodnoty nezhŕňajú 13. dôchodky ani príspevky z II. piliera. Výška dôchodkov je tak v priemere ešte vyššia.
          </p>
          <div className="mt-6 flex items-center space-x-5">
            <a
              href="https://www.socpoist.sk/sp-transparentne/statistiky"
              className="inline-flex items-center gap-1.5 text-tremor-default font-medium text-tremor-brand dark:text-dark-tremor-brand"
            >
              Priemerný dôchodok
              <RiExternalLinkLine className="size-4" aria-hidden={true} />
            </a>
            <a
              href="https://datacube.statistics.sk/#!/view/sk/VBD_INTERN/sp0010qs/v_sp0010qs_00_00_00_sk"
              className="inline-flex items-center gap-1.5 text-tremor-default font-medium text-tremor-brand dark:text-dark-tremor-brand"
            >
              Inflácia
              <RiExternalLinkLine className="size-4" aria-hidden={true} />
            </a>
          </div>
          <TabGroup defaultIndex={0}>
            <TabList className="mt-10">
              {chartTabs.map((tab) => (
                <Tab key={tab.name} className="font-medium">
                  {tab.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {chartTabs.map((tab) => (
                <TabPanel key={tab.name}>
                  <LineChart
                    className="h-80 mt-4"
                    data={chartData}
                    index="year"
                    categories={tab.categories}
                    colors={tab.colors}
                    valueFormatter={tab.valueFormatter}
                    yAxisWidth={tab.yAxisWidth}
                    showLegend={true}
                    minValue={tab.minValue}
                    maxValue={tab.maxValue}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </Card>
  );
};

export default PensionInflationChart;