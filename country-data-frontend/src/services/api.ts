import axios from "axios";
import { Country } from "@/src/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const fetchCountries = async (
  page: number = 1,
  limit: number = 20
): Promise<Country[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/countries?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchCountryByCode = async (code: string): Promise<Country> => {
  try {
    const response = await axios.get(`${API_URL}/countries/${code}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country with code ${code}:`, error);
    throw error;
  }
};

export const searchCountries = async (searchParams: {
  name?: string;
  capital?: string;
  region?: string;
  timezone?: string;
}): Promise<Country[]> => {
  try {
    const queryParams = new URLSearchParams();

    if (searchParams.name) queryParams.append("name", searchParams.name);
    if (searchParams.capital)
      queryParams.append("capital", searchParams.capital);
    if (searchParams.region) queryParams.append("region", searchParams.region);
    if (searchParams.timezone)
      queryParams.append("timezone", searchParams.timezone);

    const response = await axios.get(
      `${API_URL}/countries/search?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching countries:", error);
    throw error;
  }
};

export const fetchCountriesByRegion = async (
  region: string
): Promise<Country[]> => {
  try {
    const response = await axios.get(`${API_URL}/countries/region/${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries in region ${region}:`, error);
    throw error;
  }
};
