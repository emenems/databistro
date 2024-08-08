
export interface DataEntry {
    model: string;
    prompt: number;
    archery: number;
    equestrian: number;
    sailing: number;
    shooting: number;
    table_tennis: number;
    curling: number;
    modern_pentathlon: number;
    biathlon: number;
    golf: number;
    rowing: number;
    wrestling: number;
    [key: string]: string | number;
}

export const sports = [
    'archery',
    'equestrian',
    'sailing',
    'shooting',
    'table_tennis',
    'curling',
    'modern_pentathlon',
    'biathlon',
    'rowing',
    'golf',
    'wrestling',
];

export const sportsSlovak = [
    'lukostreľba',
    'jazdenie na koni',
    'jachting',
    'streľba',
    'stolný tenis',
    'curling',
    'moderný päťboj',
    'biatlon',
    'veslovanie',
    'golf',
    'zápasenie',
];

export const models = [
    'mixtral',
    'claude',
    'llama',
    'chatgpt4o',
    'pi',
    'gemini',
];


export function aggregateVotesBySport(data: DataEntry[], sports: string[]): Record<string, number> {
    const aggregated: Record<string, number> = {};

    for (const sport of sports) {
        aggregated[sport] = 0;
    }

    for (const entry of data) {
        for (const sport of sports) {
            aggregated[sport] += entry[sport as keyof DataEntry] as number;
        }
    }

    return aggregated;
}

export function formatForFunnel(aggregatedVotes: Record<string, number>): {name: string, value: number}[] {
    return Object.entries(aggregatedVotes).map(([name, value]) => ({ name, value }));
}