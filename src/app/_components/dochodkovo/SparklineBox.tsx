import { SparkAreaChart } from '@tremor/react';

type SparklineBoxProps = {
  data: { year: string; value: number | null }[];
  color: string;
  label: string;
};

export default function SparklineBox({ data, color, label }: SparklineBoxProps) {
  // Filter out nulls for the chart
  const filtered = data.filter(d => d.value !== null);
  return (
    <div className="w-full mt-4">
      <SparkAreaChart
        data={filtered}
        index="year"
        categories={['value']}
        colors={[color]}
        showGradient={false}
        className="h-10 w-full"
      />
    </div>
  );
}