'use client';
import {
  RiLineChartLine,
  RiExternalLinkLine,
} from '@remixicon/react';
import { Card, LineChart } from '@tremor/react';

const PensionInflationChart = () => {

  return (
    <>
      <Card className="max-w-4xl mx-auto my-8">
        <div className="sm:flex sm:items-start sm:space-x-6">
          <div className="inline-flex shrink-0 rounded-tremor-full bg-tremor-brand-muted/50 p-2 dark:bg-dark-tremor-brand-muted/80">
            <span className="flex h-8 w-8 items-center justify-center rounded-tremor-full bg-tremor-brand dark:bg-dark-tremor-brand">
              <RiLineChartLine
                className="size-5 text-tremor-brand-inverted dark:text-tremor-brand-inverted"
                aria-hidden={true}
              />
            </span>
          </div>
          <div className="mt-4 sm:mt-0">
            <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Vývoj priemerného dôchodku a inflácie na Slovensku
            </h3>
            <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              Hodnoty starobného dôchodku očistené o infláciu ukazujú, že reálna hodnota dlhodobo rastie. Výnimkov je len kovidové obdobie v rokoch 2021-2022 a roky 2011-2012. Vykreslené hodnoty nezhŕňajú 13. dôchodky ani príspevky z II. piliera. Výška dôchodkov je tak v priemere ešte vyššia.
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
          </div>
        </div>
      </Card>
    </>
  );
}

export default PensionInflationChart;