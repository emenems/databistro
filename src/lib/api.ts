'use server';

export async function getDemographySeries(
  country: string = "all",
  year: string | number = "all",
  region: string = "all"
) {
  const url = `http://localhost:8000/api/demography/series/sum?country=${country}&year=${year}&region=${region}`
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
    const url = `http://localhost:8000/api/demography/countries?year=${year}&region=${region}`
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
    const url = `http://localhost:8000/api/demography/series/age${age==='median'? '/median' : ''}?country=${country}&year=${year}&region=${region}${age !== 'median'? '&age='+age: ''}`
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