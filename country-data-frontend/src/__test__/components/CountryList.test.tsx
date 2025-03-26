import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CountryList from '@/src/components/CountryList';

// IntersectionObserver mock is in setup file

describe('CountryList', () => {
  const mockCountries = [
    { name: 'Germany', code: 'DE', flag: 'https://example.com/flag.png', population: 83000000, region: 'Europe', capital: 'Berlin', timezone: ['UTC+01:00'] },
    { name: 'France', code: 'FR', flag: 'https://example.com/flag.png', population: 67000000, region: 'Europe', capital: 'Paris', timezone: ['UTC+01:00'] }
  ];
  
  const mockLoadMore = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the country list with correct number of countries', () => {
    render(
      <CountryList
        countries={mockCountries}
        loading={false}
        hasMore={true}
        onLoadMore={mockLoadMore}
      />
    );
    
    // Should render 2 CountryCard components
    expect(screen.getAllByText(/region:/i)).toHaveLength(2);
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });
  
  it('shows a message when no countries are found', () => {
    render(
      <CountryList
        countries={[]}
        loading={false}
        hasMore={false}
        onLoadMore={mockLoadMore}
      />
    );
    
    expect(screen.getByText(/no countries found/i)).toBeInTheDocument();
  });
  
  it('shows a loading indicator when loading', () => {
    render(
      <CountryList
        countries={mockCountries}
        loading={true}
        hasMore={true}
        onLoadMore={mockLoadMore}
      />
    );
    
    // Should show both the countries and the loading indicator
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    // Check for loading indicator
    const loadingIndicator = document.querySelector('.animate-spin');
    expect(loadingIndicator).toBeInTheDocument();
  });
});