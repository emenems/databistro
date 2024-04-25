
import { AirQualityBarlist, AirQualityDetail } from "@/app/_components/airqualitysk/charts";

export default async function PageCharts({ }) {
    return (
        <>
            <div className="container flex flex-row items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <AirQualityBarlist />
                    <AirQualityDetail />
                </div>
            </div>
        </>
    );
}