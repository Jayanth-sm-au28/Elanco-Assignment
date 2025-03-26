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
    // Mock pending promise that doesn't resolve during the test
    (fetchCountryByCode as  ReturnType<typeof vi.fn<typeof fetchCountryByCode>>).mockReturnValue(new Promise(() => {}));
    
    render(<CountryDetails />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders country details after successful data fetch', async () => {
    (fetchCountryByCode as ReturnType<typeof vi.fn<typeof fetchCountryByCode>>).mockResolvedValue(mockCountry);
    
    render(<CountryDetails />);
    
    // Wait for the component to update with the data
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
    
    // Check for detailed information
    expect(screen.getByText('83,000,000')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    
    // Use getAllByText for texts that appear multiple times
    const euroElements = screen.getAllByText(/Euro/i);
    expect(euroElements.length).toBeGreaterThan(0);
    
    // Use a more specific selector for language
    const germanElements = screen.getAllByText(/German/i);
    expect(germanElements.length).toBeGreaterThan(0);
    
    // Check for border countries
    expect(screen.getByText('FR')).toBeInTheDocument();
    expect(screen.getByText('PL')).toBeInTheDocument();
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
  // Mock a country with missing optional data
  const incompleteCountry = {
    name: 'Test Country',
    code: 'TC',
    flag: '',
    population: 0,
    region: '',
    capital: '',
    timezone: []
    // Currencies, languages, and borders are missing
  };
  
  (fetchCountryByCode as ReturnType<typeof vi.fn<typeof fetchCountryByCode>>).mockResolvedValue(incompleteCountry);
  
  render(<CountryDetails />);
  
  await waitFor(() => {
    expect(screen.getByText('Test Country')).toBeInTheDocument();
  });
  
  // Check that the component handles missing data
  const naElements = screen.getAllByText('N/A');
  expect(naElements.length).toBeGreaterThan(0);
});
});