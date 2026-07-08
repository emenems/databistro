---
title: "Ako (ne)pravdepodobné je, že štvrťfinále MS 2026 bude plné tímov z Európy?"
titleKey: "UEFA vs Afrika na MS 2026"
date: "2026-07-08T00:00:00Z"
coverImage: "/assets/blog/images/olympics/cover.png"
author:
  name: Michal
  picture: "/assets/blog/images/authors/mm.jpeg"
excerpt: "Presné výpočty pod modelom rovnako silných tímov: aká je šanca, že v štvrťfinále bude UEFA >= 6 (alebo že CAF bude <= 1)?"
ogImage:
  url: "/assets/blog/images/olympics/cover.png"
code:
  source: ../../_components/worldcup2026/page
  name: WorldCup2026Sim
---

## Mýtus
Často sa tvrdí, že UEFA má v štvrťfinále MS 2026 “automaticky” veľa tímov, lebo Európa je údajne silnejšia. Ale možno je to len dôsledok toho, že UEFA posiela do turnaja viac tímov v skupinách (a tie sa potom “prebijú” ďalej).

Tento článok používa **presný (exaktne vypočítaný) model** rovnakého “hernogénu” pre všetky tímy.

## Model (čo je a čo nie je v modeli)
- **Skupiny:** každý tím je rovnako silný. Zápas medzi dvoma tímami má:
  - remízu s pravdepodobnosťou, ktorú si nastavíte v simulátore
  - inak výhru pre jedného alebo druhého tímu (spravodlivé 50/50)
- **Body v skupine:** výhra = 3, remíza = 1, prehra = 0.
- **Rovnosť bodov:** ak majú tímy rovnaký počet bodov (na miestach rozhodujúcich o 1./2./3. mieste), poradie sa určí náhodne (random tie-break).
- **Najlepšie tretie tímy:** berieme 8 tímov s najvyšším počtom bodov na 3. mieste. Pri rovnosti na “hranici” sa výber určí náhodne.
- **Vyraďovanie:** nakoľko sú všetky tímy rovako silné, pre účel konfederácií používame symetriu tak, že 8 tímov v štvrťfinále zodpovedá **náhodnému výberu 8 tímov z 32 kvalifikovaných**.

## Skupiny a konfederácie
(vstupné tímy sú presne podľa zoznamu v zadaní: konfederácia je kľúčový atribút pre tento “debunk”.)

### Konfederácie v skupinách
| Skupina | Tímy | Konfederácie |
| --- | --- | --- |
| A | Mexico, South Africa, South Korea, Czechia | CONCACAF, CAF, AFC, UEFA |
| B | Canada, Bosnia and Herzegovina, Qatar, Switzerland | CONCACAF, UEFA, AFC, UEFA |
| C | Brazil, Morocco, Haiti, Scotland | CONMEBOL, CAF, CONCACAF, UEFA |
| D | United States, Paraguay, Australia, Turkey | CONCACAF, CONMEBOL, AFC, UEFA |
| E | Germany, Curaçao, Ivory Coast, Ecuador | UEFA, CONCACAF, CAF, CONMEBOL |
| F | Netherlands, Japan, Sweden, Tunisia | UEFA, AFC, UEFA, CAF |
| G | Belgium, Egypt, Iran, New Zealand | UEFA, CAF, AFC, OFC |
| H | Spain, Cape Verde, Saudi Arabia, Uruguay | UEFA, CAF, AFC, CONMEBOL |
| I | France, Senegal, Iraq, Norway | UEFA, CAF, AFC, UEFA |
| J | Argentina, Algeria, Austria, Jordan | CONMEBOL, CAF, UEFA, AFC |
| K | Portugal, DR Congo, Uzbekistan, Colombia | UEFA, CAF, AFC, CONMEBOL |
| L | England, Croatia, Ghana, Panama | UEFA, UEFA, CAF, CONCACAF |

## Čo si overujeme
Simulátor zobrazuje pravdepodobnosti, že:
- **UEFA bude v štvrťfinále aspoň 6 / 7 / 8 tímov**
- **CAF (Afrika) bude v štvrťfinále najviac 1 / najviac 2 tímov**

Spúšťajte “presné” prepočítanie pre rôzne pravdepodobnosti remíz.

