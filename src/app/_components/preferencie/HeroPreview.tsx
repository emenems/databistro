'use client';

import { useEffect, useState } from 'react';
import data from './data.json';
import { ErrorChart, MAX_H, NEXT_ELECTION, daysUntil, fmt, nearestIndex } from './shared';

/** Home-page version of the countdown: today's position on the deviation curve, draggable. */
export function HeroPrieskumyPreview() {
  const [days, setDays] = useState<number | null>(null);
  const [h, setH] = useState(365);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const d = daysUntil();
    setDays(d);
    setH(Math.max(0, Math.min(MAX_H, d < 0 ? 7 : d)));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setH((cur) => {
        if (cur <= 0) {
          setPlaying(false);
          return 0;
        }
        return cur - 3;
      });
    }, 40);
    return () => clearInterval(t);
  }, [playing]);

  const move = (v: number) => {
    setPlaying(false);
    setH(v);
  };
  const i = nearestIndex(h);
  const mae = data.mae[i];
  const rb = data.relBig50[i] ?? data.relMedian[i];
  const lo = Math.max(0, 20 - (20 * rb) / 100);
  const hi = 20 + (20 * rb) / 100;
  const today = days != null && days >= 0 && days <= MAX_H ? days : null;

  return (
    <div className="bg-[#F8FAFC] border border-neutral-200 p-5 w-full">
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
        <span className="font-semibold text-neutral-800 uppercase">Odpočet do volieb (jeseň {NEXT_ELECTION.year})</span>
        <span>ťahajte po grafe</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-4xl font-extrabold tabular-nums leading-none text-neutral-950">{h}</div>
          <div className="text-xs text-neutral-600 mt-1">dní pred voľbami</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold tabular-nums leading-none text-[#1D4ED8]">
            {fmt(mae)} <span className="text-base font-semibold">p. b.</span>
          </div>
          <div className="text-xs text-neutral-600 mt-1">priemerná odchýlka prieskumov od výsledku</div>
        </div>
      </div>

      <ErrorChart h={h} setH={move} compact />

      <p className="mt-2 text-sm text-neutral-700" aria-live="polite">
        Strana, ktorá nakoniec získa 20 %, bola v tomto bode typicky nameraná medzi{' '}
        <strong>{fmt(lo, 0)} a {fmt(hi, 0)} %</strong>.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => {
            setH(MAX_H);
            setPlaying(true);
          }}
          className="px-3 py-1.5 bg-neutral-900 text-white text-xs hover:bg-neutral-700"
        >
          ▶ Odpočet
        </button>
        {today != null && (
          <button onClick={() => move(today)} className="px-3 py-1.5 border border-neutral-300 text-xs hover:bg-neutral-100">
            Dnes
          </button>
        )}
      </div>
    </div>
  );
}
