import TradeMap from "./trademap";
import TradeChart from "./tradechart";
import TradeTable from "./tradetable";

export default async function PageCharts({ }) {
  return (
      <>
          <div className="container flex flex-col items-center mt-8">
              <h2 className="text-2xl font-bold mb-2 text-center">Zahraničný obchodu Slovenskej Republiky za rok 2024</h2>
              <TradeMap />
          </div>
          <div className="container flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">Vývoj obchodnej bilancie v čase</h2>
              <TradeChart />
          </div>
          <div className="container flex flex-col items-center mt-8">
              <TradeTable />
          </div>
      </>
  );
}