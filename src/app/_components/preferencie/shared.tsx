'use client';

import { useRef, useState } from 'react';
import data from './data.json';

// Predpokladaný termín riadnych volieb (4-ročné obdobie od ustanovujúcej schôdze 25. 10. 2023).
// Presný dátum ešte nie je vyhlásený - po vyhlásení ho treba prepísať v generate_data.py a dáta vygenerovať znova.
const [electionYear, electionMonth, electionDay] = data.nextElection.split('-').map(Number);
export const NEXT_ELECTION = { year: electionYear, month: electionMonth, day: electionDay };

export const MAX_H = 525; // dlhšie sú k dispozícii prieskumy len pred voľbami 2016 a 2020
export const HORIZONS: number[] = data.horizons;
export const ELECTION_COLORS: Record<string, string> = {
  '2012': '#9467bd',
  '2016': '#1f77b4',
  '2020': '#ff7f0e',
  '2023': '#2ca02c',
};
export const YEARS = Object.keys(data.elections);

export type Unit = (typeof data.units)[number];
export const UNITS = data.units as Unit[];

export const fmt = (v: number | null | undefined, d = 1) =>
  v == null ? '–' : v.toLocaleString('sk-SK', { minimumFractionDigits: d, maximumFractionDigits: d });
export const signed = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v));

export function daysUntil(): number {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.UTC(NEXT_ELECTION.year, NEXT_ELECTION.month - 1, NEXT_ELECTION.day) - today) / 86_400_000);
}

export function nearestIndex(h: number): number {
  let best = 0;
  for (let i = 1; i < HORIZONS.length; i++) if (Math.abs(HORIZONS[i] - h) < Math.abs(HORIZONS[best] - h)) best = i;
  return best;
}

/** Path through points; gaps in the series are bridged only when shorter than maxGap days. */
export function linePath(xs: number[], ys: (number | null)[], px: (h: number) => number, py: (v: number) => number, maxGap = 14) {
  let d = '';
  let last: number | null = null;
  xs.forEach((h, i) => {
    const v = ys[i];
    if (v == null || h > MAX_H) return;
    const connected = last != null && Math.abs(h - last) <= maxGap + 7;
    d += `${connected ? 'L' : 'M'}${px(h).toFixed(1)},${py(v).toFixed(1)}`;
    last = h;
  });
  return d;
}

export type ChartProps = { h: number; setH: (h: number) => void };

export const W = 720;
export const M = { l: 46, r: 18, t: 14, b: 44 };

export function useDrag(setH: (h: number) => void, svgRef: React.RefObject<SVGSVGElement | null>) {
  const set = (clientX: number) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    const iw = W - M.l - M.r;
    setH(Math.max(0, Math.min(MAX_H, Math.round(((W - M.r - x) / iw) * MAX_H))));
  };
  return {
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      set(e.clientX);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (e.buttons) set(e.clientX);
    },
  };
}

export function Axes({ ymax, step, unit, px, py, h }: { ymax: number; step: number; unit: string; px: (h: number) => number; py: (v: number) => number; h: number }) {
  const ticks = Array.from({ length: Math.floor(ymax / step) + 1 }, (_, i) => i * step);
  const xticks = [525, 450, 365, 270, 180, 90, 30, 0];
  const bottom = py(0);
  return (
    <g fontSize="11" fill="#6b7280">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={M.l} x2={W - M.r} y1={py(t)} y2={py(t)} stroke="#e5e7eb" />
          <text x={M.l - 6} y={py(t) + 4} textAnchor="end">{t}</text>
        </g>
      ))}
      <text x={M.l} y={M.t - 3} fontSize="10">{unit}</text>
      {xticks.map((t) => (
        <g key={t}>
          <line x1={px(t)} x2={px(t)} y1={bottom} y2={bottom + 4} stroke="#9ca3af" />
          <text x={px(t)} y={bottom + 16} textAnchor="middle">{t === 0 ? 'voľby' : t}</text>
        </g>
      ))}
      <text x={(M.l + W - M.r) / 2} y={bottom + 34} textAnchor="middle">počet dní pred voľbami</text>
      <line x1={px(h)} x2={px(h)} y1={M.t} y2={bottom} stroke="#111827" strokeWidth="1.5" strokeDasharray="4 3" />
    </g>
  );
}

export function ErrorChart({ h, setH, compact = false }: ChartProps & { compact?: boolean }) {
  const [relative, setRelative] = useState(false);
  const [shown, setShown] = useState<Record<string, boolean>>({ '2012': true, '2016': true, '2020': true, '2023': true });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useDrag(setH, svgRef);

  const H = compact ? 280 : 340;
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;
  const px = (v: number) => W - M.r - (v / MAX_H) * iw;
  const ymax = relative ? 50 : 6;
  const py = (v: number) => M.t + ih * (1 - v / ymax);
  const i = nearestIndex(h);

  return (
    <div>
      {!compact && <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
        <div className="inline-flex rounded-md border border-neutral-300 overflow-hidden" role="group" aria-label="Typ odchýlky">
          {[
            [false, 'Percentuálne body'],
            [true, '% z výsledku strany'],
          ].map(([rel, label]) => (
            <button
              key={String(label)}
              onClick={() => setRelative(rel as boolean)}
              aria-pressed={relative === rel}
              className={`px-3 py-1.5 ${relative === rel ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100'}`}
            >
              {label as string}
            </button>
          ))}
        </div>
        {!relative &&
          YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setShown({ ...shown, [y]: !shown[y] })}
              aria-pressed={shown[y]}
              className={`px-2.5 py-1 rounded-full border text-xs font-medium ${shown[y] ? 'text-white' : 'bg-white text-neutral-500'}`}
              style={{ borderColor: ELECTION_COLORS[y], backgroundColor: shown[y] ? ELECTION_COLORS[y] : undefined }}
            >
              {y}
            </button>
          ))}
      </div>}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full select-none" style={{ touchAction: 'pan-y' }} role="img"
        aria-label="Priemerná odchýlka prieskumov od výsledku volieb podľa počtu dní pred voľbami"
        {...drag}>
        <Axes ymax={ymax} step={relative ? 10 : 1} unit={relative ? '% z výsledku strany (medián)' : 'p. b.'} px={px} py={py} h={h} />
        {!relative && (
          <path d={linePath(HORIZONS, data.baseline, px, py)} fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="2 4" />
        )}
        {!relative &&
          YEARS.filter((y) => shown[y]).map((y) => (
            <path key={y} d={linePath(HORIZONS, (data.maeByElection as Record<string, (number | null)[]>)[y], px, py, 7)}
              fill="none" stroke={ELECTION_COLORS[y]} strokeWidth="1.5" opacity="0.85" />
          ))}
        <path d={linePath(HORIZONS, relative ? data.relMedian : data.mae, px, py)} fill="none" stroke="#111827" strokeWidth="3" />
        {[...YEARS].map((y) => {
          const lp = (data.elections as Record<string, { lastPoll: number }>)[y].lastPoll;
          return relative || !shown[y] ? null : (
            <circle key={y} cx={px(lp)} cy={py(0)} r="3.5" fill={ELECTION_COLORS[y]}>
              <title>{`${y}: posledný prieskum ${lp} d pred voľbami`}</title>
            </circle>
          );
        })}
        {(relative ? data.relMedian : data.mae)[i] != null && (
          <circle cx={px(HORIZONS[i])} cy={py((relative ? data.relMedian : data.mae)[i] as number)} r="5" fill="#111827" stroke="#fff" strokeWidth="2" />
        )}
        <rect x={M.l} y={M.t} width={iw} height={ih} fill="transparent" style={{ cursor: 'ew-resize' }} />
      </svg>
      {!compact && <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-600">
        <span><span className="inline-block w-5 border-t-[3px] border-neutral-900 align-middle mr-1" />všetky voľby dokopy</span>
        {!relative && <span><span className="inline-block w-5 border-t-2 border-dotted border-neutral-400 align-middle mr-1" />výsledok predchádzajúcich volieb ako „predpoveď“</span>}
        {!relative && <span><span className="inline-block w-2 h-2 rounded-full bg-neutral-500 align-middle mr-1" />posledný prieskum pred voľbami</span>}
      </div>}
    </div>
  );
}
