import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CountryList from '@/src/components/CountryList';


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
    
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    const loadingIndicator = document.querySelector('.animate-spin');
    expect(loadingIndicator).toBeInTheDocument();
  });
});