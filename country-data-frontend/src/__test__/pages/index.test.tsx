import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../../pages/index';
import { useCountries } from '../../hooks/useCountries';

// interface SearchBarProps {
//   onSearch: (term: string) => void;
// }

// interface AdvancedSearchProps {
//   onSearch: (params: Partial<SearchParams>) => void;
//   resultsCount: number;
//   isSearching: boolean;
//   'data-testid'?: string; // Add this line
// }

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

interface CountryListProps {
  countries: Array<{ name: string; code: string }>;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

// Mock the useCountries hook
vi.mock('../../hooks/useCountries', () => ({
  useCountries: vi.fn()
}));

// Mock Next.js Head component
vi.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock the child components
// vi.mock('../../components/SearchBar', () => ({
//   __esModule: true,
//   default: ({ onSearch }: SearchBarProps) => (
//     <div className="p-2 rounded-lg xs:mb-0 md:mb-4" data-testid="mock-search-bar">
//       <button onClick={() => onSearch('test')}>Search</button>
//     </div>
//   )
// }));


vi.mock('../../components/AdvanceSearch', () => ({
  __esModule: true,
  default: ({ onSearch }) => (
    <div>
      <button onClick={() => onSearch({
       capital: "",
       name: "",
       timezone: ""
      })}>Search</button>
    </div>
  )
}));

vi.mock('../../components/RegionFilter', () => ({
  __esModule: true,
  default: ({ selectedRegion, onRegionChange }: RegionFilterProps) => (
    <div data-testid="mock-region-filter" data-selected={selectedRegion}>
      <button onClick={() => onRegionChange('Europe')}>Filter</button>
    </div>
  )
}));

vi.mock('../../components/CountryList', () => ({
  __esModule: true,
  default: ({ countries, loading, hasMore, onLoadMore }: CountryListProps) => (
    <div 
      data-testid="mock-country-list" 
      data-loading={String(loading)} 
      data-has-more={String(hasMore)}
    >
      {countries.map(country => (
        <div key={country.code} data-testid="country-item">{country.name}</div>
      ))}
      <button onClick={onLoadMore}>Load More</button>
    </div>
  )
}));

describe('Home Page', () => {
  it('renders the page with correct components', () => {
    const mockUseCountries = {
      countries: [
        { name: 'Germany', code: 'DE' },
        { name: 'France', code: 'FR' }
      ],
      loading: false,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      handleSearch: vi.fn(),
      handleRegionFilter: vi.fn(),
      selectedRegion: ''
    };
    
    (useCountries as ReturnType<typeof vi.fn>).mockReturnValue(mockUseCountries);
    
    render(<Home />);
    
    expect(screen.getAllByText('Country Data Dashboard')[0]).toBeInTheDocument();
    expect(screen.getByTestId('mock-search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-region-filter')).toBeInTheDocument();
    expect(screen.getByTestId('mock-country-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('country-item').length).toBe(2);
  });
  
  it('shows error message when there is an error', () => {
    const mockUseCountries = {
      countries: [],
      loading: false,
      error: 'Failed to load countries',
      hasMore: false,
      loadMore: vi.fn(),
      handleSearch: vi.fn(),
      handleRegionFilter: vi.fn(),
      selectedRegion: ''
    };
    
    (useCountries as ReturnType<typeof vi.fn>).mockReturnValue(mockUseCountries);
    
    render(<Home />);
    
    expect(screen.getByText('Failed to load countries')).toBeInTheDocument();
  });
  
  it('passes correct props to child components', () => {
    const mockHandleSearch = vi.fn();
    const mockHandleRegionFilter = vi.fn();
    const mockLoadMore = vi.fn();
    
    const mockUseCountries = {
      countries: [{ name: 'Germany', code: 'DE' }],
      loading: true,
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
      handleSearch: mockHandleSearch,
      handleRegionFilter: mockHandleRegionFilter,
      selectedRegion: 'Europe'
    };
    
    (useCountries as ReturnType<typeof vi.fn>).mockReturnValue(mockUseCountries);
    
    render(<Home />);
    
    const regionFilter = screen.getByTestId('mock-region-filter');
    expect(regionFilter).toHaveAttribute('data-selected', 'Europe');
    
    const countryList = screen.getByTestId('mock-country-list');
    expect(countryList).toHaveAttribute('data-loading', 'true');
    expect(countryList).toHaveAttribute('data-has-more', 'true');
    
    // Test interaction with child components
    screen.getByText('Search').click();
    expect(mockHandleSearch).toHaveBeenCalledWith({
      capital: "",
      name: "",
      timezone: "",
    });    
    screen.getByText('Filter').click();
    expect(mockHandleRegionFilter).toHaveBeenCalledWith('Europe');
    
    screen.getByText('Load More').click();
    expect(mockLoadMore).toHaveBeenCalled();
  });
});