'use client';

import CustomBarChart from './barchart';
import KPIs from './kpi';
import Header from './header';

import { Card } from '@tremor/react';

const OptimisticDashboard = () => {
  return (
    <Card className="p-4" key={"optimistic-barchart"}>
      <Header title={"PosCo  - The Positive Company"} subtitle=''/>
      <KPIs positive={true}/>
      <CustomBarChart subtract={0} color={'blue'} animation={true} minValue={960} maxValue={980}/>
    </Card>
  );
}

const PessimisticDashboard = () => {
  return (
    <Card className="p-4 min-w-64" key={"pessimistic-barchart"}>
      <Header title={"AlGo - Always Negative Company"} subtitle=''/>
      <KPIs positive={false}/>
      <CustomBarChart subtract={0} color={'slate'} animation={false} minValue={0} maxValue={1000}/>
    </Card>
  );
}
export default function PageCharts({ }) {
  return (
    <>
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <OptimisticDashboard />
        <PessimisticDashboard />
      </dl>
    </>
  );
}