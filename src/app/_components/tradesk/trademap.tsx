"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule } from "react-simple-maps";
import { scaleLinear } from 'd3-scale';
import { RadioGroup } from '@headlessui/react';
import { tradeData as tradeDataLatest, summaryData as tabs } from './tradedata';
import TradeCard from "./tradecard";
import { classNames, valueFormatter as formatValue } from "./tradeutils";

function getColorScale(selectedType: string) {
  if (selectedType === 'Bilancia') {
    return scaleLinear<string>()
      .domain([-450, 0, 450])
      .range(['#f43f5e', '#DDDDDD', '#0ea5e9']);
  } else {
    // use blue for exports and red for imports
    return scaleLinear<string>()
      .domain([0, 4000])
      .range(['#DDDDDD', selectedType === 'Vývoz' ? '#0ea5e9' : '#f43f5e']);
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
                const name = geo.properties.name;
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