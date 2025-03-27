import React, { useState, useEffect, useCallback } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debounce = <T extends (...args: never[]) => void>(
    fn: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="w-full mb-6 sm:mb-0 sm:pr-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <input
          type="text"
          className="w-full p-4 pl-10 pr-20 text-sm bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search for a country by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2.5 bottom-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

// import React, { useState, useEffect, useCallback } from 'react';

// // Update the props interface to handle multiple search parameters
// interface SearchBarProps {
//   onSearch: (params: {
//     name?: string;
//     capital?: string;
//     timezone?: string;
//   }) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
//   // Use an object state instead of a string
//   const [searchParams, setSearchParams] = useState({
//     name: '',
//     capital: '',
//     timezone: ''
//   });
  
//   // Track which search type is active
//   const [activeType, setActiveType] = useState<'name' | 'capital' | 'timezone'>('name');

//   // Handle input change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
    
//     // Update only the active search type
//     setSearchParams(prev => ({
//       ...prev,
//       [activeType]: value
//     }));
//   };

//   // Debounce function
//   const debounce = <T extends (...args: never[]) => void>(
//     fn: T,
//     delay: number
//   ): ((...args: Parameters<T>) => void) => {
//     let timeoutId: NodeJS.Timeout;
//     return (...args: Parameters<T>) => {
//       if (timeoutId) clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         fn(...args);
//       }, delay);
//     };
//   };

//   // Create a debounced search function
//   const debouncedSearch = useCallback(
//     debounce((params: typeof searchParams) => {
//       // Filter out empty values
//       const filteredParams = Object.fromEntries(
//         Object.entries(params).filter(([_, value]) => value !== '')
//       );
//       onSearch(filteredParams);
//     }, 500),
//     [onSearch]
//   );

//   // Effect to trigger search when parameters change
//   useEffect(() => {
//     debouncedSearch(searchParams);
//   }, [searchParams, debouncedSearch]);

//   // Handle search type change
//   const handleTypeChange = (type: 'name' | 'capital' | 'timezone') => {
//     setActiveType(type);
//   };

//   // Clear search
//   const handleClear = () => {
//     setSearchParams({
//       name: '',
//       capital: '',
//       timezone: ''
//     });
//   };

//   return (
//     <div className="w-full mb-6 sm:mb-0 sm:pr-4">
//       <div className="flex flex-col space-y-2">
//         <div className="flex space-x-2">
//           <button
//             className={`px-3 py-1 text-sm rounded-t-md ${
//               activeType === 'name' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700'
//             }`}
//             onClick={() => handleTypeChange('name')}
//           >
//             Name
//           </button>
//           <button
//             className={`px-3 py-1 text-sm rounded-t-md ${
//               activeType === 'capital' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700'
//             }`}
//             onClick={() => handleTypeChange('capital')}
//           >
//             Capital
//           </button>
//           <button
//             className={`px-3 py-1 text-sm rounded-t-md ${
//               activeType === 'timezone' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700'
//             }`}
//             onClick={() => handleTypeChange('timezone')}
//           >
//             Timezone
//           </button>
//         </div>
        
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg className="w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//             </svg>
//           </div>
//           <input
//             type="text"
//             className="w-full p-4 pl-10 pr-20 text-sm bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             placeholder={`Search by ${activeType}...`}
//             value={searchParams[activeType]}
//             onChange={handleChange}
//           />
//           {searchParams[activeType] && (
//             <button
//               onClick={handleClear}
//               className="absolute right-2.5 bottom-2.5 text-gray-400 hover:text-gray-600"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//               </svg>
//             </button>
//           )}
//         </div>

//         <div className="text-xs text-gray-500">
//           Searching by: <span className="font-medium">{activeType}</span>
//           {Object.entries(searchParams).filter(([k, v]) => v && k !== activeType).length > 0 && (
//             <>
//               {' '}with additional filters: {
//                 Object.entries(searchParams)
//                   .filter(([k, v]) => v && k !== activeType)
//                   .map(([k, v]) => (
//                     <span key={k} className="inline-flex items-center px-2 py-0.5 mr-1 rounded bg-gray-100">
//                       {k}: {v}
//                       <button 
//                         className="ml-1 text-gray-500 hover:text-gray-700"
//                         onClick={() => {
//                           setSearchParams(prev => ({...prev, [k]: ''}));
//                         }}
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))
//               }
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchBar;