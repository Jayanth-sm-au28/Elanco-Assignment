import { useState, useEffect, useCallback, useRef } from "react";
import { Country } from "@/src/types";
import {
  fetchCountries,
  searchCountries,
  fetchCountriesByRegion,
} from "@/src/services/api";

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const isFilterActiveRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(false);
  const wasFilterActiveRef = useRef<boolean>(false);
  const previousSearchTermRef = useRef<string>("");
  const previousRegionRef = useRef<string>("");
  const isLoadingRef = useRef<boolean>(false);

  const loadCountries = useCallback(
    async (resetList: boolean = false) => {
      if (!mountedRef.current || isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);

      try {
        let newCountries: Country[] = [];
        isFilterActiveRef.current = !!(searchTerm || selectedRegion);

        const justRemovedFilter =
          wasFilterActiveRef.current && !isFilterActiveRef.current;
        wasFilterActiveRef.current = isFilterActiveRef.current;

        console.log("Loading countries:", {
          searchTerm,
          selectedRegion,
          resetList,
          justRemovedFilter,
        });

        if (searchTerm && selectedRegion) {
          const regionCountries = await fetchCountriesByRegion(selectedRegion);
          newCountries = regionCountries.filter(
            (country) =>
              country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (country.name &&
                country.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          setHasMore(false);
        } else if (selectedRegion) {
          newCountries = await fetchCountriesByRegion(selectedRegion);
          setHasMore(false);
        } else if (searchTerm) {
          newCountries = await searchCountries({ name: searchTerm });
          setHasMore(false);
        } else {
          if (justRemovedFilter) {
            const initialBatch = await fetchCountries(1, 50);
            newCountries = initialBatch;
            setHasMore(initialBatch.length >= 50);
          } else {
            newCountries = await fetchCountries(resetList ? 1 : page);
            setHasMore(newCountries.length > 0);
          }
        }

        previousSearchTermRef.current = searchTerm;
        previousRegionRef.current = selectedRegion;

        if (resetList || isFilterActiveRef.current || justRemovedFilter) {
          setCountries(newCountries);
        } else {
          const existingCodes = new Set(countries.map((c) => c.code));
          const uniqueNewCountries = newCountries.filter(
            (c) => !existingCodes.has(c.code)
          );
          setCountries((prev) => [...prev, ...uniqueNewCountries]);
        }

        if (!resetList && !isFilterActiveRef.current && !justRemovedFilter) {
          setPage((prevPage) => prevPage + 1);
        } else if (justRemovedFilter) {
          setPage(2);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading countries:", err);
        setError("Failed to load countries. Please try again.");
        if (resetList) {
          setCountries([]);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          isLoadingRef.current = false;
        }
      }
    },
    [page, searchTerm, selectedRegion, countries]
  );

  const handleRegionFilter = useCallback((region: string) => {
    console.log("Region filter changed:", region);

    const isClearing = previousRegionRef.current !== "" && region === "";

    setSelectedRegion(region);

    if (isClearing) {
      wasFilterActiveRef.current = true;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    loadCountries(true).catch((err) => {
      console.error("Initial load error:", err);
    });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (
      previousSearchTermRef.current === "" &&
      previousRegionRef.current === "" &&
      searchTerm === "" &&
      selectedRegion === ""
    ) {
      return;
    }

    if (
      searchTerm !== previousSearchTermRef.current ||
      selectedRegion !== previousRegionRef.current
    ) {
      console.log("Search/filter changed, reloading data");
      setPage(1);
      loadCountries(true).catch((err) => {
        console.error("Filter/search load error:", err);
      });
    }
  }, [searchTerm, selectedRegion, loadCountries]);

  const handleSearch = useCallback((term: string) => {
    console.log("Search term changed:", term);
    setSearchTerm(term);
  }, []);

  const loadMore = useCallback(() => {
    if (isFilterActiveRef.current || isLoadingRef.current) {
      return;
    }
    loadCountries(false).catch((err) => {
      console.error("Load more error:", err);
    });
  }, [loadCountries]);

  return {
    countries,
    loading,
    error,
    hasMore: hasMore && !isFilterActiveRef.current,
    loadMore,
    handleSearch,
    handleRegionFilter,
    selectedRegion,
  };
};
