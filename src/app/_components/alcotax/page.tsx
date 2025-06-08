
import { Card } from '@tremor/react';
import HeaderChart from "@/app/_components/alcotax/headerchart";
import BarChartTax from "@/app/_components/alcotax/barchart";
import DetailsChart from "@/app/_components/alcotax/comparechart";
import DetailChart from "@/app/_components/alcotax/detailchart";

export default async function PageCharts({ }) {
    return (
        <>
            <Card className="p-6">
                <HeaderChart />
                <BarChartTax />
                <DetailsChart />
                <DetailChart />
            </Card>
        </>
    );
}