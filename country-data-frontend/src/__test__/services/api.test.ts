import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';
import { fetchCountries, searchCountries, fetchCountriesByRegion, fetchCountryByCode } from '../../services/api';

interface MockedAxios {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

vi.mock('axios');
const mockedAxios = axios as  unknown as MockedAxios;

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockCountriesData = [
    { name: { common: 'Germany' }, cca2: 'DE', flags: { svg: 'germany.svg' }, region: 'Europe', capital: ['Berlin'], timezones: ['UTC+01:00'], population: 83000000 },
    { name: { common: 'France' }, cca2: 'FR', flags: { svg: 'france.svg' }, region: 'Europe', capital: ['Paris'], timezones: ['UTC+01:00'], population: 67000000 }
  ];

  describe('fetchCountries', () => {
    it('should fetch countries with default pagination', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockCountriesData });

      const countries = await fetchCountries();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/countries?page=1&limit=20');
      expect(countries).toEqual(mockCountriesData);
    });

    it('should fetch countries with custom pagination', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockCountriesData });

      const countries = await fetchCountries(2, 30);

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/countries?page=2&limit=30');
      expect(countries).toEqual(mockCountriesData);
    });

    it('should handle errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchCountries()).rejects.toThrow('Network error');
    });
  });

  describe('fetchCountryByCode', () => {
    it('should fetch a country by its code', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockCountriesData[0] });

      const country = await fetchCountryByCode('DE');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/countries/DE');
      expect(country).toEqual(mockCountriesData[0]);
    });

    it('should handle errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Country not found'));

      await expect(fetchCountryByCode('XX')).rejects.toThrow('Country not found');
    });
  });

  describe('fetchCountriesByRegion', () => {
    it('should fetch countries by region', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockCountriesData });

      const countries = await fetchCountriesByRegion('Europe');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/countries/region/Europe');
      expect(countries).toEqual(mockCountriesData);
    });

    it('should handle errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Region not found'));

      await expect(fetchCountriesByRegion('Unknown')).rejects.toThrow('Region not found');
    });
  });

  describe('searchCountries', () => {
    it('should search countries by name', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockCountriesData[0]] });

      const countries = await searchCountries({ name: 'Germany' });

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/countries/search?name=Germany');
      expect(countries).toEqual([mockCountriesData[0]]);
    });

    it('should search countries by multiple criteria', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockCountriesData[0]] });

      const countries = await searchCountries({ 
        name: 'Germany', 
        capital: 'Berlin',
        region: 'Europe',
        timezone: 'UTC+01:00'
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/countries/search?name=Germany&capital=Berlin&region=Europe&timezone=UTC%2B01%3A00'
      );
      expect(countries).toEqual([mockCountriesData[0]]);
    });
  });
});