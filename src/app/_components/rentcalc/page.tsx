
import RentCalc from "@/app/_components/rentcalc/calculate-rent";
import { getStockReturnSeries } from "@/lib/api";

export default async function PageCharts({ }) {
    const data = await getStockReturnSeries();
    return (
        <>
            <div className="container flex flex-row items-center">
                <RentCalc stockData={data}/>
            </div>
        </>
    );
}