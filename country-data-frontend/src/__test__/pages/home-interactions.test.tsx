import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "../../pages/index";
import { useCountries } from "../../hooks/useCountries";
import { Country } from "@/src/types";

vi.mock("../../hooks/useCountries", () => ({
  useCountries: vi.fn(),
}));

vi.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Home Page Interactions", () => {
  it("handles search and filter interactions", async () => {
    const mockHandleSearch = vi.fn();
    const mockHandleRegionFilter = vi.fn();

    (
      useCountries as ReturnType<typeof vi.fn<typeof useCountries>>
    ).mockReturnValue({
      countries: [
        {
          name: "Germany",
          code: "DE",
          flag: "https://example.com/flag.png",
          region: "Europe",
        },
        {
          name: "France",
          code: "FR",
          flag: "https://example.com/flag.png",
          region: "Europe",
        },
      ] as Country[],
      loading: false,
      error: null,
      hasMore: true,
      loadMore: vi.fn(),
      handleSearch: mockHandleSearch,
      handleRegionFilter: mockHandleRegionFilter,
      selectedRegion: "",
    });

    render(<Home />);

    // Test search interaction with the name field
    const nameInput = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(nameInput, { target: { value: "Germany" } });

    // Find and click the search button (form submit)
    const searchButton = screen.getByTestId("submit-search-button");
    fireEvent.submit(searchButton);

    // Check expectation
    await waitFor(() => {
      expect(mockHandleSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Germany",
        })
      );
    });

    // Test region filter
    const regionSelect = screen.getByLabelText(/filter by region/i);
    fireEvent.change(regionSelect, { target: { value: "Europe" } });

    expect(mockHandleRegionFilter).toHaveBeenCalledWith("Europe");
  });
});
