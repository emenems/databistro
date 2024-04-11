
import { DemographySummaryCards } from "@/app/_components/demography/cards";
import { DemographyAgeSeries } from "@/app/_components/demography/series";
import { DemographyBarChart } from "@/app/_components/demography/barchart";
import { getDemographySeries, getDemographyAgeSeries } from "@/lib/api";

export default async function PageCharts({ }) {
    const data = await getDemographySeries("all","all","eu");
    const dataAge = await getDemographyAgeSeries("all","all","ce","all");
    const dataAgeMedian = await getDemographyAgeSeries("all","all","ce","median");
    return (
        <>
            <div className="container flex flex-row items-center">
                <DemographySummaryCards data={data}/>
            </div>
            <div className="container flex flex-row items-center mt-8">
                <DemographyBarChart data={data}/>
            </div>
            <div className="container flex flex-row items-center mt-8">
                <DemographyAgeSeries dataAge={dataAge} dataAgeMedian={dataAgeMedian}/>
            </div>
        </>
    );
}