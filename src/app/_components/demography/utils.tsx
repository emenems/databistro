import { 
    DemographySeries,
    DemographySeriesAge
} from '@/interfaces/demography';

export const demographySeriesDemo: DemographySeries[] = [
    { geo: 'SK', full_name: 'Slovakia', year: 2023, value: 5428792 },
    { geo: 'SK', full_name: 'Slovakia', year: 2023, value: 5427792 }
]
export const demographySeriesAgeDemo: DemographySeriesAge[] = [
    { geo: 'SK', full_name: 'Slovakia', year: 2023, value: 5428792, age_from: 0, age_to: 100 }
]

export function valueFormatterMil(value: number = 0) {
    return `${(value / 1000000).toFixed(2)} mil`;
}
export function valueFormatterPercent(value: number = 0, isAbsolute: boolean = false) {
    const sign = value > 0 ? '+' : '';
    if (isAbsolute) {
        return `${sign}${value.toFixed(1)}`;
    } else {
        return `${sign}${value.toFixed(1)}%`;
    }
}
export function valueFormatterAge(value: number = 0) {
    return `${value.toFixed(0)} rokov`;
}
export function separateEU(data: DemographySeries[] = demographySeriesDemo, year: number = 2023) {
    const dataEU = data.filter((item) => (item.geo === 'EU' && item.year === year));
    const dataMinusEU = data.filter((item) => (item.geo !== 'EU' && item.year === year));
    return { dataEU, dataMinusEU };
}
export function separateCountry(data: DemographySeries[] = demographySeriesDemo, country: string = "SK", year: number = 2023 ) {
    const dataCountry = data.filter((item) => (item.geo === country && item.year === year));
    return dataCountry;
}
export function findCurrentYearValue(data: DemographySeries[] = demographySeriesDemo, country: string = "SK"): number {
    const dataFiltered = data.filter((item) => item.geo === country);
    const maxYear = Math.max(...dataFiltered.map((item) => item.year));
    // return the value for the most recent year. if empty, return 0
    return dataFiltered.find((item) => item.year === maxYear)?.value || 0;
}
export function getMaxYear(data: DemographySeries[] = demographySeriesDemo, country: string = "SK") {
    const dataFiltered = data.filter((item) => item.geo === country);
    return Math.max(...dataFiltered.map((item) => item.year));
}
export function calculateDiff(data: DemographySeries[] = demographySeriesDemo, country: string = "SK", years: number = 1): number {
    const year = getMaxYear(data, country)
    const dataCountry = separateCountry(data, country, year);
    const dataCountryprevious = separateCountry(data, country, year - years);
    let outout = 0;
    if (dataCountry && dataCountryprevious) {
        outout = dataCountry[0]?.value - dataCountryprevious[0]?.value;

    }
    return outout
}

export function getColor(value: number = 0): string {
    value *= 100; // convert to percentage
    if (value > 1) {
        return 'green';
    } else if (value >= 0.5 && value <= 1) {
        return 'lime';
    } else if (value >= 0 && value < 0.5) {
        return 'amber';
    } else {
        return 'red';
    }
}

export function fitAgeCategory(dataAge: DemographySeriesAge[] = demographySeriesAgeDemo, country: string = "SK") {
    const ageRanges = ["0-14", "15-19", "20-39", "40-59", "60-64", "65-79"];
    const ageValues = ageRanges.map(age => parseFloat(filterCountry(dataAge, country, age).toFixed(0)))
    // add the last as the sum of all minus 100 to fix exact 100% in the chart
    if (ageValues.length > 0) {
        ageValues.push(100 - ageValues.reduce((acc, curr) => acc + curr, 0));
    }
    const ageValuesRound = ageValues.map((v) => Math.round(v));
    return ageValuesRound;
};

function filterCountry(data: DemographySeriesAge[] = demographySeriesAgeDemo, country: string = "SK", ageRange: string = "median") {
    const [ageFrom, ageTo] = ageRange.split('-').map(Number);
    const ageData = data.filter((d) => d.age_from === ageFrom && d.age_to === ageTo);
    const dataCountry = ageData.filter((d) => d.geo === country);

    // Conditional reduce with default
    return dataCountry.length > 0 ?
           dataCountry.reduce((acc, curr) => acc.year > curr.year ? acc : curr)?.value :
           0; 
}

export function filterCountryMedian(data: DemographySeries[] = demographySeriesDemo, country: string = "SK") {
    const dataCountry = data.filter((d) => d.geo === country);

    // Conditional reduce with default
    return dataCountry.length > 0 ?
           dataCountry.reduce((acc, curr) => acc.year > curr.year ? acc : curr)?.value :
           0;
}
