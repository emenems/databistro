export function valueFormatter(value: number): string {
  return (value / 1_000).toLocaleString('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' mil. €';
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}