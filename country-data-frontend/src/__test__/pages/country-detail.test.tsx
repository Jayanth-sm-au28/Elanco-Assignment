import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CountryDetails from '../../components/CountryDetails';
import { fetchCountryByCode } from '../../services/api';

// Mock the API service
vi.mock('@/src/services/api', () => ({
  fetchCountryByCode: vi.fn()
}));

// Mock router already handled in setup file

describe('CountryDetail Component', () => {
  const mockCountry = {
    name: 'Germany',
    code: 'DE',
    flag: 'https://example.com/flag.png',
    population: 83000000,
    region: 'Europe',
    capital: 'Berlin',
    timezone: ['UTC+01:00'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ name: 'German', nativeName: 'Deutsch' }],
    borders: ['FR', 'PL', 'CZ', 'AT', 'CH']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    (fetchCountryByCode as  ReturnType<typeof vi.fn<typeof fetchCountryByCode>>).mockReturnValue(new Promise(() => {}));
    
    render(<CountryDetails />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders country details after successful data fetch', async () => {
    const mockFetchCountry = fetchCountryByCode as ReturnType<typeof vi.fn<typeof fetchCountryByCode>>;
    mockFetchCountry.mockClear();
    
    // Use mockImplementation instead of mockResolvedValue to have more control
    mockFetchCountry.mockImplementation(() => {
      return Promise.resolve(mockCountry);
    });
    
    // Render the component
    const { rerender } = render(<CountryDetails />);
    
    // Verify the mock was called (this ensures our test setup is correct)
    expect(mockFetchCountry).toHaveBeenCalled();
    
    // Force a rerender to help with state updates
    rerender(<CountryDetails />);
    
    // Look for specific elements one by one with higher timeouts
    // Start with checking for the population which is a unique value
    await waitFor(() => {
      expect(screen.getByText('83,000,000')).toBeInTheDocument();
    }, { timeout: 10000 });
    
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    (fetchCountryByCode as ReturnType<typeof vi.fn<typeof fetchCountryByCode>>).mockRejectedValue(new Error('Failed to fetch country'));
    
    render(<CountryDetails />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load country details/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Back to Countries/i)).toBeInTheDocument();
  });

 it('handles missing country data gracefully', async () => {
  const incompleteCountry = {
    name: 'Test Country',
    code: 'TC',
    flag: '',
    population: 0,
    region: '',
    capital: '',
    timezone: []
 
  };
  
  (fetchCountryByCode as ReturnType<typeof vi.fn<typeof fetchCountryByCode>>).mockResolvedValue(incompleteCountry);
  
  render(<CountryDetails />);
  
  await waitFor(() => {
    expect(screen.getByText('Test Country')).toBeInTheDocument();
  });
  
  const naElements = screen.getAllByText('N/A');
  expect(naElements.length).toBeGreaterThan(0);
});
});