import React, { useRef, useCallback } from "react";
import CountryCard from "./CountryCard";
import { Country } from "../types";

interface CountryListProps {
  countries: Country[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const CountryList: React.FC<CountryListProps> = ({
  countries,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCountryRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  return (
    <div className="container mx-auto px-4 py-8 xs:mt-14 md:mt-24">
      {countries.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            No countries found. Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {countries.map((country, index) => {
            if (countries.length === index + 1 && hasMore) {
              return (
                <div ref={lastCountryRef} key={country.code}>
                  <CountryCard country={country} />
                </div>
              );
            } else {
              return <CountryCard key={country.code} country={country} />;
            }
          })}
        </div>
      )}

      {loading && hasMore && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default CountryList;
