import React from "react";
import Head from "next/head";
import { useCountries } from "../hooks/useCountries";

import SearchBar from "../components/SearchBar";
import CountryList from "../components/CountryList";
import RegionFilter from "../components/RegionFilter";

const Home: React.FC = () => {
  const {
    countries,
    loading,
    error,
    hasMore,
    loadMore,
    handleSearch,
    handleRegionFilter,
    selectedRegion,
  } = useCountries();

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-orange-100 to-red-100">
      <Head>
        <title >Country Data Dashboard</title>
        <meta
          name="description"
          content="Explore countries and their information"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Fixed search and filter bar */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-100 via-orange-100 to-red-100  z-10 py-4">
        <div className="container mx-auto px-4">
          <h1 className="xs:text-xl md:text-4xl font-bold mb-4 text-center text-rose-500">Country Data Dashboard</h1>
          <div className="sm:flex sm:items-center sm:justify-center">
            <SearchBar onSearch={handleSearch} />
            <RegionFilter
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionFilter}
            />
          </div>
        </div>
      </div>

      <main>
        <div className="container mx-auto px-4 py-8 pt-14  ">
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <CountryList
            countries={countries}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;