import CarChart from "@/app/_components/elektromobilita/carchart";
import FunFacts from "@/app/_components/elektromobilita/funfacts";
import CarTable from "@/app/_components/elektromobilita/cartable";

export default async function PageCharts({ }) {
    return (
        <>
            <div className="container flex flex-col items-start mt-8 mb-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Štatistiky registrovaných elektromobilov za rok 2024</h2>
                <FunFacts />
            </div>
            <div className="container flex flex-col items-start mb-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Nové registrácie v čase</h2>
                <CarChart />
            </div>
            <div className="container flex flex-col items-start mt-8">
                <h2 className="text-2xl font-bold mb-2 ml-0">Tabuľka všetkých registrovaných elektromobilov od 2021</h2>
                <CarTable />
            </div>
        </>
    );
}