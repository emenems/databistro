'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@tremor/react';
import data from './data.json';
import {
  ErrorChart, Axes, useDrag, nearestIndex, linePath, daysUntil, fmt, signed,
  MAX_H, HORIZONS, ELECTION_COLORS, YEARS, UNITS, NEXT_ELECTION, M, W,
  type ChartProps,
} from './shared';

// Strany, pri ktorých sme zlúčili viaceré kandidátne listiny / strany (vysvetlenie v poznámkach pod grafom)
const MARKERS: Record<string, string> = { PS: '*', 'OĽaNO (Hnutie Slovensko)': '**', 'MOST-HÍD': '***' };
const FOOTNOTES: Record<string, string> = {
  PS: 'vrátane SPOLU (v prieskumoch sa merali samostatne alebo ako koalícia PS–SPOLU; vo voľbách 2020 kandidovali spolu).',
  'OĽaNO (Hnutie Slovensko)':
    'vo voľbách 2016, 2020 a 2023 išlo o kandidátnu listinu s ďalšími stranami (napr. NOVA, Kresťanská únia, Zmena zdola). V prieskumoch 2012 – 2015 sa NOVA merala samostatne a pripočítali sme ju k OĽaNO, v prieskumoch 2016 – 2022 sa OĽaNO merali bez koaličných partnerov, takže porovnanie s výsledkom nie je celkom rovnocenné.',
  'MOST-HÍD': 'vrátane Modrých (v prieskumoch „Modrí, Most-Híd“).',
};
const label = (party: string) => party + (MARKERS[party] ?? '');

function PollsChart({ h, setH }: ChartProps) {
  const [year, setYear] = useState('2023');
  const units = useMemo(() => UNITS.filter((u) => String(u.year) === year), [year]);
  const [sel, setSel] = useState<string[]>(() => UNITS.filter((u) => u.year === 2023).slice(0, 4).map((u) => u.party));
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useDrag(setH, svgRef);

  const pick = (y: string) => {
    setYear(y);
    setSel(UNITS.filter((u) => String(u.year) === y).slice(0, 4).map((u) => u.party));
  };
  const active = units.filter((u) => sel.includes(u.party));
  const H = 360;
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;
  const px = (v: number) => W - M.r - (v / MAX_H) * iw;
  const top = Math.max(10, ...active.flatMap((u) => [u.result, ...u.polls.filter((p) => p[0] <= MAX_H).map((p) => p[1] as number)]));
  const ymax = Math.ceil((top + 1) / 5) * 5;
  const py = (v: number) => M.t + ih * (1 - v / ymax);
  const i = nearestIndex(h);
  const electionDate = (data.elections as Record<string, { date: string }>)[year].date;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 text-sm">
        <div className="inline-flex rounded-md border border-neutral-300 overflow-hidden" role="group" aria-label="Voľby">
          {YEARS.map((y) => (
            <button key={y} onClick={() => pick(y)} aria-pressed={year === y}
              className={`px-3 py-1.5 ${year === y ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100'}`}>
              Voľby {y}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="Strany">
        {units.map((u) => {
          const on = sel.includes(u.party);
          return (
            <button key={u.party} aria-pressed={on}
              onClick={() => setSel(on ? sel.filter((p) => p !== u.party) : [...sel, u.party])}
              className={`px-2.5 py-1 rounded-full border text-xs font-medium ${on ? 'bg-white text-neutral-900' : 'bg-neutral-50 text-neutral-400'}`}
              style={{ borderColor: on ? u.color : '#e5e7eb', borderWidth: on ? 2 : 1 }}>
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: u.color, opacity: on ? 1 : 0.4 }} />
              {label(u.party)}
            </button>
          );
        })}
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full select-none" style={{ touchAction: 'pan-y' }} role="img"
        aria-label={`Prieskumy a výsledok volieb ${year} podľa počtu dní pred voľbami`} {...drag}>
        <Axes ymax={ymax} step={5} unit="%" px={px} py={py} h={h} />
        {active.map((u) => (
          <g key={u.party}>
            <line x1={M.l} x2={W - M.r} y1={py(u.result)} y2={py(u.result)} stroke={u.color} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
            {u.polls.filter((p) => p[0] <= MAX_H).map((p, k) => (
              <circle key={k} cx={px(p[0])} cy={py(p[1] as number)} r="2.6" fill={u.color} fillOpacity="0.5" stroke={u.color} strokeWidth="0.6">
                <title>{`${u.party}, ${data.agencies[p[2] as number]}: ${fmt(p[1] as number)} % (${p[0]} d pred voľbami)`}</title>
              </circle>
            ))}
            <path d={linePath(HORIZONS, u.avg, px, py, 60)} fill="none" stroke={u.color} strokeWidth="2.5" />
            <polygon points={`${px(0)},${py(u.result) - 6} ${px(0) + 6},${py(u.result)} ${px(0)},${py(u.result) + 6} ${px(0) - 6},${py(u.result)}`}
              fill={u.color} stroke="#111827" strokeWidth="1.2">
              <title>{`${u.party}: výsledok volieb ${fmt(u.result, 2)} %`}</title>
            </polygon>
          </g>
        ))}
        <rect x={M.l} y={M.t} width={iw} height={ih} fill="transparent" style={{ cursor: 'ew-resize' }} />
      </svg>
      <p className="mt-1 text-xs text-neutral-600">
        Bodky = jednotlivé prieskumy, hrubá čiara = priemer najnovších prieskumov od každej agentúry (v danom čase známy),
        prerušovaná čiara a kosoštvorec = výsledok volieb {year} ({electionDate.split('-').reverse().map(Number).join('. ')}).
      </p>
      {active.length > 0 && (
        <table className="mt-3 w-full text-sm">
          <caption className="text-left text-neutral-600 mb-1">
            {h === 0 ? 'V deň volieb' : `${h} dní pred voľbami ${year}`}:
          </caption>
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              <th className="py-1 font-medium">Strana</th>
              <th className="py-1 font-medium text-right">Priemer prieskumov</th>
              <th className="py-1 font-medium text-right">Výsledok</th>
              <th className="py-1 font-medium text-right">Rozdiel</th>
            </tr>
          </thead>
          <tbody>
            {active.map((u) => {
              const a = u.avg[i];
              return (
                <tr key={u.party} className="border-b border-neutral-100">
                  <td className="py-1"><span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: u.color }} />{label(u.party)}</td>
                  <td className="py-1 text-right tabular-nums">{a == null ? 'ešte bez prieskumu' : `${fmt(a)} %`}</td>
                  <td className="py-1 text-right tabular-nums">{fmt(u.result)} %</td>
                  <td className="py-1 text-right tabular-nums">{a == null ? '–' : `${signed(u.result - a)} p. b.`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {units.some((u) => MARKERS[u.party]) && (
        <ul className="mt-3 space-y-1 text-xs text-neutral-600">
          {units.filter((u) => MARKERS[u.party]).map((u) => (
            <li key={u.party}><sup>{MARKERS[u.party]}</sup> <strong>{u.party.replace(' (Hnutie Slovensko)', '')}</strong>: {FOOTNOTES[u.party]}</li>
          ))}
          <li>Strany, ktoré zmenili názov alebo kandidovali pod inou značkou, sme spojili pod jedno meno.</li>
        </ul>
      )}
    </div>
  );
}

type Race = {
  winner: string; winnerResult: number; second: string; secondResult: number; color: string;
  leader: (string | null)[]; lead: (number | null)[]; leaderAvg: (number | null)[]; winnerAvg: (number | null)[];
};
const RACES = data.races as Record<string, Race>;
const GOOD = '#16a34a';
const BAD = '#dc2626';

function WinnerChart({ h, setH }: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useDrag(setH, svgRef);
  const i = nearestIndex(h);
  const ROW = 46;
  const H = M.t + YEARS.length * ROW + 40;
  const iw = W - M.l - M.r;
  const px = (v: number) => W - M.r - (v / MAX_H) * iw;
  const bottom = M.t + YEARS.length * ROW;
  const xticks = [525, 450, 365, 270, 180, 90, 30, 0];

  const segment = (k: number) => {
    const lo = k === 0 ? 0 : (HORIZONS[k - 1] + HORIZONS[k]) / 2;
    const hi = k === HORIZONS.length - 1 ? HORIZONS[k] : (HORIZONS[k] + HORIZONS[k + 1]) / 2;
    return [Math.min(MAX_H, hi), Math.min(MAX_H, lo)] as const;
  };

  const rows = YEARS.map((y) => {
    const r = RACES[y];
    const l = r.leader[i];
    return { y, r, l, ok: l != null && l === r.winner };
  });
  const withPolls = rows.filter((x) => x.l != null);
  const right = withPolls.filter((x) => x.ok).length;

  return (
    <div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full select-none" style={{ touchAction: 'pan-y' }} role="img"
        aria-label="Viedla v prieskumoch strana, ktorá nakoniec vyhrala voľby?" {...drag}>
        {YEARS.map((y, row) => {
          const r = RACES[y];
          const top = M.t + row * ROW;
          return (
            <g key={y}>
              <text x={M.l} y={top + 11} fontSize="11" fill="#374151">
                <tspan fontWeight="700">{y}</tspan>
                <tspan>{`: vyhralo ${r.winner.replace(' (Hnutie Slovensko)', '')} (${fmt(r.winnerResult)} %)`}</tspan>
              </text>
              {HORIZONS.map((_, k) => {
                const l = r.leader[k];
                if (l == null || HORIZONS[k] > MAX_H) return null;
                const [hi, lo] = segment(k);
                return (
                  <rect key={k} x={px(hi)} y={top + 17} width={Math.max(0.5, px(lo) - px(hi) + 1.4)} height={20} shapeRendering="crispEdges"
                    fill={l === r.winner ? GOOD : BAD} opacity="0.85" />
                );
              })}
            </g>
          );
        })}
        <g fontSize="11" fill="#6b7280">
          {xticks.map((t) => (
            <g key={t}>
              <line x1={px(t)} x2={px(t)} y1={bottom} y2={bottom + 4} stroke="#9ca3af" />
              <text x={px(t)} y={bottom + 16} textAnchor="middle">{t === 0 ? 'voľby' : t}</text>
            </g>
          ))}
          <text x={(M.l + W - M.r) / 2} y={bottom + 34} textAnchor="middle">počet dní pred voľbami</text>
        </g>
        <line x1={px(h)} x2={px(h)} y1={M.t} y2={bottom} stroke="#111827" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x={M.l} y={M.t} width={iw} height={bottom - M.t} fill="transparent" style={{ cursor: 'ew-resize' }} />
      </svg>
      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-600">
        <span><span className="inline-block w-3 h-3 align-middle mr-1" style={{ backgroundColor: GOOD }} />v prieskumoch viedla strana, ktorá nakoniec vyhrala</span>
        <span><span className="inline-block w-3 h-3 align-middle mr-1" style={{ backgroundColor: BAD }} />viedla iná strana</span>
      </div>

      <p className="mt-4 text-sm text-neutral-800" aria-live="polite">
        {withPolls.length === 0
          ? 'V tomto bode ešte nemáme prieskumy.'
          : `${h === 0 ? 'V deň volieb' : `${h} dní pred voľbami`} viedla v prieskumoch správna strana v ${right} z ${withPolls.length} volieb.`}
      </p>
      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500 border-b border-neutral-200">
            <th className="py-1 font-medium">Voľby</th>
            <th className="py-1 font-medium">V prieskumoch vedie</th>
            <th className="py-1 font-medium">Vyhrala</th>
            <th className="py-1 font-medium text-right">Zhoda</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ y, r, l, ok }) => (
            <tr key={y} className="border-b border-neutral-100">
              <td className="py-1 tabular-nums">{y}</td>
              <td className="py-1">
                {l == null ? <span className="text-neutral-400">bez prieskumu</span> : (
                  <>{l.replace(' (Hnutie Slovensko)', '')} <span className="tabular-nums text-neutral-500">({fmt(r.leaderAvg[i])} %, náskok {fmt(r.lead[i])} p. b.)</span></>
                )}
              </td>
              <td className="py-1">{r.winner.replace(' (Hnutie Slovensko)', '')} <span className="tabular-nums text-neutral-500">({fmt(r.winnerResult)} %, o {fmt(r.winnerResult - r.secondResult)} p. b. pred {r.second})</span></td>
              <td className="py-1 text-right font-semibold" style={{ color: l == null ? undefined : ok ? GOOD : BAD }}>
                {l == null ? '–' : ok ? '✓ áno' : '✗ nie'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-neutral-500">
        Vedie strana s najvyšším priemerom prieskumov v danom čase. Pri voľbách 2020 sa OĽaNO** v prieskumoch držalo okolo 9 %, vo voľbách však
        získalo 25 % (kandidovalo na listine s ďalšími stranami, pozri poznámku pod ďalším grafom).
      </p>
    </div>
  );
}

const OUTLOOK = data.outlook;

function OutlookChart() {
  const o = OUTLOOK;
  const top = Math.max(...o.parties.map((p) => p.b80[1] as number), 20);
  const max = Math.ceil((top + 1) / 5) * 5;
  const pos = (v: number) => `${(Math.min(v, max) / max) * 100}%`;
  const cov = o.backtest.filter((b) => b.cov50 != null);
  const range = (k: 'cov50' | 'cov80') => {
    const v = cov.map((b) => b[k] as number);
    return `${Math.min(...v)} – ${Math.max(...v)} %`;
  };
  const asOf = o.asOf.split('-').reverse().map(Number).join('. ');
  const f0 = (v: number | null) => fmt(v, 0);

  return (
    <div>
      <p className="text-sm text-neutral-600">
        Stav prieskumov k {asOf} (priemer najnovších prieskumov každej agentúry), {o.horizon} dní pred predpokladanými voľbami.
        Pásma ukazujú, kde skončili strany s podobným prieskumom v rovnakom bode pred voľbami 2012, 2016, 2020 a 2023.
        Nie je to predpoveď, ale rozsah, v ktorom sa história pohybovala.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-600">
        <span><span className="inline-block w-5 h-2.5 align-middle mr-1 bg-neutral-900" />polovica takýchto strán skončila v tomto pásme</span>
        <span><span className="inline-block w-5 h-2.5 align-middle mr-1 bg-neutral-300" />8 z 10 strán skončilo v tomto pásme</span>
        <span><span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1 border-2 border-white bg-neutral-950 ring-1 ring-neutral-950" />dnešný priemer prieskumov</span>
      </div>

      <ul className="mt-4 space-y-3">
        {o.parties.map((p) => (
          <li key={p.party} className="grid grid-cols-1 sm:grid-cols-12 gap-x-3 gap-y-1 items-center">
            <div className="sm:col-span-3 text-sm font-medium text-neutral-900">
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
              {p.party.replace(' (Hnutie Slovensko)', '')}
            </div>
            <div className="sm:col-span-6 relative h-6" role="img"
              aria-label={`${p.party}: prieskum ${fmt(p.avg)} %, polovica prípadov ${f0(p.b50[0])} až ${f0(p.b50[1])} %, 8 z 10 prípadov ${f0(p.b80[0])} až ${f0(p.b80[1])} %`}>
              <div className="absolute inset-x-0 top-2.5 h-1 bg-neutral-100" />
              <div className="absolute top-1.5 h-3 bg-neutral-300" style={{ left: pos(p.b80[0] as number), width: `calc(${pos(p.b80[1] as number)} - ${pos(p.b80[0] as number)})` }} />
              <div className="absolute top-1 h-4 bg-neutral-900" style={{ left: pos(p.b50[0] as number), width: `calc(${pos(p.b50[1] as number)} - ${pos(p.b50[0] as number)})` }} />
              <div className="absolute top-0.5 w-3.5 h-3.5 -ml-[7px] rounded-full border-2 border-white" style={{ left: pos(p.avg), backgroundColor: p.color, boxShadow: '0 0 0 1px #111827' }} />
              <div className="absolute inset-y-0 border-l border-dashed border-red-500" style={{ left: pos(5) }} title="5 % hranica" />
            </div>
            <div className="sm:col-span-3 text-xs text-neutral-700 tabular-nums">
              <strong>{fmt(p.avg)} %</strong> v prieskumoch
              <div className="text-neutral-500">{f0(p.b50[0])} – {f0(p.b50[1])} % (8 z 10: {f0(p.b80[0])} – {f0(p.b80[1])} %)</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-1 grid sm:grid-cols-12 gap-x-3 text-[10px] text-neutral-400">
        <div className="sm:col-start-4 sm:col-span-6 flex justify-between"><span>0 %</span><span className="text-red-500">5 % hranica (červená čiara)</span><span>{max} %</span></div>
      </div>

      {o.below.length > 0 && (
        <p className="mt-3 text-xs text-neutral-600">
          Pod 5 %: {o.below.map((b) => `${b.party} ${fmt(b.avg)} %`).join(', ')}. Pre ne pásmo nepočítame, lebo v minulosti máme málo prípadov strán s takým prieskumom.
        </p>
      )}
      <p className="mt-3 text-sm text-neutral-700">
        Typický posun: výsledok strán s prieskumom nad 5 % bol rok pred voľbami v strede (medián) na <strong>{f0((o.medianRatio ?? 1) * 100)} %</strong>{' '}
        prieskumovej hodnoty, teda prieskumy boli v priemere trochu vyššie než výsledky. Pásma tento posun už zahŕňajú, preto nie sú symetrické okolo bodu.
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        Overenie na minulosti: pásma sme vždy počítali z troch volieb a testovali na štvrtých. Pásmo „polovica“ zachytilo skutočný výsledok v {range('cov50')} prípadov, pásmo „8 z 10“ v {range('cov80')} prípadov
        (podľa vzdialenosti od volieb, približne {cov[0]?.n} prípadov na každú vzdialenosť). Vychádza to len zo štyroch volieb a z {o.cases} prípadov strán, nové strany a koalície môžu byť iné.
      </p>
    </div>
  );
}

export default function Preferencie() {
  const [days, setDays] = useState<number | null>(null); // dnes -> dni do volieb; až po načítaní v prehliadači
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

  const play = () => {
    setH(MAX_H);
    setPlaying(true);
  };
  const move = (v: number) => {
    setPlaying(false);
    setH(v);
  };

  const i = nearestIndex(h);
  const mae = data.mae[i];
  const rb50 = data.relParl50[i] ?? data.relMedian[i];
  const rb80 = data.relParl80[i] ?? rb50;
  const nParl = data.nParl[i];
  const band = (rel: number) => `${fmt(Math.max(0, 20 - (20 * rel) / 100), 0)} a ${fmt(20 + (20 * rel) / 100, 0)}`;
  const base = data.baseline[i];
  const nUnits = data.n[i];
  const weeks = Math.round(h / 7);

  let status: string;
  if (days == null) status = 'Rok pred voľbami (365 dní) bola typická odchýlka priemeru prieskumov od výsledku takmer 4 percentuálne body.';
  else if (days < 0) status = 'Predpokladaný termín volieb už uplynul. Ak sa voľby ešte nekonali, termín sa posunul – graf teraz funguje ako archív: posuňte posuvník alebo pustite odpočet od začiatku.';
  else if (days > MAX_H) status = `Do volieb zostáva ${days} dní – to je ďalej, než siahajú naše historické dáta (${MAX_H} dní), preto ukazujeme najvzdialenejší bod.`;
  else status = `Do predpokladaných volieb (jeseň ${NEXT_ELECTION.year}) zostáva ${days} dní (približne ${Math.round(days / 7)} týždňov).`;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-neutral-900">Odpočet: ako sa prieskumy mýlili v rovnakom bode pred minulými voľbami</h2>
        <p className="mt-2 text-neutral-700" aria-live="polite">{status}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3 text-center">
          <div className="rounded-lg bg-neutral-50 p-4">
            <div className="text-3xl font-extrabold tabular-nums">{h}</div>
            <div className="text-xs text-neutral-600">dní pred voľbami (≈ {weeks} týždňov)</div>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4">
            <div className="text-3xl font-extrabold tabular-nums">{fmt(mae)} <span className="text-base font-semibold">p. b.</span></div>
            <div className="text-xs text-neutral-600">priemerná odchýlka priemeru prieskumov od výsledku</div>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4">
            <div className="text-3xl font-extrabold tabular-nums">{fmt(rb50, 0)} %</div>
            <div className="text-xs text-neutral-600">typická odchýlka strany nad 5 % ako podiel z jej výsledku (medián)</div>
          </div>
        </div>
        <details className="mt-3 text-sm text-neutral-700">
          <summary className="cursor-pointer font-medium">Čo je percentuálny bod a čo znamená „% z výsledku strany“?</summary>
          <div className="mt-2 space-y-2 text-neutral-600">
            <p>
              <strong>Percentuálny bod (p. b.)</strong> je rozdiel medzi dvoma percentami. Ak mala strana v prieskume 20 % a vo voľbách
              získala 24 %, líši sa o 4 p. b. (24 − 20), nie o 4 %.
            </p>
            <p>
              <strong>% z výsledku strany</strong> hovorí, aký veľký je ten rozdiel vzhľadom na veľkosť strany: 4 p. b. z 24 % je 17 %.
              Strana, ktorej výsledok je 20 % a odchýlka 35 %, bola v prieskume nameraná asi o 7 p. b. inak (napr. 13 % namiesto 20 %).
              <em> Medián</em> je prostredný prípad: polovica strán mala odchýlku menšiu, polovica väčšiu.
            </p>
            <p>Viac s príkladmi nájdete v texte pod grafmi.</p>
          </div>
        </details>

        <p className="mt-3 text-sm text-neutral-700">
          Strana, ktorá nakoniec získala 20 %, bola v tomto bode v polovici prípadov nameraná medzi{' '}
          <strong>{band(rb50)} %</strong>. V 8 z 10 prípadov bola v rozmedzí <strong>{band(rb80)} %</strong>, v 2 z 10
          ešte ďalej.
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          Ide o {nParl} prípadov strán, ktoré prekročili 5 % hranicu (výsledok aspoň 5 %), z volieb 2012, 2016, 2020 a 2023, preto je to orientačný
          údaj, nie záruka. Bez prieskumov, len podľa výsledku predchádzajúcich volieb, by sme sa mýlili v priemere o{' '}
          {fmt(base)} p. b. Priemerná odchýlka {fmt(mae)} p. b. vyššie sa počíta zo všetkých {nUnits} strán vrátane malých, ktoré
          majú aj malé odchýlky v bodoch, preto je nižšia než odchýlka väčších strán.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <label htmlFor="pref-days" className="sr-only">Dní pred voľbami</label>
          <input id="pref-days" type="range" min={0} max={MAX_H} value={h} onChange={(e) => move(Number(e.target.value))}
            className="flex-1 accent-neutral-900" style={{ direction: 'rtl' }} />
          <button onClick={play} className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-700">▶ Odpočet</button>
          {days != null && days >= 0 && days <= MAX_H && (
            <button onClick={() => move(days)} className="px-3 py-1.5 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100">Dnes</button>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-neutral-900">Aká veľká je odchýlka prieskumov od výsledku volieb?</h3>
        <p className="mt-1 mb-3 text-sm text-neutral-600">
          Priemer najnovších prieskumov od každej agentúry (použité len prieskumy zverejnené do daného dňa) oproti
          skutočnému výsledku strán. Kliknutím alebo ťahaním v grafe posúvate čas.
        </p>
        <ErrorChart h={h} setH={move} />
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-neutral-900">Kto vyhráva? Viedla v prieskumoch strana, ktorá nakoniec vyhrala?</h3>
        <p className="mt-1 mb-3 text-sm text-neutral-600">
          Zelená znamená, že v danom čase viedla v prieskumoch strana, ktorá voľby nakoniec vyhrala. Čas posúvate rovnako ako vyššie.
        </p>
        <WinnerChart h={h} setH={move} />
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-neutral-900">Prieskumy vs. výsledok: strana po strane</h3>
        <p className="mt-1 mb-3 text-sm text-neutral-600">
          Vyberte voľby a strany. Zvislá čiara je rovnaký čas ako v odpočte vyššie.
        </p>
        <PollsChart h={h} setH={move} />
      </Card>
      <Card>
        <h3 className="text-lg font-bold text-neutral-900">Výhľad na voľby {NEXT_ELECTION.year}: čo by mohlo vyjsť, ak sa prieskumy mýlia ako v minulosti</h3>
        <div className="mt-2">
          <OutlookChart />
        </div>
      </Card>
      <p className="text-xs text-neutral-500">Zdroj: SME.sk, sk.wikipedia.org (CC BY-SA 4.0), de.wikipedia.org (CC BY-SA 4.0). Výpočty: data bistro.</p>
    </div>
  );
}
