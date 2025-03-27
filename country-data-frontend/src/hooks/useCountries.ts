import { useState, useEffect, useCallback, useRef } from 'react';
import { Country } from '@/src/types';
import { fetchCountries, searchCountries, fetchCountriesByRegion } from '@/src/services/api';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<object>({});
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  
  // Use refs to track previous values and prevent unnecessary API calls
  const prevSearchParams = useRef<object>({});
  const prevRegion = useRef<string>('');
  const isFirstRender = useRef<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);

  const loadCountries = useCallback(async (resetList: boolean = false) => {
    // Prevent concurrent API calls
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    
    try {
      setLoading(true);
      
      let newCountries: Country[] = [];
      
      // Determine which API to call based on active filters
      const hasSearchFilters = Object.keys(searchParams).length > 0;
      
      if (hasSearchFilters) {
        newCountries = await searchCountries(searchParams);
        setHasMore(false);
      } else if (selectedRegion) {
        newCountries = await fetchCountriesByRegion(selectedRegion);
        setHasMore(false);
      } else {
        newCountries = await fetchCountries(resetList ? 1 : page);
        setHasMore(newCountries.length > 0);
      }
      
      if (resetList) {
        setCountries(newCountries);
      } else {
        const existingCodes = new Set(countries.map(c => c.code));
        const uniqueNewCountries = newCountries.filter(c => !existingCodes.has(c.code));
        setCountries(prev => [...prev, ...uniqueNewCountries]);
      }
      
      if (!resetList && !hasSearchFilters && !selectedRegion) {
        setPage(prevPage => prevPage + 1);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error loading countries:", err);
      setError('Failed to load countries. Please try again.');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [searchParams, selectedRegion, page, countries]);

  // Initial load on mount only
  useEffect(() => {
    loadCountries(true);
    isFirstRender.current = false;
    // Store initial values
    prevSearchParams.current = searchParams;
    prevRegion.current = selectedRegion;
  }, []);

  // Handle changes to search params or region
  useEffect(() => {
    // Skip on first render since we already load data in the mount effect
    if (isFirstRender.current) return;
    
    // Compare if search parameters have actually changed
    const searchParamsChanged = JSON.stringify(prevSearchParams.current) !== JSON.stringify(searchParams);
    const regionChanged = prevRegion.current !== selectedRegion;
    
    if (searchParamsChanged || regionChanged) {
      // Update our refs to new values
      prevSearchParams.current = searchParams;
      prevRegion.current = selectedRegion;
      
      // Reset pagination and load data
      setPage(1);
      loadCountries(true);
    }
  }, [searchParams, selectedRegion, loadCountries]);

  const handleSearch = useCallback((params: object) => {
    setSearchParams(params);
  }, []);

  const handleRegionFilter = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  const loadMore = useCallback(() => {
    // Only load more if we're not already loading and don't have search/filter active
    if (!loading && !Object.keys(searchParams).length && !selectedRegion) {
      loadCountries(false);
    }
  }, [loadCountries, loading, searchParams, selectedRegion]);

  return {
    countries,
    loading,
    error,
    hasMore: hasMore && !Object.keys(searchParams).length && !selectedRegion,
    loadMore,
    handleSearch,
    handleRegionFilter,
    selectedRegion
  };
};