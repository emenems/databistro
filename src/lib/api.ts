'use server';

export async function getDemographySeries(
  country: string = "all",
  year: string | number = "all",
  region: string = "all"
) {
  const url = `${process.env.BACKEND_URL}/api/demography/series/sum?country=${country}&year=${year}&region=${region}`
  try {
    const response = await fetch(url,{
      method: 'GET',
      cache: 'force-cache'
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

export async function getCountries(
    year: string | number = "all",
    region: string = "all"
) {
    const url = `${process.env.BACKEND_URL}/api/demography/countries?year=${year}&region=${region}`
    try {
        const response = await fetch(url,{
            method: 'GET',
            cache: 'force-cache'
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

export async function getDemographyAgeSeries(
    country: string = "all",
    year: string | number = "all",
    region: string = "all",
    age: string = "all"
) {
    const url = `${process.env.BACKEND_URL}/api/demography/series/age${age==='median'? '/median' : ''}?country=${country}&year=${year}&region=${region}${age !== 'median'? '&age='+age: ''}`
    try {
        const response = await fetch(url,{
            method: 'GET',
            cache: 'force-cache'
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

export async function getStockReturnSeries(
    index: string = "^DJI",
    start: string | number = "2004-07-19",
    end: string | number = "2024-07-19",
) {
    const url = `${process.env.BACKEND_URL}/api/investing/index/returns?index=${index}&start_date=${start}&end_date=${end}`
    try {
        const response = await fetch(url,{
            method: 'GET',
            cache: 'force-cache'
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