export const currencyFormatter = (number: number, decimal: number = 0) => {
  return (
    Intl.NumberFormat('sk-SK', { 
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    }).format(number)
  );
};

export const currencyMillionFormatter = (number: number) => {
  // Format as currency, but for millions
  const formatted = Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(number / 1_000_000);
  // Add 'mil.' after the euro symbol
  return formatted.replace('€', 'mil. €');
};

export const percentageFormatter = (number: number) => {
  return (
    Intl.NumberFormat('sk-SK', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(number)
  );
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}