'use client';
import AverageSalaryPension from "./AverageSalaryPension";
import FunFactCard from "./FunFacts";
import PensionInflationChart from "./PensionInflationChart";
import StackYourPension from "./StackYourPension";
const Page = () => {
  return (
    <>
      <AverageSalaryPension />
      <FunFactCard />
      <StackYourPension />
      <PensionInflationChart />
    </>
  );
};
export default Page;