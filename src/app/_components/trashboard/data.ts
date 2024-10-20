
export const revenueSeries = [
  {
    date: 'Jan',
    Revenue: 964,
  },
  {
    date: 'Feb',
    Revenue: 963,
  },
  {
    date: 'Mar',
    Revenue: 964,
  },
  {
    date: 'Apr',
    Revenue: 965,
  },
  {
    date: 'May',
    Revenue: 966,
  },
  {
    date: 'Jun',
    Revenue: 967,
  },
  {
    date: 'Jul',
    Revenue: 969,
  },
  {
    date: 'Aug',
    Revenue: 970,
  },
  {
    date: 'Sep',
    Revenue: 972,
  },
  {
    date: 'Oct',
    Revenue: 972,
  },
  {
    date: 'Nov',
    Revenue: 975,
  },
  {
    date: 'Dec',
    Revenue: 976,
  },
];


export const currentRevenue = revenueSeries[revenueSeries.length - 1].Revenue;
export const absoluteGrowth = currentRevenue - revenueSeries[0].Revenue;
export const monthlyGrowth = currentRevenue - revenueSeries[revenueSeries.length - 2].Revenue;
export const relativeGrowth = parseFloat(((absoluteGrowth / revenueSeries[0].Revenue) * 100).toFixed(1));

interface Tracker {
  color: string;
  tooltip: string;
}
export const trackerData: Tracker[] = [
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Downtime' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Downtime' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
  { color: 'emerald', tooltip: 'Operational' },
];

export const trackerDataInverse: Tracker[] = [
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'red', tooltip: 'Downtime' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'red', tooltip: 'Downtime' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
  { color: 'gray', tooltip: 'Operational' },
];
export const trackerDataAvailability = 95;