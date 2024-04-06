
export type DemographySeries = {
    geo: string;
    full_name: string;
    year: number;
    value: number;
}

export type DemographySeriesAge = {
    geo: string;
    full_name: string;
    year: number;
    value: number;
    age_from: number;
    age_to: number;
}