'use client';
import { Card, BarChart } from '@tremor/react';
// import SparklineBox from './SparklineBox';
import { sparkConfigs, stackedBarData } from './data';
import AreaChartBox from './AreaChartBox';
import { valueFormatter } from './utils';

const data = [
  {
    title: 'Priemerný plat',
    description: 'Hodnota zahŕňa hrubú mzdu, ktorá pozostáva zo základného platu, odmien, a príplatkov. Do priemeru nie sú zahrnuté manažérske a podnikateľské príjmy.',
    linkText: 'Vstupné údaje',
    href: 'https://statdat.statistics.sk/cognosext/cgi-bin/cognos.cgi?b_action=cognosViewer&ui.action=run&ui.object=storeID%28%22i94C7052B240A492FB3BE8C7A487D337B%22%29&ui.name=Priemerná+mesačná+mzda+v+hospodárstve+SR+%5Bpr0204qs%5D&run.outputFormat=&run.prompt=true&cv.header=false&ui.backURL=%2Fcognosext%2Fcps4%2Fportlets%2Fcommon%2Fclose.html&run.outputLocale=sk',
  },
  {
    title: 'Starobný dôchodok',
    description:
      'Priemerná hodnota nezahŕňa 13. dôchodky ani príspevky z II. piliera. Dôchodkové dávky vyplácané v SR sú navyše od dane z príjmov oslobodené. ',
    linkText: 'Stiahnutie dáta',
    href: 'https://www.socpoist.sk/sites/default/files/2025-02/Štatistické%20údaje%20z%20oblasti%20dôchodkového%20poistenia%20rok%202024.xlsx',
  },
  {
    title: 'Minimálna mzda',
    description:
      'Výšku stanovuje nariadenie vlády SR vždy k 1. januáru príslušného kalendárneho roka. Mzda podlieha daňovej a odvodovej povinnosti.',
    linkText: 'Viac informácií',
    href: 'https://www.ip.gov.sk/minimalna-mzda/',
  },
];
const AverageSalaryPension = () => {
  return (
    <Card className="max-w-4xl mx-auto my-8">
      <div className="absolute right-0 top-0 pr-3 pt-3">
        </div>
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Priemerný plat a dôchodky v roku 2024
        </h3>
        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          Pre porovnanie je uvedené aj <a href="https://www.employment.gov.sk/sk/rodina-socialna-pomoc/hmotna-nudza/zivotne-minimum/" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">životné minimum</a>. Životné minimum je spoločensky uznaná minimálna hranica príjmov fyzickej osoby, pod ktorou nastáva stav jej hmotnej núdze.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, idx) => (
            <div
              key={item.title}
              className="flex flex-col items-start justify-between border-l-2 border-blue-100 py-1 pl-4 dark:border-blue-400/10"
            >
              <div className="flex-1 w-full">
                <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {item.title}
                </p>
                <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                  {item.description}
                </p>
              </div>
              {/* <SparklineBox {...sparkConfigs[idx]} /> */}
              <AreaChartBox
                {...sparkConfigs[idx]}
                valueFormatter={valueFormatter}
              />
              <a
                href={item.href}
                className="mt-4 text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis"
              >
                {item.linkText} &#8594;
              </a>
            </div>
          ))}
        </div>
        <BarChart
          data={stackedBarData}
          index="name"
          categories={["Čistý príjem", "Odvody a dane"]}
          colors={["blue", "rose"]}
          stack={true}
          showLegend={true}
          yAxisWidth={100}
          valueFormatter={valueFormatter}
          className="mt-10 h-72"
        />
    </Card>
  );
};
export default AverageSalaryPension;