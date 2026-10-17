'use server';

export async function getStockReturnSeries(
    index: string = "^DJI",
    start: string | number = "2004-07-19",
    end: string | number = "2024-07-19",
) {
    const url = `${process.env.BACKEND_URL}/api/investing/index/returns?index=${index}&start_date=${start}&end_date=${end}`
    const urlFetch = new URL(url);
    try {
        const response = await fetch(url,{
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}