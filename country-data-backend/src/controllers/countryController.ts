import { Request, Response } from "express";
import axios from "axios";

const REST_COUNTRIES_API = "https://restcountries.com/v3.1/all";
let countriesCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; 

const getCountriesWithCache = async () => {
  const now = Date.now();
  if (countriesCache && now - cacheTimestamp < CACHE_DURATION) {
    return countriesCache;
  }

  const response = await axios.get(REST_COUNTRIES_API);
  countriesCache = response.data;
  cacheTimestamp = now;
  return countriesCache;
};

export const getCountries = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;

    const countries = await getCountriesWithCache();
    
    // Sort countries alphabetically by name
    const sortedCountries = [...countries].sort((a, b) => 
      a.name.common.localeCompare(b.name.common)
    );
    
    const paginatedCountries = sortedCountries.slice(startIndex, startIndex + limit);

    const formattedCountries = paginatedCountries.map((country: any) => ({
      name: country.name.common,
      code: country.cca2,
      flag: country.flags.svg,
      region: country.region,
      capital: country.capital ? country.capital[0] : "",
      population: country.population,
      timezone: country.timezones || [],
    }));

    res.json(formattedCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
};

export const getCountryByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    
    const country = Array.isArray(response.data) ? response.data[0] : response.data;

    res.json({
      name: country.name.common,
      code: country.cca2,
      flag: country.flags.svg,
      population: country.population,
      languages: country.languages,
      region: country.region,
      capital: country.capital ? country.capital[0] : '',
      timezone: country.timezones || [],
      currencies: country.currencies,
      borders: country.borders || []
    });
  } catch (error) {
    console.error(`Error fetching country with code ${req.params.code}:`, error);
    res.status(500).json({ error: 'Failed to fetch country details' });
  }
};

export const filterCountriesByRegion = async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const countries = await getCountriesWithCache();

    const filteredCountries = countries.filter(
      (country: any) => country.region.toLowerCase() === region.toLowerCase()
    );
    const sortedCountries = [...filteredCountries].sort((a, b) => 
      a.name.common.localeCompare(b.name.common)
    );
    const formattedCountries = filteredCountries.map((country: any) => ({
      name: country.name.common,
      code: country.cca2,
      flag: country.flags.svg,
      region: country.region,
      capital: country.capital ? country.capital[0] : "",
      population: country.population,
      timezone: country.timezones || [],
    }));

    res.json(formattedCountries);
  } catch (error) {
    console.error(
      `Error filtering countries by region ${req.params.region}:`,
      error
    );
    res.status(500).json({ error: "Failed to filter countries by region" });
  }
};

export const searchCountries = async (req: Request, res: Response) => {
  try {
    const { name, capital, region, timezone } = req.query;
    const countries = await getCountriesWithCache();

    let filteredCountries = [...countries];

    if (name) {
      filteredCountries = filteredCountries.filter((country: any) =>
        country.name.common
          .toLowerCase()
          .includes((name as string).toLowerCase())
      );
    }

    if (capital && capital !== "") {
      filteredCountries = filteredCountries.filter(
        (country: any) =>
          country.capital &&
          country.capital.some((cap: string) =>
            cap.toLowerCase().includes((capital as string).toLowerCase())
          )
      );
    }

    if (region && region !== "") {
      filteredCountries = filteredCountries.filter(
        (country: any) =>
          country.region.toLowerCase() === (region as string).toLowerCase()
      );
    }

    if (timezone && timezone !== "") {
      filteredCountries = filteredCountries.filter((country: any) =>
        country.timezones.some((tz: string) =>
          tz.toLowerCase().includes((timezone as string).toLowerCase())
        )
      );
    }
    const sortedCountries = [...filteredCountries].sort((a, b) => 
      a.name.common.localeCompare(b.name.common)
    );
    const formattedCountries = filteredCountries.map((country: any) => ({
      name: country.name.common,
      code: country.cca2,
      flag: country.flags.svg,
      region: country.region,
      capital: country.capital ? country.capital[0] : "",
      population: country.population,
      timezone: country.timezones || [],
    }));

    res.json(formattedCountries);
  } catch (error) {
    console.error("Error searching countries:", error);
    res.status(500).json({ error: "Failed to search countries" });
  }
};
