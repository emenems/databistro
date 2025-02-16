export interface DataItem {
  vykon: number;
  hmotnost: number;
  znacka: string;
  model: string;
  pracovisko: string;
  registracia: string;
}


export interface DataItemBarChart {
  name: string;
  value: number;
  znacka?: string;
}