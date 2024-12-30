'use client';

import { useState } from 'react';
import { Card, ProgressBar, BarChart, AreaChart, BarList} from '@tremor/react';

const birthday = {
    'totalMembers': 157,
    'uniqueMembers': 23,
    'birthdayVotes': 348,
    'birthdayVotesPercentage': 0.12
}

const restrainedMember = {
    'memberVotes': 761,
    'votesPercentage': 39.11,
    'memberName': 'Juraj Krúpa',
    'memberParty': 'Sloboda a Solidarita'
}

const leastMember = {
    'memberVotes': 717,
    'votesPercentage': 0.1,
    'memberName': 'Igor Válek',
    'memberParty': 'SMER - sociálna demokracia'
}

const titles = [
    {'počet titulov': 0, 'frekvencia': 9},
    {'počet titulov': 1, 'frekvencia': 108},
    {'počet titulov': 2, 'frekvencia': 28},
    {'počet titulov': 3, 'frekvencia': 10},
    {'počet titulov': 4, 'frekvencia': 2}
]

const age = [
    {'vek': 25, 'počet': 1},
    {'vek': 28, 'počet': 2},
    {'vek': 29, 'počet': 1},
    {'vek': 31, 'počet': 1},
    {'vek': 32, 'počet': 1},
    {'vek': 33, 'počet': 5},
    {'vek': 34, 'počet': 2},
    {'vek': 35, 'počet': 5},
    {'vek': 36, 'počet': 3},
    {'vek': 37, 'počet': 1},
    {'vek': 38, 'počet': 2},
    {'vek': 39, 'počet': 2},
    {'vek': 40, 'počet': 5},
    {'vek': 41, 'počet': 6},
    {'vek': 42, 'počet': 9},
    {'vek': 43, 'počet': 6},
    {'vek': 44, 'počet': 5},
    {'vek': 45, 'počet': 5},
    {'vek': 46, 'počet': 5},
    {'vek': 47, 'počet': 5},
    {'vek': 48, 'počet': 4},
    {'vek': 49, 'počet': 4},
    {'vek': 50, 'počet': 9},
    {'vek': 51, 'počet': 8},
    {'vek': 52, 'počet': 3},
    {'vek': 53, 'počet': 4},
    {'vek': 54, 'počet': 5},
    {'vek': 55, 'počet': 1},
    {'vek': 56, 'počet': 6},
    {'vek': 57, 'počet': 1},
    {'vek': 58, 'počet': 4},
    {'vek': 59, 'počet': 3},
    {'vek': 60, 'počet': 2},
    {'vek': 61, 'počet': 4},
    {'vek': 62, 'počet': 3},
    {'vek': 63, 'počet': 1},
    {'vek': 64, 'počet': 1},
    {'vek': 65, 'počet': 5},
    {'vek': 66, 'počet': 2},
    {'vek': 67, 'počet': 2},
    {'vek': 68, 'počet': 2},
    {'vek': 69, 'počet': 4},
    {'vek': 71, 'počet': 1},
    {'vek': 73, 'počet': 1},
    {'vek': 75, 'počet': 1},
    {'vek': 76, 'počet': 2},
    {'vek': 77, 'počet': 1},
    {'vek': 80, 'počet': 1}
]

const kraj = [
    {'name': 'Bratislavský', 'value':55},
    {'name': 'Prešovský', 'value':24},
    {'name': 'Nitriansky', 'value':15},
    {'name': 'Banskobystrický', 'value':14},
    {'name': 'Trnavský', 'value':14},
    {'name': 'Žilinský', 'value':13},
    {'name': 'Košický', 'value':12},
    {'name': 'Trenčiansky', 'value':10}
]

export default function DonutChartUsageExampleWithCustomTooltip() {
  const [extended, setExtended] = useState(false);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Koľkokráť hlasovali poslanci na svoje narodeniny?
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {birthday.birthdayVotes} krát
                </span>
            </dd>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Celkovo {birthday.uniqueMembers} poslancov</span>
            </p>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Podiel z celkového počtu hlasov {birthday.birthdayVotesPercentage}%</span>
            </p>
            <ProgressBar value={birthday.birthdayVotesPercentage} color="blue" className="mt-3" />
        </Card>
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Ako často sa zdržal najzdržanlivejší poslanec?
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {restrainedMember.memberVotes} krát
                </span>
            </dd>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Poslanec {restrainedMember.memberName} ({restrainedMember.memberParty})</span>
            </p>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Podiel z celkového počtu hlasovaní {restrainedMember.votesPercentage}%</span>
            </p>
            <ProgressBar value={restrainedMember.votesPercentage} color="blue" className="mt-3" />
        </Card>
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Aký počet preferenčných hlasov stačil na mandát?
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {leastMember.memberVotes} hlasov
                </span>
            </dd>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Poslanec {leastMember.memberName} ({leastMember.memberParty})</span>
            </p>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Podiel vo voľbách 2023: {leastMember.votesPercentage}%</span>
            </p>
            <ProgressBar value={leastMember.votesPercentage} color="blue" className="mt-3" />
        </Card>
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Koľko titulov majú poslanci najčastejšie?
            </dt>
            <BarChart
                className="mt-4 max-h-48"
                data={titles}
                index="počet titulov"
                categories={['frekvencia']}
                colors={['blue']}
                yAxisWidth={50}
                showLegend={false}
            />
        </Card>
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Aké je rozdelenie podlancov podľa veku?
            </dt>
            <AreaChart
                className="mt-4 max-h-48"
                data={age}
                index="vek"
                categories={['počet']}
                colors={['blue']}
                yAxisWidth={50}
                showLegend={false}
            />
        </Card>
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Z akého kraja pochádza najviac poslancov?
            </dt>
            <div className={`overflow-hidden p-6 ${extended ? '' : 'max-h-48'}`}>
          <BarList data={kraj} />
        </div>
        <div
          className={`flex justify-center ${
            extended
              ? 'px-6 pb-6'
              : 'absolute inset-x-0 bottom-0 rounded-b-tremor-default bg-gradient-to-t from-tremor-background to-transparent py-7 dark:from-dark-tremor-background'
          }`}
        >
          <button
            className="flex items-center justify-center rounded-tremor-small border border-tremor-border bg-tremor-background px-2.5 py-2 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-dark-tremor-background-muted"
            onClick={() => setExtended(!extended)}
          >
            {extended ? 'Ukáž menej' : 'Ukáž viac'}
          </button>
        </div>
        </Card>
    </div>
  );
}
