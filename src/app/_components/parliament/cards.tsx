'use client';

import { Card, ProgressBar } from '@tremor/react';

const votes = {
    'totalVotes': 1946,
    'totalVotesCount': 252991,
    'votesPassed': 1050,
    'votesFailed': 896,
    'votesInvalid': 197,
    'votesOverThreshold': 660
}

export default function DonutChartUsageExampleWithCustomTooltip() {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
        <Card className="mx-auto max-w-sm">
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Počet hlasovaní
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {votes.totalVotes}
                </span>
            </dd>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Prešlo {((votes.votesPassed/votes.totalVotes)*100).toFixed(2)}%</span>
                <span>{votes.votesPassed}</span>
            </p>
            <ProgressBar value={((votes.votesPassed/votes.totalVotes)*100)} color="blue" className="mt-3" />
        </Card>
        <Card className="mx-auto max-w-sm">
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Počet hlasov celkom
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {votes.totalVotesCount}
                </span>
            </dd>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Stlačení hlas. tlačidla {((votes.totalVotesCount/(votes.totalVotes*150))*100).toFixed(2)}%</span>
            </p>
            <ProgressBar value={((votes.totalVotesCount/(votes.totalVotes*150))*100)} color="blue" className="mt-3" />
        </Card>
        <Card className="mx-auto max-w-sm">
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Podiel neplatných hlasov
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {((votes.votesInvalid/(votes.totalVotesCount))*100).toFixed(2)}%
                </span>
            </dd>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Počet neplatných hlasov {votes.votesInvalid}</span>
            </p>
            <ProgressBar value={((votes.votesInvalid/(votes.totalVotesCount))*100)} color="blue" className="mt-3" />
        </Card>
        <Card className="mx-auto max-w-sm">
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Hlasovaní nad 79 hlasov
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
                <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {((votes.votesOverThreshold/(votes.totalVotes))*100).toFixed(2)}%
                </span>
            </dd>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                <span>Počet hlasovaní {votes.votesOverThreshold}</span>
            </p>
            <ProgressBar value={((votes.votesOverThreshold/(votes.totalVotes))*100)} color="blue" className="mt-3" />
        </Card>
    </div>
  );
}

