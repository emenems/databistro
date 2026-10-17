import React from "react";
import { stackedBarData } from "./dochodkovo/data";
import { constitutions } from "./ustava/data";
import { monthlyAverage } from "./alcotax/data";
import { dataTable as tradeDataTable } from "./tradesk/tradedata";
import { dataRegistered as krimiDataRegistered } from "./krimianalytika/krimidata";
import { stats as evStats } from "./elektromobilita/cardata";
import { euroStatData as giniEurostat } from "./ginicalc/utils";
import { revenueSeries } from "./trashboard/data";

type Props = {
  slug: string;
  codeName?: string;
};

/**
 * Renders an authentic mini data-visualization card for each article on databistro.eu,
 * importing the exact datasets and numbers from the corresponding post component.
 */
export function PostSpecimen({ slug, codeName }: Props) {
  const key = codeName || slug;

  return (
    <div className="bg-[#F8FAFC] group-hover:bg-[#F1F5F9] border border-neutral-200 transition-colors p-5 w-full">
      {renderRealDataChart(key)}
    </div>
  );
}

function renderRealDataChart(key: string) {
  switch (key) {
    case "Dochodkovo":
    case "dochodkovo": {
      // Real data from src/app/_components/dochodkovo/data.ts (stackedBarData 2024)
      const maxGross = 1524.0;
      const rows = stackedBarData.map((d) => {
        const net = d["Čistý príjem"];
        const tax = d["Odvody a dane"];
        const gross = net + tax;
        return {
          label: d.name === "Priemerý plat" ? "Priemerný plat" : d.name,
          net,
          tax,
          gross,
        };
      });

      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Porovnanie príjmov v SR (2024, €/mes.)
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#1D4ED8] inline-block" /> Čistý
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-rose-500 inline-block" /> Odvody
              </span>
            </div>
          </div>
          <div className="space-y-2.5 font-mono text-xs tabular-nums">
            {rows.map((r) => {
              const netPct = (r.net / maxGross) * 100;
              const taxPct = (r.tax / maxGross) * 100;
              return (
                <div key={r.label} className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-neutral-700 font-sans text-xs font-medium truncate">
                    {r.label}
                  </span>
                  <div className="col-span-5 bg-neutral-200/70 h-4 flex overflow-hidden">
                    <div
                      className="bg-[#1D4ED8] h-full"
                      style={{ width: `${netPct}%` }}
                    />
                    {r.tax > 0 && (
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${taxPct}%` }}
                      />
                    )}
                  </div>
                  <span className="col-span-3 text-right font-semibold text-neutral-900">
                    {r.gross.toFixed(0)} €
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "Ustava":
    case "ustava": {
      // Real data from src/app/_components/ustava/data.ts
      const refYear = 2025.6;
      const items = constitutions
        .map((c) => {
          const adoptedYear =
            c["dátum prijatia"].getFullYear() +
            c["dátum prijatia"].getMonth() / 12;
          const years = Math.max(1, refYear - adoptedYear);
          const perYear = c["počet novelizácií"] / years;
          return {
            country: c.krajina === "Česká republika" ? "Česko" : c.krajina,
            amendments: c["počet novelizácií"],
            year: c["dátum prijatia"].getFullYear(),
            perYear,
            Icon: c.icon,
          };
        })
        .sort((a, b) => b.perYear - a.perYear);

      const maxPerYear = Math.max(...items.map((i) => i.perYear));

      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Priemerný počet novelizácií ústavy za rok
            </span>
            <span>novely / rok</span>
          </div>
          <div className="space-y-1.5 font-mono text-xs tabular-nums">
            {items.map((item, idx) => {
              const widthPct = (item.perYear / maxPerYear) * 100;
              const Flag = item.Icon;
              return (
                <div
                  key={item.country}
                  className="grid grid-cols-12 items-center gap-2"
                >
                  <div className="col-span-4 flex items-center gap-1.5 truncate font-sans text-xs">
                    {Flag ? <Flag className="w-3.5 h-2.5 shrink-0" /> : null}
                    <span
                      className={
                        idx === 0
                          ? "font-bold text-neutral-950 truncate"
                          : "text-neutral-700 truncate"
                      }
                    >
                      {item.country}
                    </span>
                  </div>
                  <div className="col-span-5 bg-neutral-200/70 h-3.5 overflow-hidden">
                    <div
                      className={
                        idx === 0 ? "bg-[#1D4ED8] h-full" : "bg-[#93B4F8] h-full"
                      }
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="col-span-3 text-right text-[11px] text-neutral-800">
                    <strong>{item.perYear.toFixed(2)}</strong>{" "}
                    <span className="text-neutral-400">({item.amendments}×)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "AlcoTax":
    case "alcotax": {
      // Real data from src/app/_components/alcotax/data.ts (monthlyAverage)
      const total = monthlyAverage.reduce((acc, item) => acc + item.amount, 0);

      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Mesačný výber spotrebnej dane (Ø 2024)
            </span>
            <span className="font-bold text-neutral-950">112,25 mil. €</span>
          </div>
          <div className="space-y-2.5 font-mono text-xs tabular-nums">
            {monthlyAverage.map((item, idx) => {
              const share = (item.amount / total) * 100;
              const mil = item.amount / 1_000_000;
              return (
                <div
                  key={item.name}
                  className="grid grid-cols-12 items-center gap-2"
                >
                  <span className="col-span-3 font-sans text-xs font-medium text-neutral-800">
                    {item.name}
                  </span>
                  <div className="col-span-5 bg-neutral-200/70 h-4 overflow-hidden">
                    <div
                      className={
                        idx === 0 ? "bg-[#1D4ED8] h-full" : "bg-[#93B4F8] h-full"
                      }
                      style={{ width: `${Math.max(2, share)}%` }}
                    />
                  </div>
                  <span className="col-span-4 text-right text-[11px]">
                    <strong>{mil.toFixed(2)} mil. €</strong>{" "}
                    <span className="text-neutral-400">
                      ({share.toFixed(1)}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "TradeSK":
    case "tradesk": {
      // Real 2024 trade balance data from src/app/_components/tradesk/tradedata.tsx
      const rows2024 = tradeDataTable.filter(
        (r) => r.year === 2024 && r.country !== "SPOLU"
      );
      const topSurplus = rows2024.slice(0, 2); // Nemecko, Spojené kráľovstvo
      const topDeficit = rows2024.slice(-2).reverse(); // Kórejská republika, Čína
      const selected = [...topSurplus, ...topDeficit];
      const maxAbs = Math.max(...selected.map((r) => Math.abs(r.bilancia)));

      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Obchodná bilancia SR 2024 (Spolu: +3,29 mld. €)
            </span>
          </div>
          <div className="space-y-2.5 font-mono text-xs tabular-nums">
            {selected.map((r) => {
              const mld = r.bilancia / 1_000_000;
              const isPos = r.bilancia >= 0;
              const pct = (Math.abs(r.bilancia) / maxAbs) * 100;
              const shortName =
                r.country === "Spojené kráľovstvo"
                  ? "Veľká Británia"
                  : r.country === "Kórejská republika"
                  ? "Južná Kórea"
                  : r.country;
              return (
                <div
                  key={r.country}
                  className="grid grid-cols-12 items-center gap-2"
                >
                  <span className="col-span-4 font-sans text-xs font-medium text-neutral-800 truncate">
                    {shortName}
                  </span>
                  <div className="col-span-5 flex items-center">
                    <div className="w-1/2 flex justify-end pr-0.5">
                      {!isPos && (
                        <div
                          className="bg-rose-500 h-3.5"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                    </div>
                    <div className="w-px h-4 bg-neutral-400 shrink-0" />
                    <div className="w-1/2 pl-0.5">
                      {isPos && (
                        <div
                          className="bg-[#1D4ED8] h-3.5"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                    </div>
                  </div>
                  <span
                    className={`col-span-3 text-right font-semibold ${
                      isPos ? "text-[#1D4ED8]" : "text-rose-600"
                    }`}
                  >
                    {isPos ? "+" : ""}
                    {mld.toFixed(2)} mld.
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "Krimianalytika":
    case "krimianalytika": {
      // Real crime totals from src/app/_components/krimianalytika/krimidata.tsx
      const totals = krimiDataRegistered.map((row) => {
        const sum =
          row["Násilná"] +
          row["Mravnostná"] +
          row["Majetková"] +
          row["Ostatná"] +
          row["Zostávajúca"] +
          row["Ekonomická"];
        return { year: row.date, total: sum };
      });
      const maxTotal = Math.max(...totals.map((t) => t.total));

      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Evidované trestné činy v SR (2012 – 2024)
            </span>
            <span className="font-bold text-[#1D4ED8]">−50,3 %</span>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-24 pt-2 border-b border-neutral-300">
            {totals.map((t, idx) => {
              const hPct = (t.total / maxTotal) * 100;
              const isEndpoint = idx === 0 || idx === totals.length - 1;
              return (
                <div
                  key={t.year}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div
                    className={`w-full ${
                      isEndpoint ? "bg-[#1D4ED8]" : "bg-[#93B4F8]"
                    }`}
                    style={{ height: `${hPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between font-mono text-[11px] text-neutral-600 mt-2 tabular-nums">
            <span>
              2012: <strong>90 351</strong> činov
            </span>
            <span>
              Znásilnenia: <strong className="text-rose-600">+32 %</strong>
            </span>
            <span>
              2024: <strong>44 914</strong> činov
            </span>
          </div>
        </div>
      );
    }

    case "Elektromobilita":
    case "elektromobilita": {
      // Real EV registration stats from src/app/_components/elektromobilita/cardata.tsx
      const items = evStats.map((s) => ({
        year: s.year.toString(),
        evCount: s.pocet_elektro,
        total: s.pocet_vsetky,
        share: (s.pocet_elektro / s.pocet_vsetky) * 100,
      }));

      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Podiel čisto elektrických áut (BEV) v SR
            </span>
            <span>EÚ Ø: 14,6 %</span>
          </div>
          <div className="space-y-2.5 font-mono text-xs tabular-nums">
            {items.map((item) => {
              const widthPct = (item.share / 15) * 100;
              return (
                <div
                  key={item.year}
                  className="grid grid-cols-12 items-center gap-2"
                >
                  <span className="col-span-2 font-bold text-neutral-800">
                    {item.year}
                  </span>
                  <div className="col-span-6 bg-neutral-200/70 h-4 overflow-hidden">
                    <div
                      className={
                        item.year === "2024"
                          ? "bg-[#1D4ED8] h-full"
                          : "bg-[#93B4F8] h-full"
                      }
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="col-span-4 text-right text-[11px]">
                    <strong>{item.share.toFixed(1)} %</strong>{" "}
                    <span className="text-neutral-400">
                      ({item.evCount.toLocaleString("sk-SK")})
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "GiniCalc":
    case "ginicalc": {
      // Real Eurostat Gini data from src/app/_components/ginicalc/utils.tsx (2023)
      const latest = giniEurostat[giniEurostat.length - 1];
      const rows = [
        { name: "Slovensko (1. v EÚ)", val: latest["Slovensko"], primary: true },
        { name: "Česko", val: latest["Česko"], primary: false },
        { name: "Nemecko", val: latest["Nemecko"], primary: false },
        { name: "EÚ priemer", val: latest["EU primer"], primary: false },
        { name: "Bulharsko", val: latest["Bulgarsko"], primary: false },
      ];

      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Gini koeficient príjmovej nerovnosti (Eurostat)
            </span>
            <span>0 = rovnosť</span>
          </div>
          <div className="space-y-2 font-mono text-xs tabular-nums">
            {rows.map((r) => (
              <div
                key={r.name}
                className="grid grid-cols-12 items-center gap-2"
              >
                <span
                  className={`col-span-5 font-sans text-xs truncate ${
                    r.primary
                      ? "font-bold text-neutral-950"
                      : "text-neutral-700"
                  }`}
                >
                  {r.name}
                </span>
                <div className="col-span-5 bg-neutral-200/70 h-3.5 overflow-hidden">
                  <div
                    className={
                      r.primary ? "bg-[#1D4ED8] h-full" : "bg-[#93B4F8] h-full"
                    }
                    style={{ width: `${(r.val / 0.45) * 100}%` }}
                  />
                </div>
                <span className="col-span-2 text-right font-bold text-neutral-900">
                  {r.val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "Parliament":
    case "parliament2024": {
      // Real voting metrics from src/app/_components/parliament/cards.tsx
      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Hlasovania Národnej rady SR (2024)
            </span>
            <span>150 poslancov</span>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono tabular-nums">
            <div className="bg-white border border-neutral-200 p-2.5">
              <span className="text-[11px] text-neutral-500 block">
                POČET HLASOVANÍ
              </span>
              <span className="text-lg font-extrabold text-neutral-950">
                1 946
              </span>
              <span className="text-[11px] text-[#1D4ED8] block font-semibold">
                Prešlo: 1 050 (53,96 %)
              </span>
            </div>
            <div className="bg-white border border-neutral-200 p-2.5">
              <span className="text-[11px] text-neutral-500 block">
                STLAČENÍ TLAČIDLA
              </span>
              <span className="text-lg font-extrabold text-neutral-950">
                252 991
              </span>
              <span className="text-[11px] text-neutral-600 block">
                Účasť: 86,67 % hlasov
              </span>
            </div>
          </div>
        </div>
      );
    }

    case "Trashboard":
    case "trashboard": {
      // Real data from src/app/_components/trashboard/data.ts (Jan: 964 -> Dec: 976)
      const values = revenueSeries.map((r) => r.Revenue);
      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Rovnaké dáta (964 → 976, +1,2 %) dvakrát inak
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-white border border-neutral-200 p-2.5">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-500">Y-os: 0 – 1000</span>
                <span className="text-neutral-700 font-semibold">Stabilné</span>
              </div>
              <div className="flex items-end gap-1 h-14 border-b border-neutral-300">
                {values.slice(0, 6).map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#93B4F8]"
                    style={{ height: `${(v / 1000) * 100}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="bg-white border border-neutral-200 p-2.5">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-500">Y-os: 960 – 978</span>
                <span className="text-[#1D4ED8] font-bold">Prudký rast!</span>
              </div>
              <div className="flex items-end gap-1 h-14 border-b border-neutral-300">
                {values.slice(-6).map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#1D4ED8]"
                    style={{ height: `${((v - 960) / 18) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "OlympicSports":
    case "olympics": {
      // Real LLM consensus votes from src/app/_components/olympics/olympic-sports.tsx (12 prompts across 6 LLMs)
      const sportsRank = [
        { name: "Lukostreľba (Archery)", votes: 11, total: 12 },
        { name: "Streľba (Shooting)", votes: 11, total: 12 },
        { name: "Jazdenie na koni", votes: 10, total: 12 },
        { name: "Jachting (Sailing)", votes: 10, total: 12 },
        { name: "Curling", votes: 7, total: 12 },
      ];
      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Zhoda 6 LLM modelov (12 dopytov)
            </span>
            <span>hlasy</span>
          </div>
          <div className="space-y-1.5 font-mono text-xs tabular-nums">
            {sportsRank.map((s, idx) => (
              <div
                key={s.name}
                className="grid grid-cols-12 items-center gap-2"
              >
                <span className="col-span-5 font-sans text-xs text-neutral-800 truncate">
                  {s.name}
                </span>
                <div className="col-span-5 bg-neutral-200/70 h-3.5 overflow-hidden">
                  <div
                    className={
                      idx < 2 ? "bg-[#1D4ED8] h-full" : "bg-[#93B4F8] h-full"
                    }
                    style={{ width: `${(s.votes / s.total) * 100}%` }}
                  />
                </div>
                <span className="col-span-2 text-right font-bold text-neutral-900">
                  {s.votes}/12
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "RentCalc":
    case "rentcalc": {
      // Real default scenario from src/app/_components/rentcalc/calculate-rent.tsx
      // Nájom 565 €/mes (6 780 €/rok), Výdavky a dane 3 230 €/rok, Čistý výnos 3 550 €/rok (2,73 % p.a. pri cene 130 000 €)
      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Modelový byt 130 000 € (nájom 565 €/mes.)
            </span>
          </div>
          <div className="space-y-2 font-mono text-xs tabular-nums">
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 font-sans text-xs text-neutral-700">
                Hrubý príjem
              </span>
              <div className="col-span-5 bg-neutral-200/70 h-3.5">
                <div className="bg-[#1D4ED8] h-full w-full" />
              </div>
              <span className="col-span-3 text-right font-bold">6 780 €/r</span>
            </div>
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 font-sans text-xs text-neutral-700">
                Náklady a dane
              </span>
              <div className="col-span-5 bg-neutral-200/70 h-3.5">
                <div className="bg-rose-500 h-full w-[47.6%]" />
              </div>
              <span className="col-span-3 text-right text-rose-600 font-semibold">
                −3 230 €/r
              </span>
            </div>
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 font-sans text-xs font-bold text-neutral-950">
                Čistý výnos
              </span>
              <div className="col-span-5 bg-neutral-200/70 h-3.5">
                <div className="bg-emerald-600 h-full w-[52.4%]" />
              </div>
              <span className="col-span-3 text-right font-bold text-emerald-700">
                3 550 €/r
              </span>
            </div>
          </div>
        </div>
      );
    }

    case "AirQualitySKCharts":
    case "airqualitysk": {
      // Real PM10 station measurements (µg/m³) from src/app/_components/airqualitysk/charts.tsx vs EU limit (40 µg/m³)
      const stations = [
        { name: "Jelšava (Jesenského)", pm10: 30.0 },
        { name: "Košice (Štefánikova)", pm10: 27.0 },
        { name: "B. Bystrica (Štefánik. nábr.)", pm10: 26.0 },
        { name: "Bratislava (Trnavské mýto)", pm10: 22.0 },
      ];
      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Priemerné PM₁₀ na staniciach SHMÚ (µg/m³)
            </span>
            <span>Limit: 40</span>
          </div>
          <div className="space-y-2 font-mono text-xs tabular-nums">
            {stations.map((s, idx) => (
              <div
                key={s.name}
                className="grid grid-cols-12 items-center gap-2"
              >
                <span className="col-span-6 font-sans text-xs text-neutral-800 truncate">
                  {s.name}
                </span>
                <div className="col-span-4 bg-neutral-200/70 h-3.5 overflow-hidden">
                  <div
                    className={
                      idx === 0 ? "bg-[#1D4ED8] h-full" : "bg-[#93B4F8] h-full"
                    }
                    style={{ width: `${(s.pm10 / 40) * 100}%` }}
                  />
                </div>
                <span className="col-span-2 text-right font-bold text-neutral-900">
                  {s.pm10.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "DemographyCharts":
    case "demography": {
      // Real Eurostat median age & population stats from src/data/demography
      const countries = [
        { name: "Slovensko (5,43 mil.)", age2003: 35.1, age2023: 41.9, primary: true },
        { name: "Česko (10,83 mil.)", age2003: 38.3, age2023: 43.7, primary: false },
        { name: "EÚ-27 (448,8 mil.)", age2003: 39.0, age2023: 44.5, primary: false },
      ];
      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Mediánový vek populácie (2003 → 2023)
            </span>
            <span>rokov</span>
          </div>
          <div className="space-y-2.5 font-mono text-xs tabular-nums">
            {countries.map((c) => (
              <div
                key={c.name}
                className="grid grid-cols-12 items-center gap-2"
              >
                <span
                  className={`col-span-5 font-sans text-xs truncate ${
                    c.primary ? "font-bold text-neutral-950" : "text-neutral-700"
                  }`}
                >
                  {c.name}
                </span>
                <div className="col-span-4 bg-neutral-200/70 h-3.5 overflow-hidden">
                  <div
                    className={
                      c.primary ? "bg-[#1D4ED8] h-full" : "bg-[#93B4F8] h-full"
                    }
                    style={{ width: `${(c.age2023 / 50) * 100}%` }}
                  />
                </div>
                <span className="col-span-3 text-right text-[11px]">
                  {c.age2003} → <strong>{c.age2023}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "TelcoSKCharts":
    case "telcosk":
    default: {
      // Real 2025 operator profit & revenue from src/app/_components/telcosk/areachart.tsx
      const operators = [
        { name: "Slovak Telekom", profitMil: 124.3, primary: true },
        { name: "Orange Slovensko", profitMil: 90.49, primary: false },
        { name: "O2 Slovakia*", profitMil: 29.45, primary: false },
      ];
      return (
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3 pb-2 border-b border-neutral-200">
            <span className="font-semibold text-neutral-800 uppercase">
              Čistý zisk operátorov v SR (2025)
            </span>
            <span>mil. €</span>
          </div>
          <div className="space-y-2.5 font-mono text-xs tabular-nums">
            {operators.map((op) => (
              <div
                key={op.name}
                className="grid grid-cols-12 items-center gap-2"
              >
                <span
                  className={`col-span-5 font-sans text-xs truncate ${
                    op.primary ? "font-bold text-neutral-950" : "text-neutral-700"
                  }`}
                >
                  {op.name}
                </span>
                <div className="col-span-4 bg-neutral-200/70 h-4 overflow-hidden">
                  <div
                    className={
                      op.primary ? "bg-[#1D4ED8] h-full" : "bg-[#93B4F8] h-full"
                    }
                    style={{ width: `${(op.profitMil / 130) * 100}%` }}
                  />
                </div>
                <span className="col-span-3 text-right font-bold text-neutral-900">
                  {op.profitMil.toFixed(1)} M €
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}
