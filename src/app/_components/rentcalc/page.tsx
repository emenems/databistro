
import RentCalc from "@/app/_components/rentcalc/calculate-rent";
// import { getStockReturnSeries } from "@/lib/api";
import { stockReturnSeriesDemo } from "./utils";

export default async function PageCharts({ }) {
    // const data = await getStockReturnSeries("^DJI", "2004-07-01", "2024-07-19");
    return (
        <>
            <div className="container flex flex-row items-center">
                <RentCalc stockData={stockReturnSeriesDemo}/>
            </div>
        </>
    );
}