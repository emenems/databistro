'use client';

import { Card, BadgeDelta } from "@tremor/react";
import { absoluteGrowth, relativeGrowth, currentRevenue, monthlyGrowth } from "./data";
import {AvailabilityPlot, UnavailabilityPlot} from "./tracker";

interface KpiProps {
  showBadge: boolean;
  showColor: boolean;
  color: string;
  value: string;
  valueBadge: string;
  title: string;
}

function KPI({ showBadge, showColor, color, value, valueBadge, title }: KpiProps) {
  return (
    <Card
      className="p-4"
      decoration={showColor ? "top" : null}
      decorationColor={showColor ? color : null}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {value}
          </p>
          <dt className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            {title}
          </dt>
        </div>
        {showBadge && (
          <BadgeDelta
            deltaType={"moderateIncrease"}
            isIncreasePositive={true}
            size="sm"
          >
            {valueBadge}
          </BadgeDelta>
        )}
      </div>
    </Card>
  );
}

export default function KPIs( {positive} : {positive: boolean} ) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KPI
        showBadge={positive}
        showColor={true}
        color={positive ? "blue" : "slate"}
        value={currentRevenue.toString()+"M"}
        valueBadge={""}
        title={"Total Revenue"}
      />
      <KPI
        showBadge={positive}
        showColor={true}
        color={positive ? "emerald" : "red"}
        value={positive ? "+"+absoluteGrowth.toString()+"M" : relativeGrowth.toString()+"%"}
        valueBadge={""}
        title={"Growth"}
      />
      {positive ? <AvailabilityPlot /> : <UnavailabilityPlot />}
    </div>
  );
}