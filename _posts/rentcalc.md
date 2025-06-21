---
title: "Ako vypočítať reálny príjem z prenájmu nehnuteľnosti?"
titleKey: "Rent-kulačka"
code:
  source: ../../_components/rentcalc/page
  name: RentCalc
excerpt: "Rýchly výpočet a vizualizácia nákladov & príjmov z prenájmu nehnuteľností a ich porovnanie s alternatívnimy investíciami."
coverImage: "/assets/blog/images/rentcalc/cover.png"
date: "2024-07-21T00:00:00Z"
author:
  name: Michal
  picture: "/assets/blog/images/authors/mm.jpeg"
ogImage:
  url: "/assets/blog/images/rentcalc/cover.png"
---

## Upozornenie

**Výpočet je len orientačný** a nezahŕňa všetky možné náklady a príjmy!  
'Cena + inflácia' je vypočítaná ako rozdiel medzi počiatočnou cenou a cenou po započítaní inflácie (vstup je ročná 'Inflácia: nehnuteľnosti'). Daň je v tomto prípade aplikovaná len na prvých 5 roky ([predaj po 5 rokov + 1 deň je oslobodený od dane](https://www.financnasprava.sk/sk/obcania/zivotn/predaj-nehnutelnosti)).  

V stĺpcoch pre termínovaný a zložený vklad je daň aplikovaná jednotne podľa hodnoty v 'Dane a odvody'. 

V prípade 'Dow Jones' je strhnutá daň len pre prvý rok. Hodnoty sú vypočítané pomocou kĺzavého primeru pre danú dĺžku (1 - 10 rokov) s použitím Closing hodnôt za obdobie 2005-06-01 až 2025-06-20. Pre iné obdobie možno použiť API Backend, napr. [/api/investing/index/returns?index=%5EDJI&start_date=2005-06-01&end_date=2025-06-20](/api/investing/index/returns?index=%5EDJI&start_date=2005-06-01&end_date=2025-06-20). Správcovský poplatok je aplikovaný na každý rok a vstupnú sumu.

Hodnoty 'S prenájmom' sú súčtom 'Cena + inflácia' a čistého prenájmu, pričom 'Inflácia: nájom - náklady' je aplikovaná od druhého roku prenájmu (pri zadávní 'Inflácia: nájom - náklady' je odporúčané brať do úvahy nie len zvýšenie prenájmu ale aj nákladov). Defaultné hodnoty týchto premenných **neodrážajú realitu!**

## Zdroje

Bližšie informácie o výpočte zdanenia príjmov z nehnuteľnosti nájdete na stránkach: 

\* [Finančnej správy](https://podpora.financnasprava.sk/639339-Výdavky-pri-prenájme-nehnuteľnosti-nezaradenej-do-obchodného-majetku-)  
\* [KROS.sk](https://www.kros.sk/blog/ako-zdanit-prijem-z-prenajmu-nehnutelnosti-za-rok-2023/)  


Informácie o daniach a odvodoch rôznych investičných stratégií možno nájast na stránkach [finax.eu](https://www.finax.eu/sk/blog/kompletny-prehlad-zdanovania-prijmov-z-investicii). Priemerný vývoj cien nehtnuteľností je možné nájsť [na webe NBS](https://nbs.sk/statisticke-udaje/vybrane-makroekonomicke-ukazovatele/ceny-nehnutelnosti-na-byvanie/vyvoj-cien-nehnutelnosti-na-byvanie-v-sr/).


_(okdazy vytvorené 21.07.2024, príspevok aktualizovaný 14.06.2025)_  