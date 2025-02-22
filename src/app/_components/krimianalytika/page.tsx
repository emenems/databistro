import LineChartKrimi from "@/app/_components/krimianalytika/krimilinechart";
import KrimiBarChart from "@/app/_components/krimianalytika/krimibarchart";
import KrimiDonut from "@/app/_components/krimianalytika/krimidonut";

export default async function PageCharts({ }) {
    return (
        <>
            <div className="container flex flex-col items-start mt-8 mb-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Vývoj celkovej kriminality</h2>
                <KrimiBarChart />
            </div>
            <div className="container flex flex-col items-start mb-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Vývoj kriminality podľa druhu</h2>
                <LineChartKrimi />
            </div>
            <div className="container flex flex-col items-start mt-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Objasnenosť kriminality</h2>
                <KrimiDonut />
            </div>
        </>
    );
}