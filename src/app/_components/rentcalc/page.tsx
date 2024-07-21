
import RentCalc from "@/app/_components/rentcalc/calculate-rent";

export default async function PageCharts({ }) {
    return (
        <>
            <div className="container flex flex-row items-center">
                <RentCalc />
            </div>
        </>
    );
}