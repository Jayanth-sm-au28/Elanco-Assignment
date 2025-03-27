import React from "react";

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

const RegionFilter: React.FC<RegionFilterProps> = ({
  selectedRegion,
  onRegionChange,
}) => {
  return (
    <div className="xs-w-full md:w-1/2 mt-2">
      <label
        htmlFor="region-filter"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Filter by Region
      </label>
      <select
        id="region-filter"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="w-full p-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionFilter;
