import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RegionFilter from '../../components/RegionFilter';

describe('RegionFilter', () => {
  const mockOnRegionChange = vi.fn(); 
  
  beforeEach(() => {
    mockOnRegionChange.mockClear();
  });
  
  it('renders the component with all regions', () => {
    render(<RegionFilter selectedRegion="" onRegionChange={mockOnRegionChange} />);
    
    // Check if the select element exists
    const selectElement = screen.getByLabelText(/filter by region/i);
    expect(selectElement).toBeInTheDocument();
    
    // Check if it has the default option
    expect(screen.getByText('All Regions')).toBeInTheDocument();
    
    // Check if it has all the region options
    expect(screen.getByText('Africa')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Oceania')).toBeInTheDocument();
  });
  
  it('selects the current region', () => {
    render(<RegionFilter selectedRegion="Europe" onRegionChange={mockOnRegionChange} />);
    
    const selectElement = screen.getByLabelText(/filter by region/i) as HTMLSelectElement;
    expect(selectElement.value).toBe('Europe');
  });
  
  it('calls onRegionChange when a new region is selected', () => {
    render(<RegionFilter selectedRegion="" onRegionChange={mockOnRegionChange} />);
    
    const selectElement = screen.getByLabelText(/filter by region/i);
    fireEvent.change(selectElement, { target: { value: 'Asia' } });
    
    expect(mockOnRegionChange).toHaveBeenCalledWith('Asia');
  });
});