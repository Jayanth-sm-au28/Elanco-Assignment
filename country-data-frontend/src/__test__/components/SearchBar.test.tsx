import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  
  beforeEach(() => {
    mockOnSearch.mockClear();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('renders the search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    expect(searchInput).toBeInTheDocument();
  });
  
  it('updates the search term on input change', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: 'Germany' } });
    
    expect(searchInput).toHaveValue('Germany');
  });
  
  it('calls onSearch with debounce when the search term changes', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: 'Germany' } });
    
    // Should not be called immediately due to debounce
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    // Fast-forward timer to trigger the debounced function
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith('Germany');
  });
  
  it('clears the search term when the clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: 'Germany' } });
    
    // Clear button should appear
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
    
    // Fast-forward timer to trigger the debounced function
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});