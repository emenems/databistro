
const salary_height_latest= {
  "Hrubý príjem":
    [{
      name: "Priemerý plat",
      value: 1524.0
    }, {
      name: "Priemerný dôchodok",
      value: 683.1
    }, {
      name: "Minimálna mzda",
      value: 750.0
    },
    {
      name: "Životné minimum",
      value: 273.99
    }],
  "Čistý príjem":
    [{
      name: "Priemerý plat",
      value: 1158.44
    }, {
      name: "Priemerný dôchodok",
      value: 683.1
    }, {
      name: "Minimálna mzda",
      value: 615.50
    },
    {
      name: "Životné minimum",
      value: 273.99
    }],
};

const netData = salary_height_latest["Čistý príjem"];
const grossData = salary_height_latest["Hrubý príjem"];
export const stackedBarData = netData.map((item, idx) => {
  // Find matching gross value by name
  const grossItem = grossData.find(g => g.name === item.name);
  const grossValue = grossItem ? grossItem.value : item.value;
  const diff = Math.max(grossValue - item.value, 0);
  return {
    name: item.name,
    "Čistý príjem": item.value,
    "Odvody a dane": diff,
  };
});


const sparkData = [
  // { average_wage: 769.0, pension_average: 353.0, minimum_wage: null },
  // { average_wage: 786.0, pension_average: 362.0, minimum_wage: null },
  // { average_wage: 805.0, pension_average: 376.0, minimum_wage: null },
  // { average_wage: 824.0, pension_average: 391.0, minimum_wage: null },
  // { average_wage: 858.0, pension_average: 400.0, minimum_wage: null },
  // { average_wage: 883.0, pension_average: 411.0, minimum_wage: null },
  { average_wage: 912.0, pension_average: 417.0, minimum_wage: 405.0 },
  { average_wage: 954.0, pension_average: 428.0, minimum_wage: 435.0 },
  { average_wage: 1013.0, pension_average: 444.0, minimum_wage: 480.0 },
  { average_wage: 1092.0, pension_average: 460.0, minimum_wage: 520.0 },
  { average_wage: 1133.0, pension_average: 487.0, minimum_wage: 580.0 },
  { average_wage: 1211.0, pension_average: 506.0, minimum_wage: 623.0 },
  { average_wage: 1304.0, pension_average: 519.0, minimum_wage: 646.0 },
  { average_wage: 1430.0, pension_average: 649.0, minimum_wage: 700.0 },
  { average_wage: 1524.0, pension_average: 683.1, minimum_wage: 750.0 },
];

export const sparkConfigs = [
  {
    data: sparkData.map((d, i) => ({ year: (2016 + i).toString(), value: d.average_wage })),
    color: 'blue',
    label: 'Priemerný plat',
  },
  {
    data: sparkData.map((d, i) => ({ year: (2016 + i).toString(), value: d.pension_average })),
    color: 'blue',
    label: 'Starobný dôchodok',
  },
  {
    data: sparkData.map((d, i) => ({ year: (2016 + i).toString(), value: d.minimum_wage })),
    color: 'blue',
    label: 'Minimálna mzda',
  },
];


// --- Use your provided dataMeasures data ---
export const dataMeasures = {
  "Zrušenie 3 dní pracovného pokoja a zákazu predaja počas sviatkov": {
    "náklady": 230,
    "vysvetlenie": "Niektoré sviatky už nebudú voľné dni a obchody môžu byť otvorené. Ekonomika získa vyššiu aktivitu, ale ľudia prídu o časť voľna a rodinného pokoja.",
  },
  "Zvýšenie ceny diaľničnej známky o 30 EUR": {
      "náklady": 45,
      "vysvetlenie": "Cena ročnej diaľničnej známky stúpne o 30 Eur. To priamo zdraží cestovanie autom po diaľniciach, čo môže ovplyvniť najmä ľudí, ktorí často cestujú za prácou alebo rodinou.",
  },
  "Zvýšenie dane za hazard": {
    "náklady": 54,
    "vysvetlenie": "Kasína a online herne budú viac zdaňované. Hráči môžu očakávať vyššie poplatky alebo nižšie výhry. Cieľom je získať viac peňazí pre štát a obmedziť hazard, no môže rásť čierny trh.",
  },
  "Zavedenie QR platieb": {
    "náklady": 14,
    "vysvetlenie": "Obchodníci budú musieť umožniť zákazníkom platiť kartou alebo QR kódom. Pre zákazníkov je to pohodlnejšie, ale malé prevádzky budú mať nové náklady na techniku a prevádzku.",
  },
  "Skrátenie odvodových prázdnin pre SZČO (6 namiesto 12 mesiacov)": {
    "náklady": 119,
    "vysvetlenie": "Nový živnostník začne platiť sociálne odvody už po 6 mesiacoch (doteraz po roku). To síce posilní sociálny systém, ale môže odradiť ľudí od začatia podnikania.",
  },
  "Zvýšenie sadzby dane z poistenia z 8% na 10% - neživotné poistenie": {
    "náklady": 36,
    "vysvetlenie": "Poistenie majetku, auta či iné neživotné poistenia zdražejú, pretože poisťovne budú musieť odviesť vyššiu daň štátu. V praxi sa to pravdepodobne prejaví na vyšších poistných pre ľudí aj firmy.",
  },
  "Zvýšenie zdravotného odvodu (poistenia) zamestnanca o 1%": {
    "náklady": 358,
    "vysvetlenie": "Každý zamestnanec, SZČO aj samoplatiteľ zaplatí o 1 % viac zo svojej mzdy na zdravotné poistenie. Čistý príjem sa zníži, čo pocíti každá domácnosť.",
  },
  "Zvýšenie daňovej licencie pre firmy s príjmom nad 5 mil. €": {
    "náklady": 10,
    "vysvetlenie": "Veľké firmy budú platiť vyššiu minimálnu daň (11 520 € namiesto 3 840 €). Malých podnikov sa to netýka, ale veľké podniky môžu zvýšené náklady premietnuť do cien alebo obmedziť investície.",
  },
  "Neplatenie rodičovi počas starostlivosti o dieťa sociálne odvody": {
    "náklady": 48,
    "vysvetlenie": "Štát prestane za rodičov na materskej alebo rodičovskej dovolenke platiť sociálne odvody. Rodičom sa tým v budúcnosti môže znížiť dôchodok. Krátkodobo to šetrí štátu peniaze, no dlhodobo to znevýhodňuje najmä ženy, ktoré sú doma s deťmi dlhšie.",
  },
  "Zvýšenie DPH z 19% na 23%": {
      "náklady": 756,
      "vysvetlenie": "Základná DPH stúpne na 23 %. Takmer všetky tovary a služby (okrem potravín, kníh, liekov a ďalších vo výnimkách) zdražejú. Znamená to vyššie ceny v obchodoch a vyššie životné náklady pre domácnosti. Napr. ",
  },
  "Zníženie odpočtu DPH na autá firiem na 50%": {
    "náklady": 86,
    "vysvetlenie": "Firmy si budú môcť odpočítať DPH pri kúpe auta len na polovicu, ak ho používajú aj súkromne. To môže odradiť od nákupu nových áut a zvýšiť firemné náklady.",
  },
  "Zvýšenie odvodu DSS a DDS z 4,36 na 15%": {
    "náklady": 5,
    "vysvetlenie": "Správcovské spoločnosti (dôchodkové a doplnkové fondy) budú platiť vyšší odvod z ich ziskov. Štát tým získa viac peňazí, ale hrozí, že fondy zvýšia poplatky pre sporiteľov alebo ponúknu nižšie výnosy.",
  },
  "Zvýšenie DPH na potravniny ako chipsy, tyčinky, čokolády, zmrzlina a podobne": {
    "náklady": 91,
    "vysvetlenie": "DPH na sladkosti, chipsy a sladené nápoje sa zvýši z 19 % na 23 %. Tieto výrobky budú drahšie o pár centov. Cieľ je obmedziť nezdravé potraviny, ale reálne to znamená vyššie výdavky pre rodiny, ktoré ich kupujú.",
  },
  "Zavedenie dane z materiálov ako štrk, piesok či kameň": {
    "náklady": 24,
    "vysvetlenie": "Ťažba nového štrku, piesku a kameňa bude spoplatnená. Cieľ je podpora recyklácie. V praxi to ale môže zdražiť stavebné práce, cesty či bývanie.",
  },
};