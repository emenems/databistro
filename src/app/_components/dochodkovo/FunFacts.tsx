'use client';
import { Card } from '@tremor/react';

const data = [
  {
    title: 'Rozdiel medzi mužmi a ženami je enormný',
    description:
      'Priemerný starobný dôchodok mužov je o 23% vyšší ako dôchodok žien. Muži dostávali v roku 2024 v priemere 754,14 € a ženy 614,2 €. Ženy sa pritom dožívajú v priemere o 7 rokov viac ako muži.',
  },
  {
    title: 'Počet dôchodcov +11%, počet obyvateľov +0%',
    description:
      'Počet dôchodcov v SR narástol v období 2014 - 2024 o 11%. V roku 2024 bolo evidovaných 1 134 690 (starobných) dôchodcov. Celkový počet obyvateľov SR však zostal prakticky rovnaký (5 419 451).',
  },
  {
    title: '2,7 miliardy € ako dotáciu zo štátneho rozpočtu',
    description:
      'Výška transferu zo ŠR SR zohľadňuje finančnú výpomoc, ktorú poskytne štát Sociálnej poisťovni v prípade platobnej neschopnosti. Pôvodný plán na rok 2024 bol 1,6 miliardy € ¯\\_(ツ)_/¯.',
  },
  {
    title: 'Slovenskej Sporiteľni dôveruje najviac dôchodcov.',
    description: 'V roku 2024 bolo najviac dôchodkov vyplatených účty v Slovenskej Sporiteľni (416 131), nasleduje 365/Poštová banka (237 165) a VÚB (196 776).',
  },
  {
    title: 'Do zahraničia len 2% dôchodkov',
    description:
      'V roku 2024 bolo do zahraničia vyplatených 2% dôchodkov. To predstavuje 38 549 dôchodkov. Konkrétne krajiny Sociálna poisťovňa neuvádza.',
  },
  {
    title: 'Z II. piliera sa v priemere vypláca 24,55 €/mesiac',
    description:
      'Priemerne sa v roku 2024 vyplácalo zo starobného dôchodkového sporenia v II. pilieri 24,55 € pre Doživotný dôchodok bez zvyšovania, a 37,52 € so zvyšovaním.',
  },
];

const FunFactCard = () => {
  return (
    <>
      <Card className="max-w-4xl mx-auto my-8">
        <div className="absolute right-0 top-0 pr-3 pt-3">
        </div>
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Zaujímavosti a fakty o dôchodkoch v SR
        </h3>
        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          Následovné štatistiky boli získané z <a href="https://www.socpoist.sk/kto-som/sporitel-v-ii-pilieri/dochodok-z-ii-piliera/dalsie-informacie/statisticke-udaje-dochodkov-z?ref=2388" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">Výročnej správy Sociálnej poisťovne za rok 2024</a>, <a href="https://www.socpoist.sk/kto-som/sporitel-v-ii-pilieri/dochodok-z-ii-piliera/dalsie-informacie/statisticke-udaje-dochodkov-z?ref=2388" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis">údajov o II. piliery</a>, a z dát
          <a href="https://data.statistics.sk/api/v2/dataset/om3802rr/SK0/all/T,M,F?lang=sk&type=json" className="text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis"> Štatistického úradu SR</a>.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-start justify-between py-1 pl-4"
            >
              <div>
                <p className="-ml-2 border-l-2 border-tremor-brand pl-2 text-tremor-default font-medium text-tremor-content-strong dark:border-dark-tremor-brand dark:text-dark-tremor-content-strong">
                  {item.title}
                </p>
                <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export default FunFactCard;