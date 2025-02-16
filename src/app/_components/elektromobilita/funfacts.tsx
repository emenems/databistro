'use client';

import CarBarList from './carlist';
import FunFactCard from './carkpi';
import { stats, dataZnacka, dataModel, dataPracovisko } from './cardata';

const showYear = 2024;

export default function FunFacts() {
  const statsYear = stats.find(stat => stat.year === showYear) || { 'pocet_elektro': 0, 'pocet_neelektro': 0, 'hmotnost_elektro': 0, 'vykon_elektro': 0 };
  const statsPrevYear = stats.find(stat => stat.year === showYear - 1) || { 'pocet_elektro': 0, 'pocet_neelektro': 0, 'hmotnost_elektro': 0, 'vykon_elektro': 0 };
  const elektrickeRation = statsYear['pocet_elektro'] / (statsYear['pocet_elektro'] + statsYear['pocet_neelektro']);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <FunFactCard 
          dataPlot={stats.map(stat => ({
              name: String(stat.year), 
              value: stat['pocet_elektro']
          }))}
          title='Počet nových elektromobilov'
          unit='áut'
          secondDescription='z celkového počtu nových registrácií'
          currentYearData={statsYear['pocet_elektro']} 
          previousYearData={statsPrevYear['pocet_elektro']}
          ratio={elektrickeRation}
          showYear={showYear}
        />
        <FunFactCard 
          dataPlot={stats.map(stat => ({
              name: String(stat.year), 
              value: stat['hmotnost_elektro']
          }))}
          title='Priemerná hmotnosť elektromobilu'
          unit='kg'
          secondDescription=''
          currentYearData={statsYear['hmotnost_elektro']} 
          previousYearData={statsPrevYear['hmotnost_elektro']}
          ratio={0}
          showYear={showYear}
        />
        <FunFactCard 
          dataPlot={stats.map(stat => ({
              name: String(stat.year), 
              value: stat['vykon_elektro']
          }))}
          title='Priemerný (max) výkon elektromobilu'
          unit='kW'
          secondDescription=''
          currentYearData={statsYear['vykon_elektro']} 
          previousYearData={statsPrevYear['vykon_elektro']}
          ratio={0}
          showYear={showYear}
        />
        <CarBarList
          title='Najpredávanejšia značka elektromobilov (%)'
          countedVariable='Značka'
          data={dataZnacka.map(item => ({
            name: item.znacka,
            value: item.podiel,
            znacka: item.znacka
          }))}
        />
        <CarBarList 
          title='Najpredávanejší model* elektromobilu (%)'
          countedVariable='počet'
          data={dataModel.map(item => ({
            name: item.model,
            value: item.podiel,
            znacka: item.znacka
          }))}
        />
        <CarBarList 
          title='Okres s najvačším počtrom registrácií (%)'
          countedVariable='počet'
          data={dataPracovisko.map(item => ({
            name: item.pracovisko,
            value: item.podiel,
            znacka: undefined
          }))}
        />
    </div>
  );
}
