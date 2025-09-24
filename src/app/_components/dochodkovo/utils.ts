export const valueFormatter = (value: number) => `${value.toFixed(1)} €/mesiac`;

export const valueFormatterTotal = (number: number) =>
  `${(number / 1).toFixed(1)} mil. €`;