import React, { useState, ChangeEvent, FormEvent } from 'react';
import Button from './Button';

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const activeParams = Object.fromEntries(
      Object.entries(searchParams).filter(([ value]) => value.trim() !== '')
    );
    
    if (Object.keys(activeParams).length > 0) {
      setHasSearched(true);
      onSearch(activeParams);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
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
  
  const showNoResultsMessage = hasSearched && !isSearching && resultsCount === 0;
  const getSearchTermDescription = () => {
    const terms = [];
    if (searchParams.name) terms.push(`name "${searchParams.name}"`);
    if (searchParams.capital) terms.push(`capital "${searchParams.capital}"`);
    if (searchParams.timezone) terms.push(`timezone "${searchParams.timezone}"`);
    
    return terms.join(', ');
  };
  
  return (
    <div className="p-2 rounded-lg">
      {/* Mobile toggle button */}
      <div className="md:hidden mb-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-md"
        >
          <span className="font-medium">Advanced Search</span>
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Show active filters summary on mobile when collapsed */}
        {!isExpanded && Object.values(searchParams).some(v => v !== '') && (
          <div className="mt-2 text-sm text-gray-600">
            <p>Filters: {getSearchTermDescription()}</p>
          </div>
        )}
      </div>
      
      {/* Form that's always visible on desktop but toggleable on mobile */}
      <div className={`${!isExpanded ? 'hidden md:block' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
                placeholder="Search by name"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
           
            <Button title="Clear" onClick={handleClear}/>
           
            <Button title="Search"   type="submit"
              dataTestId="submit-search-button"/>
          </div>
        </form>
      </div>
      
      {/* No results message */}
      {showNoResultsMessage && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
          <p className="text-yellow-700">
            No countries found matching {getSearchTermDescription()}.
          </p>
        </div>
      )}
      
      {/* Loading indicator */}
      {isSearching && (
        <div className="flex justify-center items-center p-3 mt-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          <p className="text-sm">Searching...</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;