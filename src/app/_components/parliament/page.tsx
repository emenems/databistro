import SummaryCards from "@/app/_components/parliament/cards";
import SummaryCharts from "@/app/_components/parliament/series";
import FunFacts from "@/app/_components/parliament/funfacts";

export default async function PageCharts({ }) {
    return (
        <>
            <div className="container flex flex-col items-start">
                <h2 className="text-2xl font-bold mb-2 ml-0">Základné štatistiky</h2>
                <SummaryCards />
            </div>
            <div className="container flex flex-col items-start mt-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Hlasovanie v grafoch</h2>
                <SummaryCharts />
            </div>
            <div className="container flex flex-col items-start mt-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Poslanci - fun facts</h2>
                <FunFacts />
            </div>
        </>
    );
}