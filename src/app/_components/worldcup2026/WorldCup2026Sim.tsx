'use client';

import { useRef, useState } from 'react';
import {
  Card,
  Button,
  NumberInput,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import {
  MX,
  ZA,
  KR,
  CZ,
  CA,
  BA,
  QA,
  CH,
  BR,
  MA,
  HT,
  GB_SCT,
  US,
  PY,
  AU,
  TR,
  DE,
  CW,
  CI,
  EC,
  NL,
  JP,
  SE,
  TN,
  BE,
  EG,
  IR,
  NZ,
  ES,
  CV,
  SA,
  UY,
  FR,
  SN,
  IQ,
  NO,
  AR,
  DZ,
  AT,
  JO,
  PT,
  CD,
  UZ,
  CO,
  GB_ENG,
  HR,
  GH,
  PA,
} from 'country-flag-icons/react/3x2';
import {
  simulateWorldCup2026Once,
  simulateWorldCup2026OnceStageParticipants,
  getTournamentConfederationCounts,
  type SimulatedWorldCup2026,
  type Team,
  type KnockoutMatch,
  type KnockoutRound,
} from './worldcup2026Simulator';
import defaultAggregated from './defaultAggregated.json';

function getTeamFlag(teamName: string) {
  switch (teamName) {
    case 'Mexico':
      return MX;
    case 'South Africa':
      return ZA;
    case 'South Korea':
      return KR;
    case 'Czechia':
      return CZ;
    case 'Canada':
      return CA;
    case 'Bosnia and Herzegovina':
      return BA;
    case 'Qatar':
      return QA;
    case 'Switzerland':
      return CH;
    case 'Brazil':
      return BR;
    case 'Morocco':
      return MA;
    case 'Haiti':
      return HT;
    case 'Scotland':
      return GB_SCT;
    case 'United States':
      return US;
    case 'Paraguay':
      return PY;
    case 'Australia':
      return AU;
    case 'Turkey':
      return TR;
    case 'Germany':
      return DE;
    case 'Curaçao':
      return CW;
    case 'Ivory Coast':
      return CI;
    case 'Ecuador':
      return EC;
    case 'Netherlands':
      return NL;
    case 'Japan':
      return JP;
    case 'Sweden':
      return SE;
    case 'Tunisia':
      return TN;
    case 'Belgium':
      return BE;
    case 'Egypt':
      return EG;
    case 'Iran':
      return IR;
    case 'New Zealand':
      return NZ;
    case 'Spain':
      return ES;
    case 'Cape Verde':
      return CV;
    case 'Saudi Arabia':
      return SA;
    case 'Uruguay':
      return UY;
    case 'France':
      return FR;
    case 'Senegal':
      return SN;
    case 'Iraq':
      return IQ;
    case 'Norway':
      return NO;
    case 'Argentina':
      return AR;
    case 'Algeria':
      return DZ;
    case 'Austria':
      return AT;
    case 'Jordan':
      return JO;
    case 'Portugal':
      return PT;
    case 'DR Congo':
      return CD;
    case 'Uzbekistan':
      return UZ;
    case 'Colombia':
      return CO;
    case 'England':
      return GB_ENG;
    case 'Croatia':
      return HR;
    case 'Ghana':
      return GH;
    case 'Panama':
      return PA;
    default:
      return null;
  }
}

function getConfedBadgeClasses(confed: string) {
  switch (confed) {
    case "UEFA":
      return "bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200";
    case "CAF":
      return "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200";
    case "AFC":
      return "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200";
    case "CONCACAF":
      return "bg-cyan-500/15 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200";
    case "CONMEBOL":
      return "bg-fuchsia-500/15 text-fuchsia-800 dark:bg-fuchsia-500/20 dark:text-fuchsia-200";
    case "OFC":
      return "bg-violet-500/15 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200";
    default:
      return "bg-tremor-background-subtle text-tremor-content dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content";
  }
}

function confedOrder(): string[] {
  return ["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF", "OFC"];
}

function getUniqueTeamsByName(teams: Team[]) {
  const map = new Map<string, Team>();
  for (const t of teams) map.set(t.name, t);
  return Array.from(map.values());
}

function formatPercent(p: number, decimals = 2) {
  return `${(p * 100).toFixed(decimals)}%`;
}

function TeamInline({
  team,
  emphasize = false,
}: {
  team: Team;
  emphasize?: boolean;
}) {
  const Flag = getTeamFlag(team.name);
  return (
    <div className="flex items-center gap-2 min-w-0">
      {Flag ? <Flag width={18} className="inline-block" title={team.name} /> : null}
      <span className={`truncate ${emphasize ? 'font-bold' : ''}`}>{team.name}</span>
      <span
        className={`text-[11px] px-2 py-0.5 rounded inline-flex items-center justify-center whitespace-nowrap min-w-[92px] ${getConfedBadgeClasses(
          team.confed
        )}`}
      >
        {team.confed}
      </span>
    </div>
  );
}

export default function WorldCup2026Sim() {
  const [drawProbPct, setDrawProbPct] = useState<number>(22);
  const [isAggregating, setIsAggregating] = useState<boolean>(false);
  const [aggregationProgress, setAggregationProgress] = useState<number>(0);
  const [aggregationTotalRuns, setAggregationTotalRuns] = useState<number>(0);
  const [simRuns, setSimRuns] = useState<number>(100000);
  const [aggregated, setAggregated] = useState<{
    runs: number;
    tournamentConfedCounts: Record<string, number>;
    avgCountsByStage: Record<string, Record<string, number>>;
    confedCountDists: Record<string, Record<string, number[]>>;
  }>(defaultAggregated);
  const [simulation, setSimulation] = useState<SimulatedWorldCup2026 | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const simId = useRef(0);

  const runAggregation = async (drawProbPercent: number, runs: number) => {
    const yieldToBrowser = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

    setIsAggregating(true);
    setAggregationProgress(0);
    setAggregationTotalRuns(runs);

    await yieldToBrowser();

    const tournamentConfedCounts = getTournamentConfederationCounts();
    const stageDefs = [
      { key: "Round of 32", stage: "Round of 32" as KnockoutRound },
      { key: "Round of 16", stage: "Round of 16" as KnockoutRound },
      { key: "Quarterfinal", stage: "Quarterfinal" as KnockoutRound },
      { key: "Semifinal", stage: "Semifinal" as KnockoutRound },
      { key: "Third place", stage: "Third place" as KnockoutRound },
      { key: "Final", stage: "Final" as KnockoutRound },
    ];

    const sums: Record<string, Record<string, number>> = {};
    for (const d of stageDefs) sums[d.key] = {};

    const stageKeys = stageDefs.map((d) => d.key);

    // confedCountFreqs[stageKey][confed][count] = number of simulations with exactly `count` teams
    const confedCountFreqs: Record<string, Record<string, number[]>> = {};
    for (const d of stageDefs) confedCountFreqs[d.key] = {};

    const runsInt = Math.max(1, Math.floor(runs));
    const progressEvery = Math.max(1, Math.floor(runsInt / 100));

    for (let i = 0; i < runsInt; i++) {
      const sim = simulateWorldCup2026OnceStageParticipants(drawProbPercent / 100);

      for (const stageKey of stageKeys) {
        const teams = sim.stageParticipants[stageKey as KnockoutRound];
        const confedCounts = new Map<string, number>();
        for (const t of teams) confedCounts.set(t.confed, (confedCounts.get(t.confed) ?? 0) + 1);

        for (const confed of confedOrder()) {
          const cnt = confedCounts.get(confed) ?? 0;
          sums[stageKey][confed] = (sums[stageKey][confed] ?? 0) + cnt;

          if (!confedCountFreqs[stageKey][confed]) {
            confedCountFreqs[stageKey][confed] = [];
          }
          const arr = confedCountFreqs[stageKey][confed];
          while (arr.length <= cnt) arr.push(0);
          arr[cnt]++;
        }
      }

      if ((i + 1) % progressEvery === 0 || i === runsInt - 1) {
        setAggregationProgress((i + 1) / runsInt);
        await yieldToBrowser();
      }
    }

    setAggregationProgress(1);
    const avgCountsByStage: Record<string, Record<string, number>> = {};
    for (const stageKey of stageKeys) {
      avgCountsByStage[stageKey] = {};
      for (const [confed, sum] of Object.entries(sums[stageKey])) {
        avgCountsByStage[stageKey][confed] = sum / runsInt;
      }
    }

    const confedCountDists: Record<string, Record<string, number[]>> = {};
    for (const stageKey of stageKeys) {
      confedCountDists[stageKey] = {};
      for (const [confed, freqs] of Object.entries(confedCountFreqs[stageKey])) {
        confedCountDists[stageKey][confed] = freqs.map((f) => f / runsInt);
      }
    }

    setAggregated({
      runs: runsInt,
      tournamentConfedCounts,
      avgCountsByStage,
      confedCountDists,
    });
    setIsAggregating(false);
  };

  const runSimulation = async () => {
    const id = ++simId.current;
    setIsSimulating(true);

    // Yield so the UI can show "Simulujem..." immediately.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const sim = simulateWorldCup2026Once(drawProbPct / 100);
    if (id === simId.current) {
      setSimulation(sim);
      setIsSimulating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-full px-2 sm:max-w-6xl">
      <Card className="mt-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">FIFA World Cup 2026: koľko tímov a s akou pravdepodobnosťou z každej konfederácie sa dostane do vyraďovacích kôl?</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
            <div>
              <label className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Počet simulácií
              </label>
              <NumberInput
                className="mt-2"
                id="sim-runs"
                name="sim-runs"
                defaultValue={simRuns}
                min={10000}
                max={200000}
                step={1000}
                onChange={(e) =>
                  setSimRuns(Math.min(200000, Math.max(10000, parseFloat(e.target.value) || 10000)))
                }
              />
            </div>

            <div>
              <label className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Pravdepodobnosť remízy (%)
              </label>
              <NumberInput
                className="mt-2"
                id="draw-prob"
                name="draw-prob"
                defaultValue={drawProbPct}
                min={0}
                max={60}
                step={1}
                onChange={(e) => setDrawProbPct(parseFloat(e.target.value))}
              />
            </div>

            <div className="flex">
              <Button
                onClick={() => void runAggregation(drawProbPct, simRuns)}
                disabled={isAggregating}
                className="w-full"
              >
                {isAggregating ? 'Počítam...' : 'Vypočítať'}
              </Button>
            </div>
          </div>

          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-relaxed">
            Výsledky sú odhad z Monte Carlo simulácií. Každý zápas je 50/50 (okrem remízy podľa nastavenia), t.j. každý tím je rovnako silný.<br/>V skupinách podľa skutočného rozloženia pre rok 2026
            rozhodujú body (výhra 3, remíza 1) a pri rovnosti bodov sa poradie určí náhodne. Vo vyraďovaní remíza neexistuje
            (predĺženie/penalty modelujeme ako spravodlivé 50/50).<br/>
            Top 2 z každého z 12 skupín postúpia automaticky, ďalšie 4 postúpia medzi 12 tretími tímami podľa bodov (v prípade rovnosti bodov náhodne). Následne 32 tímov hrá vyraďovací pavúk: prehrávajúci vypadáva (remíza sa „prelomí“ predĺžením/penaltami v tomto modeli ako spravodlivé 50/50).
          </p>
        </div>
      </Card>

      <div className="mt-6">
        {isAggregating ? (
          <div className="text-tremor-default text-center py-3 space-y-2">
            <div>Počítam agregované výsledky ({aggregationTotalRuns} simulácií)...</div>
            <div className="w-full bg-tremor-background-subtle rounded-tremor-small h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, aggregationProgress * 100))}%` }}
              />
            </div>
            <div className="text-xs">{Math.floor(aggregationProgress * 100)}%</div>
          </div>
        ) : null}

        {aggregated ? (
          <Card className="p-4">
            <h3 className="font-semibold">
              Agregované výsledky - počet tímov pre jednotlivé fázy (priemer po {aggregated.runs} simuláciách)
            </h3>

            <div className="mt-3 space-y-3">
              {(() => {
                const stageDefs = [
                  { key: "Round of 32", label: "16-finále" },
                  { key: "Round of 16", label: "8-finále" },
                  { key: "Quarterfinal", label: "Štvrťfinále" },
                  { key: "Semifinal", label: "Semi-finále" },
                  { key: "Third place", label: "Zápas o 3. miesto" },
                  { key: "Final", label: "Finále" },
                ] as const;

                const tournamentConfedCounts = aggregated.tournamentConfedCounts;
                const confeds = confedOrder()
                  .slice()
                  .sort((a, b) => {
                    const ca = tournamentConfedCounts[a] ?? 0;
                    const cb = tournamentConfedCounts[b] ?? 0;
                    if (cb !== ca) return cb - ca;
                    return confedOrder().indexOf(a) - confedOrder().indexOf(b);
                  });

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[720px]">
                      <thead>
                        <tr className="text-left">
                          <th className="font-normal text-tremor-content-strong">Konfederácia</th>
                          <th className="font-normal text-tremor-content-strong text-right">Skupiny</th>
                          {stageDefs.map((d) => (
                            <th
                              key={d.key}
                              className="font-normal text-tremor-content-strong text-right"
                            >
                              {d.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {confeds.map((c) => (
                          <tr
                            key={c}
                            className="border-t border-tremor-border dark:border-dark-tremor-border"
                          >
                            <td className="py-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded inline-flex items-center justify-center whitespace-nowrap min-w-[92px] ${getConfedBadgeClasses(
                                  c,
                                )}`}
                              >
                                {c}
                              </span>
                            </td>
                            <td className="text-right py-2 font-semibold">
                              {tournamentConfedCounts[c] ?? 0}
                            </td>
                            {stageDefs.map((d) => (
                              <td key={`${c}-${d.key}`} className="text-right py-2 font-semibold">
                                {(
                                  aggregated.avgCountsByStage[d.key]?.[c] ?? 0
                                ).toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </Card>
        ) : null}

        {aggregated ? (
          <Card className="p-4 mt-6">
            <h3 className="font-semibold">
              Rozdelenie pravdepodobností podľa konfederácií (z {aggregated.runs} simulácií)
            </h3>
            <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Aká je pravdepodobnosť, že konfederácia bude mať aspoň N tímov v danom kole?
            </p>

            <TabGroup className="mt-3" defaultIndex={2}>
              <TabList variant="solid" className="w-full rounded-tremor-small">
                {[
                  { key: "Round of 32", label: "16-finále" },
                  { key: "Round of 16", label: "8-finále" },
                  { key: "Quarterfinal", label: "Štvrťfinále" },
                  { key: "Semifinal", label: "Semi-finále" },
                  { key: "Final", label: "Finále" },
                ].map((d) => (
                  <Tab
                    key={d.key}
                    className="w-full justify-center ui-selected:text-tremor-content-strong ui-selected:dark:text-dark-tremor-content-strong"
                  >
                    {d.label}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {[
                  { key: "Round of 32", label: "16-finále" },
                  { key: "Round of 16", label: "8-finále" },
                  { key: "Quarterfinal", label: "Štvrťfinále" },
                  { key: "Semifinal", label: "Semi-finále" },
                  { key: "Final", label: "Finále" },
                ].map((stage) => {
                  const dists = aggregated.confedCountDists[stage.key] ?? {};
                  const tournamentConfedCounts = aggregated.tournamentConfedCounts;
                  const confeds = confedOrder()
                    .slice()
                    .sort((a, b) => {
                      const ca = tournamentConfedCounts[a] ?? 0;
                      const cb = tournamentConfedCounts[b] ?? 0;
                      if (cb !== ca) return cb - ca;
                      return confedOrder().indexOf(a) - confedOrder().indexOf(b);
                    });

                  // Compute cumulative P(>= n) for each confederation
                  const cumulDists: Record<string, number[]> = {};
                  let maxCol = 1;
                  for (const c of confeds) {
                    const dist = dists[c] ?? [];
                    const cumul: number[] = [];
                    let tail = 0;
                    for (let i = dist.length - 1; i >= 0; i--) {
                      tail += dist[i] ?? 0;
                      cumul[i] = tail;
                    }
                    cumulDists[c] = cumul;
                    for (let i = cumul.length - 1; i >= 1; i--) {
                      if (cumul[i] > 0.0001) { maxCol = Math.max(maxCol, i); break; }
                    }
                  }
                  const countCols = Array.from({ length: maxCol }, (_, i) => i + 1);

                  return (
                    <TabPanel key={stage.key}>
                      <div className="overflow-x-auto mt-3">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left">
                              <th className="font-normal text-tremor-content-strong py-2">Konfederácia</th>
                              {countCols.map((n) => (
                                <th
                                  key={n}
                                  className="font-normal text-tremor-content-strong text-right py-2 px-2"
                                >
                                  {n}+ {n === 1 ? 'tím' : (n >= 2 && n <= 4 ? 'tímy' : 'tímov')}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {confeds.map((c) => {
                              const cumul = cumulDists[c] ?? [];
                              return (
                                <tr
                                  key={c}
                                  className="border-t border-tremor-border dark:border-dark-tremor-border"
                                >
                                  <td className="py-2">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded inline-flex items-center justify-center whitespace-nowrap min-w-[92px] ${getConfedBadgeClasses(c)}`}
                                    >
                                      {c}
                                    </span>
                                  </td>
                                  {countCols.map((n) => {
                                    const p = cumul[n] ?? 0;
                                    return (
                                      <td
                                        key={n}
                                        className={`text-right py-2 px-2 tabular-nums ${
                                          p >= 0.1
                                            ? 'font-semibold'
                                            : p < 0.001
                                              ? 'text-tremor-content-subtle dark:text-dark-tremor-content-subtle'
                                              : ''
                                        }`}
                                      >
                                        {p < 0.0001 ? '–' : formatPercent(p)}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </TabGroup>

            <div className="mt-5 border-t border-tremor-border dark:border-dark-tremor-border pt-4">
              <h4 className="text-sm font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mb-2">
                Legenda konfederácií
              </h4>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-sm text-tremor-content dark:text-dark-tremor-content">
                {[
                  { confed: "UEFA", desc: "Európa (Union of European Football Associations)" },
                  { confed: "CONMEBOL", desc: "Južná Amerika (Confederación Sudamericana de Fútbol)" },
                  { confed: "CAF", desc: "Afrika (Confederation of African Football)" },
                  { confed: "AFC", desc: "Ázia + Austrália (Asian Football Confederation)" },
                  { confed: "CONCACAF", desc: "Severná a Stredná Amerika + Karibik" },
                  { confed: "OFC", desc: "Oceánia (Oceania Football Confederation)" },
                ].map((item) => (
                  <div key={item.confed} className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded inline-flex items-center justify-center whitespace-nowrap min-w-[92px] ${getConfedBadgeClasses(item.confed)}`}
                    >
                      {item.confed}
                    </span>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : null}
      </div>

      <Card className="mt-8 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Náhodný turnaj</h3>
            <p className="mt-1 text-tremor-default leading-relaxed">
              Vygeneruje sa <b>jeden náhodný turnaj</b>:
              Klikni na "Spustiť simuláciu" pre vygenerovanie výsledkov turnaja vrátane tabuliek skupín a vyraďovacieho pavúka. Kľudne simuláciu spusti viackrát, aby si videl rôzne možné výsledky a aká malá pravdepodobnosť je, že tímy UEFA budú mať toľko zástupcov vo vyradovacích kolách.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Button onClick={runSimulation} disabled={isSimulating} className="w-full sm:w-auto">
              {isSimulating ? 'Simulujem...' : 'Spustiť simuláciu'}
            </Button>
          </div>
        </div>

        {simulation ? (
          <div className="mt-6 space-y-6">
            <Card className="p-4">
              {/*
                For the selected run, count how many teams from each confederation reach each knockout stage.
                "Made it to" = participates in that round (Round of 16 has 16 teams, Quarterfinal has 8, etc.).
              */}

              {(() => {
                const stageTeams: Record<string, Team[]> = {
                  "Round of 32": getUniqueTeamsByName(simulation.qualified32),
                  "Round of 16": getUniqueTeamsByName(
                    simulation.knockoutMatches
                      .filter((m) => m.round === "Round of 16")
                      .flatMap((m) => [m.team1, m.team2]),
                  ),
                  Quarterfinal: getUniqueTeamsByName(
                    simulation.knockoutMatches
                      .filter((m) => m.round === "Quarterfinal")
                      .flatMap((m) => [m.team1, m.team2]),
                  ),
                  Semifinal: getUniqueTeamsByName(
                    simulation.knockoutMatches
                      .filter((m) => m.round === "Semifinal")
                      .flatMap((m) => [m.team1, m.team2]),
                  ),
                  "Third place": getUniqueTeamsByName(
                    simulation.knockoutMatches
                      .filter((m) => m.round === "Third place")
                      .flatMap((m) => [m.team1, m.team2]),
                  ),
                  Final: getUniqueTeamsByName(
                    simulation.knockoutMatches
                      .filter((m) => m.round === "Final")
                      .flatMap((m) => [m.team1, m.team2]),
                  ),
                };

                const tournamentConfedCounts = new Map<string, number>();
                for (const g of simulation.groups) {
                  for (const row of g.table) {
                    tournamentConfedCounts.set(row.confed, (tournamentConfedCounts.get(row.confed) ?? 0) + 1);
                  }
                }

                const countsForStage = (teams: Team[]) => {
                  const map = new Map<string, number>();
                  for (const t of teams) map.set(t.confed, (map.get(t.confed) ?? 0) + 1);
                  return map;
                };

                const confeds = confedOrder().slice().sort((a, b) => {
                  const ca = tournamentConfedCounts.get(a) ?? 0;
                  const cb = tournamentConfedCounts.get(b) ?? 0;
                  if (cb !== ca) return cb - ca;
                  // Stable tie-break to keep consistent order.
                  return confedOrder().indexOf(a) - confedOrder().indexOf(b);
                });
                const stageDefs = [
                  { key: "Round of 32", label: "16-finále" },
                  { key: "Round of 16", label: "8-finále" },
                  { key: "Quarterfinal", label: "Štvrťfinále" },
                  { key: "Semifinal", label: "Semifinále" },
                  { key: "Third place", label: "o 3. miesto" },
                  { key: "Final", label: "Finále" },
                ];

                const stageCounts = new Map<string, Map<string, number>>();
                for (const d of stageDefs) stageCounts.set(d.key, countsForStage(stageTeams[d.key]));

                return (
                  <div className="space-y-4">
                    <div className="text-tremor-default font-semibold">
                      Koľko tímov z konfederácie sa dostane do vyraďovacej časti (jedna simulácia)?
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[720px]">
                        <thead>
                          <tr className="text-left">
                            <th className="font-normal text-tremor-content-strong">Konfederácia</th>
                            <th className="font-normal text-tremor-content-strong text-right">Skupiny</th>
                            {stageDefs.map((d) => (
                              <th
                                key={d.key}
                                className="font-normal text-tremor-content-strong text-right"
                              >
                                {d.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {confeds.map((c) => (
                            <tr key={c} className="border-t border-tremor-border dark:border-dark-tremor-border">
                              <td className="py-2">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded inline-flex items-center justify-center whitespace-nowrap min-w-[92px] ${getConfedBadgeClasses(
                                    c,
                                  )}`}
                                >
                                  {c}
                                </span>
                              </td>
                              <td className="text-right py-2 font-semibold">
                                {tournamentConfedCounts.get(c) ?? 0}
                              </td>
                              {stageDefs.map((d) => (
                                <td
                                  key={`${c}-${d.key}`}
                                  className="text-right py-2 font-semibold"
                                >
                                  {stageCounts.get(d.key)?.get(c) ?? 0}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </Card>

            <TabGroup>
              <div className="md:flex md:items-center md:justify-between">
                <TabList
                  variant="solid"
                  className="w-full rounded-tremor-small md:w-72"
                >
                  <Tab
                    className="w-full justify-center ui-selected:text-tremor-content-strong ui-selected:dark:text-dark-tremor-content-strong"
                  >
                    Skupinová fáza
                  </Tab>
                  <Tab
                    className="w-full justify-center ui-selected:text-tremor-content-strong ui-selected:dark:text-dark-tremor-content-strong"
                  >
                    Vyraďovacia fáza
                  </Tab>
                </TabList>
              </div>

              <TabPanels>
                <TabPanel>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {simulation.groups.map((g) => (
                      <Card key={g.label} className="p-4">
                        <h4 className="text-lg font-semibold">Group {g.label}</h4>

                        <div className="mt-3">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="font-normal text-tremor-content-strong">#</th>
                                <th className="font-normal text-tremor-content-strong">Tím</th>
                                <th className="font-normal text-right text-tremor-content-strong">W</th>
                                <th className="font-normal text-right text-tremor-content-strong">D</th>
                                <th className="font-normal text-right text-tremor-content-strong">L</th>
                                <th className="font-normal text-right text-tremor-content-strong">Pts</th>
                              </tr>
                            </thead>
                            <tbody>
                              {g.table.map((row) => (
                                <tr
                                  key={row.team}
                                  className="border-t border-tremor-border dark:border-dark-tremor-border"
                                >
                                  <td>{row.rank}</td>
                                  <td>
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2 min-w-0">
                                        {(() => {
                                          const Flag = getTeamFlag(row.team);
                                          return Flag ? (
                                            <Flag width={18} className="inline-block" title={row.team} />
                                          ) : null;
                                        })()}
                                        <span
                                          className={`truncate ${
                                            simulation.qualified32.some((t) => t.name === row.team) ? 'font-bold' : ''
                                          }`}
                                        >
                                          {row.team}
                                        </span>
                                      </div>
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded inline-flex items-center justify-center whitespace-nowrap min-w-[92px] ${getConfedBadgeClasses(
                                          row.confed
                                        )}`}
                                      >
                                        {row.confed}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="text-right">{row.wins}</td>
                                  <td className="text-right">{row.draws}</td>
                                  <td className="text-right">{row.losses}</td>
                                  <td className="text-right font-semibold">{row.points}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-3">
                          <h5 className="text-sm font-semibold">Zápasy</h5>
                          <div className="mt-2 space-y-1 text-sm text-tremor-default">
                            {g.matches.map((m, idx) => {
                              const text =
                                m.outcome === 'draw'
                                  ? 'Remíza'
                                  : m.outcome === 'home'
                                    ? `${m.home} vyhral`
                                    : `${m.away} vyhral`;
                              return (
                                <div key={`${g.label}-m-${idx}`}>
                                  {m.home} - {m.away}: {text}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-tremor-default">Majster</div>
                        <TeamInline team={simulation.champion} emphasize />
                      </div>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-tremor-default">3. miesto</div>
                        <TeamInline team={simulation.thirdPlace} />
                      </div>
                    </Card>

                    {(
                      [
                        "Final",
                        "Third place",
                        "Semifinal",
                        "Quarterfinal",
                        "Round of 16",
                        "Round of 32",
                      ] as KnockoutRound[]
                    ).map((round) => {
                      const matches = simulation.knockoutMatches.filter((m) => m.round === round);
                      const knockoutRoundLabel: Record<KnockoutRound, string> = {
                        "Round of 32": "16-finále",
                        "Round of 16": "8-finále",
                        Quarterfinal: "Štvrťfinále",
                        Semifinal: "Semi-finále",
                        "Third place": "Zápas o 3. miesto",
                        Final: "Finále",
                      };
                      return (
                        <Card key={round} className="p-4">
                          <h4 className="text-lg font-semibold">{knockoutRoundLabel[round]}</h4>
                          <div className="mt-3 space-y-2">
                            {matches.map((m: KnockoutMatch) => (
                              <div
                                key={`${m.round}-${m.matchNo}`}
                                className="flex items-center justify-between gap-3 rounded-tremor-small border border-tremor-border p-2 dark:border-dark-tremor-border"
                              >
                                <div className="flex-1">
                                  <div className={m.winner.name === m.team1.name ? 'font-bold' : ''}>
                                    <TeamInline team={m.team1} emphasize={m.winner.name === m.team1.name} />
                                  </div>
                                </div>
                                <div className="text-tremor-default text-xs w-10 text-center">
                                  {m.matchNo}
                                </div>
                                <div className="flex-1 flex justify-end">
                                  <div className={m.winner.name === m.team2.name ? 'font-bold' : ''}>
                                    <TeamInline team={m.team2} emphasize={m.winner.name === m.team2.name} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        ) : (
          null
        )}
      </Card>
    </div>
  );
}

