import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchCountries, searchCountries, fetchCountriesByRegion } from '../../services/api';

interface MockedAxios {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as MockedAxios;

// Define types for axios errors
interface AxiosError extends Error {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
}

describe('API Service Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  it('handles network errors in fetchCountries', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(networkError);

    await expect(fetchCountries()).rejects.toThrow('Network Error');
    expect(console.error).toHaveBeenCalled();
  });

  it('handles server errors in fetchCountriesByRegion', async () => {
    const serverError = new Error('Internal Server Error') as AxiosError;
    serverError.response = { status: 500, data: { message: 'Server Error' } };
    mockedAxios.get.mockRejectedValueOnce(serverError);

    await expect(fetchCountriesByRegion('Europe')).rejects.toThrow();
  });

  it('handles 404 errors in searchCountries', async () => {
    const notFoundError = new Error('Not Found') as AxiosError;
    notFoundError.response = { status: 404, data: { message: 'Not Found' } };
    mockedAxios.get.mockRejectedValueOnce(notFoundError);

    await expect(searchCountries({ name: 'Nonexistent' })).rejects.toThrow();
  });
});