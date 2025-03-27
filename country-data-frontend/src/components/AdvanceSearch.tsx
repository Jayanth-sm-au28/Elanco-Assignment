import React, { useState, ChangeEvent, FormEvent } from 'react';

interface SearchParams {
  name: string;
  capital: string;
  timezone: string;
}

interface AdvancedSearchProps {
  onSearch: (params: Partial<SearchParams>) => void;
  resultsCount: number;
  isSearching: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  onSearch, 
  resultsCount, 
  isSearching 
}) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    name: '',
    capital: '',
    timezone: ''
  });
  
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Filter out empty fields
    const activeParams = Object.fromEntries(
      Object.entries(searchParams).filter(([ value]) => value.trim() !== '')
    );
    
    if (Object.keys(activeParams).length > 0) {
      setHasSearched(true);
      onSearch(activeParams);
    }
  };
  
  const handleClear = () => {
    setSearchParams({
      name: '',
      capital: '',
      timezone: ''
    });
    setHasSearched(false);
    onSearch({});
  };
  
  // Determine what message to show based on search state
  const showNoResultsMessage = hasSearched && !isSearching && resultsCount === 0;
  const getSearchTermDescription = () => {
    const terms = [];
    if (searchParams.name) terms.push(`name "${searchParams.name}"`);
    if (searchParams.capital) terms.push(`capital "${searchParams.capital}"`);
    if (searchParams.timezone) terms.push(`timezone "${searchParams.timezone}"`);
    
    return terms.join(', ');
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Country Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={searchParams.name}
              onChange={handleChange}
              placeholder="Search by country name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-1">
              Capital City
            </label>
            <input
              id="capital"
              name="capital"
              type="text"
              value={searchParams.capital}
              onChange={handleChange}
              placeholder="Search by capital"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <input
              id="timezone"
              name="timezone"
              type="text"
              value={searchParams.timezone}
              onChange={handleChange}
              placeholder="e.g. UTC+05:30"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* No results message */}
      {showNoResultsMessage && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            No countries found matching {getSearchTermDescription()}.
          </p>
        </div>
      )}
      
      {/* Loading indicator */}
      {isSearching && (
        <div className="flex justify-center items-center p-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          <p>Searching countries...</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;