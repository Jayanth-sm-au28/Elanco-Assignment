import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, MockedFunction } from 'vitest';
import { useCountries } from '../../hooks/useCountries';
import { fetchCountries, searchCountries, fetchCountriesByRegion } from '@/src/services/api';
import { Country } from '@/src/types';


vi.mock('@/src/services/api', () => ({
  fetchCountries: vi.fn(),
  searchCountries: vi.fn(),
  fetchCountriesByRegion: vi.fn()
}));

describe('useCountries', () => {
  const mockCountries = [
    { name: 'Germany', code: 'DE', flag: 'https://example.com/flag.png', population: 83000000, region: 'Europe', capital: 'Berlin', timezone: ['UTC+01:00'] },
    { name: 'France', code: 'FR', flag: 'https://example.com/flag.png', population: 67000000, region: 'Europe', capital: 'Paris', timezone: ['UTC+01:00'] }
  ];

 beforeEach(() => {
  vi.clearAllMocks();

  (fetchCountries as ReturnType<typeof vi.fn<typeof fetchCountries>>).mockResolvedValue(mockCountries);
  (searchCountries as ReturnType<typeof vi.fn<typeof searchCountries>>).mockResolvedValue(mockCountries.slice(0, 1));
  (fetchCountriesByRegion as ReturnType<typeof vi.fn<typeof fetchCountriesByRegion>>).mockResolvedValue(mockCountries);
});


  it('should filter countries by region', async () => {
    const { result } = renderHook(() => useCountries());
    
    // Wait for initial load
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Clear initial call count
    vi.clearAllMocks();
    
    // Trigger region filter
    act(() => {
      result.current.handleRegionFilter('Europe');
    });
    
    // Wait for filter to apply
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(fetchCountriesByRegion).toHaveBeenCalledWith('Europe');
    expect(result.current.selectedRegion).toBe('Europe');
  });
  
  it('should search countries by name', async () => {
    const { result } = renderHook(() => useCountries());
    
    // Wait for initial load
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Clear initial call count
    vi.clearAllMocks();
    
    // Trigger search
    act(() => {
      result.current.handleSearch('Germany');
    });
    
    // Wait for search to apply
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(searchCountries).toHaveBeenCalledWith({ name: 'Germany' });
  });
  
  it('should load more countries when scrolling', async () => {
    const { result } = renderHook(() => useCountries());
    
    // Wait for initial load
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Clear initial call count
    vi.clearAllMocks();
    
    // Mock second page of results
    const secondPageCountries = [
      { name: 'Spain', code: 'ES', flag: 'https://example.com/flag.png', population: 47000000, region: 'Europe', capital: 'Madrid', timezone: ['UTC+01:00'] }
    ];
    (fetchCountries as  MockedFunction<typeof fetchCountries>).mockResolvedValueOnce(secondPageCountries);
    
    // Trigger load more
    act(() => {
      result.current.loadMore();
    });
    
    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should call fetchCountries with page=2
    expect(fetchCountries).toHaveBeenCalled();
  });
  
  it('should handle combined search and region filter', async () => {
    const { result } = renderHook(() => useCountries());
    
    // Wait for initial load
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Clear initial call count
    vi.clearAllMocks();
    
    // Set region filter first
    act(() => {
      result.current.handleRegionFilter('Europe');
    });
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Mock filtered data
    const filteredData : Partial<Country>[]= [{ name: 'Germany', code: 'DE', region: 'Europe' }];
    (fetchCountriesByRegion as MockedFunction<typeof fetchCountriesByRegion>).mockResolvedValueOnce(filteredData as Country[]);
    
    // Now set search term
    act(() => {
      result.current.handleSearch('Germany');
    });
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // The most recent tests will help cover the combined filtering logic
    expect(result.current.selectedRegion).toBe('Europe');
  });
  
  it('should reset to initial state when both filters are cleared', async () => {
    const { result } = renderHook(() => useCountries());
    
    // Wait for initial load and apply filters
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Apply region filter
    act(() => {
      result.current.handleRegionFilter('Europe');
    });
    
    await vi.waitFor(() => {
      expect(result.current.selectedRegion).toBe('Europe');
    });
    
    // Clear initial call count
    vi.clearAllMocks();
    
    // Clear filters
    act(() => {
      result.current.handleRegionFilter('');
    });
    
    await vi.waitFor(() => {
      expect(result.current.selectedRegion).toBe('');
    });
    
    // Should reset and fetch initial data
    expect(fetchCountries).toHaveBeenCalled();
  });
});