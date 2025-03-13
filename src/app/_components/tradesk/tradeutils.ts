export function valueFormatter(value: number, round: number = 0, suffix: string = ' mil. €'): string {
  return (value / 1_000).toLocaleString('sk-SK', { minimumFractionDigits: round, maximumFractionDigits: round }) + suffix;
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}