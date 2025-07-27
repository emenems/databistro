'use client';
import { Card, Title, BarList } from '@tremor/react';
import { constitutions } from './data';
import ConstitutionTable from './table';

// Prepare data for BarList (dĺžka)
// const barListLength = constitutions.map((item) => ({
//   name: item.krajina,
//   value: item["dĺžka (absolútna)"],
//   icon: item.icon,
//   href: item.znenie,
// }));

// Prepare data for BarList (počet novelizácií)
// const barListAmendments = constitutions.map((item) => ({
//   name: item.krajina,
//   value: item["počet novelizácií"],
//   icon: item.icon,
//   href: item.znenie,
// }));

// Reference: Slovakia's length and date
const slovakia = constitutions.find((item) => item.krajina === "Slovensko");
const slovakiaLength = slovakia ? slovakia["dĺžka (absolútna)"] : 1;
const now = new Date();

// Relative length compared to Slovakia
const barListRelativeLength = constitutions.map((item) => ({
  name: item.krajina,
  value: Number(((item["dĺžka (absolútna)"] / slovakiaLength) * 100).toFixed(0)),
  icon: item.icon,
  href: item.znenie,
}));

// Amendments per year (relative to Slovakia)
const barListAmendmentsPerYear = constitutions.map((item) => {
  const years = Math.max(
    1,
    (now.getFullYear() - item["dátum prijatia"].getFullYear()) +
      (now.getMonth() - item["dátum prijatia"].getMonth()) / 12
  );
  const amendments = item["počet novelizácií"];
  const year = item["dátum prijatia"].getFullYear();
  return {
    name: `${item.krajina} (${amendments}x od roku ${year})`,
    value: Number((amendments / years).toFixed(2)),
    icon: item.icon,
    href: item["zdroj: počet noviel"],
  };
});

const ConstitutionCards: React.FC = () => (
  <Card className="w-full">
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 gap-y-8">
      {/* <div>
        <Title>Porovnanie ústav podľa dĺžky</Title>
        <BarList data={barListLength} className="mt-4" />
      </div>
      <div>
        <Title>Porovnanie ústav podľa počtu novelizácií</Title>
        <BarList data={barListAmendments} className="mt-4" />
      </div> */}
      <div>
        <Title>Relatívna dĺžka ústavy (100% → najdlhšia)</Title>
        <BarList data={barListRelativeLength} className="mt-4" />
      </div>
      <div>
        <Title>Priemerný počet novelizácií za rok (od prijatia)</Title>
        <BarList data={barListAmendmentsPerYear} className="mt-4" />
      </div>
    </div>
    <ConstitutionTable />
</Card>
);

export default ConstitutionCards;