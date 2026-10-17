'use client';

import { useState } from 'react';
import defaultAggregated from './worldcup2026/defaultAggregated.json';
import {
  simulateWorldCup2026OnceStageParticipants,
  type KnockoutRound,
} from './worldcup2026/worldcup2026Simulator';

const CONFEDS = [
  { key: 'UEFA', pillClass: 'bg-indigo-100 text-indigo-900 font-bold' },
  { key: 'CAF', pillClass: 'bg-emerald-100 text-emerald-900 font-semibold' },
  { key: 'AFC', pillClass: 'bg-amber-100 text-amber-900 font-semibold' },
  { key: 'CONCACAF', pillClass: 'bg-cyan-100 text-cyan-900 font-semibold' },
  { key: 'CONMEBOL', pillClass: 'bg-fuchsia-100 text-fuchsia-900 font-semibold' },
  { key: 'OFC', pillClass: 'bg-purple-100 text-purple-900 font-semibold' },
] as const;

export function HeroSimulatorPreview() {
  const [simRuns, setSimRuns] = useState<number>(defaultAggregated.runs);
  const [drawProbPct, setDrawProbPct] = useState<number>(
    defaultAggregated.drawProbPct ?? 22
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [qfAvgs, setQfAvgs] = useState<Record<string, number>>(
    defaultAggregated.avgCountsByStage.Quarterfinal
  );
  const [executedRuns, setExecutedRuns] = useState<number>(
    defaultAggregated.runs
  );

  const handleCalculate = async () => {
    setIsRunning(true);
    await new Promise<void>((r) => setTimeout(r, 10));

    const runsInt = Math.min(200000, Math.max(1000, Math.floor(simRuns || 10000)));
    const drawProb = Math.min(60, Math.max(0, drawProbPct || 0)) / 100;

    // For instant interactive feedback on homepage, cap synchronous loop or chunk it
    const effectiveRuns = Math.min(runsInt, 25000);
    const sums: Record<string, number> = {
      UEFA: 0,
      CAF: 0,
      AFC: 0,
      CONCACAF: 0,
      CONMEBOL: 0,
      OFC: 0,
    };

    for (let i = 0; i < effectiveRuns; i++) {
      const sim = simulateWorldCup2026OnceStageParticipants(drawProb);
      const qfTeams = sim.stageParticipants['Quarterfinal' as KnockoutRound];
      for (const t of qfTeams) {
        sums[t.confed] = (sums[t.confed] ?? 0) + 1;
      }
    }

    const nextAvgs: Record<string, number> = {};
    for (const c of CONFEDS) {
      nextAvgs[c.key] = (sums[c.key] ?? 0) / effectiveRuns;
    }

    setQfAvgs(nextAvgs);
    setExecutedRuns(runsInt);
    setIsRunning(false);
  };

  const maxVal = Math.max(3.0, ...Object.values(qfAvgs));

  return (
    <div className="border border-neutral-300 bg-white p-6 md:p-7">
      <div className="mb-5">
        <h2 className="text-sm font-bold text-neutral-950">
          Priemerný počet tímov v štvrťfinále podľa konfederácie
        </h2>
        <p className="font-mono text-xs text-neutral-500 mt-0.5 tabular-nums">
          Priemer zo {executedRuns.toLocaleString('sk-SK')} simulácií
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 items-end">
        <div className="sm:col-span-4">
          <label
            htmlFor="hero-sim-runs"
            className="block text-xs font-medium text-neutral-600 mb-1 whitespace-nowrap"
          >
            Počet simulácií
          </label>
          <input
            id="hero-sim-runs"
            type="number"
            min={1000}
            max={200000}
            step={10000}
            value={simRuns}
            onChange={(e) => setSimRuns(parseInt(e.target.value || '100000', 10))}
            className="w-full h-[38px] border border-neutral-300 px-3 py-1.5 font-mono text-sm text-neutral-950 focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
        <div className="sm:col-span-5">
          <label
            htmlFor="hero-draw-prob"
            className="block text-xs font-medium text-neutral-600 mb-1 whitespace-nowrap"
          >
            Pravdepodobnosť remízy (%)
          </label>
          <input
            id="hero-draw-prob"
            type="number"
            min={0}
            max={60}
            step={1}
            value={drawProbPct}
            onChange={(e) => setDrawProbPct(parseFloat(e.target.value || '22'))}
            className="w-full h-[38px] border border-neutral-300 px-3 py-1.5 font-mono text-sm text-neutral-950 focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>
        <div className="sm:col-span-3">
          <button
            type="button"
            onClick={() => void handleCalculate()}
            disabled={isRunning}
            className="w-full h-[38px] bg-neutral-950 hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold text-xs px-4 whitespace-nowrap inline-flex items-center justify-center transition-colors"
          >
            {isRunning ? 'Počítam...' : 'Vypočítať'}
          </button>
        </div>
      </div>

      <div className="space-y-2.5 font-mono text-xs tabular-nums">
        {CONFEDS.map(({ key, pillClass }) => {
          const val = qfAvgs[key] ?? 0;
          const widthPct = Math.min(100, Math.max(2, (val / maxVal) * 100));
          const isPrimary = key === 'UEFA';
          return (
            <div key={key} className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-3 sm:col-span-2">
                <span
                  className={`block text-center py-1 px-1.5 text-[11px] tracking-tight ${pillClass}`}
                >
                  {key}
                </span>
              </div>
              <div className="col-span-7 sm:col-span-8 bg-neutral-100 h-6 overflow-hidden">
                <div
                  className={`${
                    isPrimary ? 'bg-[#1D4ED8]' : 'bg-[#93B4F8]'
                  } h-full transition-all duration-300`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div
                className={`col-span-2 text-right ${
                  isPrimary
                    ? 'font-bold text-neutral-950'
                    : 'font-medium text-neutral-700'
                }`}
              >
                {val.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
