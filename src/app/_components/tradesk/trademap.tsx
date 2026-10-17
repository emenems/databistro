"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule } from "react-simple-maps";
import { RadioGroup } from '@headlessui/react';
import { tradeData as tradeDataLatest, summaryData as tabs } from './tradedata';
import TradeCard from "./tradecard";
import { classNames, valueFormatter as formatValue } from "./tradeutils";

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function interpolateHexColor(from: string, to: string, tRaw: number) {
  const t = clamp01(tRaw);
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex(
    Math.round(lerp(a.r, b.r, t)),
    Math.round(lerp(a.g, b.g, t)),
    Math.round(lerp(a.b, b.b, t)),
  );
}

// Minimal replacement for `d3-scale` linear color scales.
// Returns a function that maps a value to a hex color using piecewise linear segments.
function createPiecewiseLinearScale(domain: number[], range: string[]) {
  if (domain.length < 2) {
    throw new Error("createPiecewiseLinearScale: domain must contain at least 2 points");
  }
  if (domain.length !== range.length) {
    throw new Error("createPiecewiseLinearScale: domain and range must have same length");
  }

  return (value: number) => {
    if (value <= domain[0]) return range[0];
    const lastIdx = domain.length - 1;
    if (value >= domain[lastIdx]) return range[lastIdx];

    // Find the segment [i, i+1] that contains `value`.
    for (let i = 0; i < lastIdx; i++) {
      const d0 = domain[i];
      const d1 = domain[i + 1];
      if (value >= d0 && value <= d1) {
        const t = (value - d0) / (d1 - d0 || 1);
        return interpolateHexColor(range[i], range[i + 1], t);
      }
    }

    // Fallback (shouldn't happen due to clamping above).
    return range[lastIdx];
  };
}

function getColorScale(selectedType: string) {
  if (selectedType === 'Bilancia') {
    return createPiecewiseLinearScale(
      [-450, 0, 450],
      ["#f43f5e", "#DDDDDD", "#0ea5e9"],
    );
  } else {
    // use blue for exports and red for imports
    return createPiecewiseLinearScale(
      [0, 4000],
      ["#DDDDDD", selectedType === 'Vývoz' ? '#0ea5e9' : '#f43f5e'],
    );
  }
}

function getColor(dovoz: number, vyvoz: number, selectedType: string): string {
  const colorScale = getColorScale(selectedType);
  if (dovoz === 0 || vyvoz === 0) {
    return "#DDDDDD";
  }
  if (selectedType === 'Bilancia') {
    const difference = (vyvoz - dovoz) / 1_000; // Convert to billions for scale
    return colorScale(difference);
  } else if (selectedType === 'Vývoz') {
    return colorScale(vyvoz / 1_000);
  } else {
    return colorScale(dovoz / 1_000);
  }
}

export default function TradeMap() {
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  const [selectedType, setSelectedType] = useState('Bilancia');
  const geoUrl = "/assets/maps/features.json";

  return (
    <>
      <div className="container relative flex flex-col items-center mt-8 mb-8 max-w-3xl mx-auto">
        <RadioGroup
          value={selectedType}
          onChange={setSelectedType}
        >
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <RadioGroup.Option
                key={tab.name}
                value={tab.name}
                className={({ active }) =>
                  classNames(
                    active
                      ? 'border-tremor-brand-subtle ring-2 ring-tremor-brand-muted dark:border-dark-tremor-brand-subtle dark:ring-dark-tremor-brand-muted'
                      : 'border-tremor-border dark:border-dark-tremor-border',
                    'relative block cursor-pointer rounded-tremor-default border bg-tremor-background px-4 py-3 transition dark:bg-dark-tremor-background sm:min-w-40 min-w-24',
                  )
                }
              >
                {({ checked, active }) => (
                  <>
                    <h3 className="text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                      {tab.name}
                      </h3>
                      <p className="sm:text-tremor-title text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {formatValue(tab.value)}
                      </p>
                    <span
                      className={classNames(
                        active ? 'border' : 'border-2',
                        checked
                          ? 'border-tremor-brand dark:border-dark-tremor-brand'
                          : 'border-transparent',
                        'pointer-events-none absolute -inset-px rounded-tremor-default',
                      )}
                      aria-hidden={true}
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
        <ComposableMap>
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isoCode = geo.id as keyof typeof tradeDataLatest;
                const { dovoz, vyvoz } = tradeDataLatest[isoCode] || { dovoz: 0, vyvoz: 0 };
                const fillColor = getColor(dovoz, vyvoz, selectedType) || "#DDDDDD";
                const name = geo.properties?.name;
                const tooltipValue = {
                  name,
                  total: formatValue(vyvoz - dovoz),
                  split: [(vyvoz / (vyvoz + dovoz)) * 100, (dovoz / (vyvoz + dovoz)) * 100],
                  details: [
                    { name: 'Vývoz', value: formatValue(vyvoz) },
                    { name: 'Dovoz', value: formatValue(dovoz) },
                  ],
                };

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#FFFFFF"
                    onMouseEnter={() => {
                      setTooltipContent(tooltipValue);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent(null);
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {tooltipContent && (
          <div className="absolute bottom-0 left-0 right-0 p-4 h-64 max-w-64">
            <TradeCard item={tooltipContent} />
          </div>
        )}
      </div>
    </>
  );
}