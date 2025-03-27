import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CountryCard from "../../components/CountryCard";
import Image from "next/image";
import type { ImageProps } from "next/image";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    const { src, alt, ...rest } = props;
    const domProps = Object.entries(rest).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key.toLowerCase()]: value,
      };
    }, {});

    return (
      <Image
        src={typeof src === "string" ? src : "/placeholder.jpg"}
        alt={alt || ""}
        {...domProps}
        data-testid="image"
      />
    );
  },
}));

describe("CountryCard", () => {
  it("renders with all data present", () => {
    const country = {
      name: "Germany",
      code: "DE",
      flag: "https://example.com/flag.png",
      population: 83000000,
      region: "Europe",
      capital: "Berlin",
      timezone: ["UTC+01:00"],
    };

    render(<CountryCard country={country} />);

    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
  });

  it("renders with flag missing", () => {
    const country = {
      name: "Germany",
      code: "DE",
      flag: "", // Empty flag URL
      population: 83000000,
      region: "Europe",
      capital: "Berlin",
      timezone: ["UTC+01:00"],
    };

    render(<CountryCard country={country} />);

    expect(screen.getByText("Flag unavailable")).toBeInTheDocument();
  });

  it("renders with capital missing", () => {
    const country = {
      name: "Antarctica",
      code: "AQ",
      flag: "https://example.com/flag.png",
      population: 1000,
      region: "Antarctica",
      capital: "", 
      timezone: ["UTC+00:00"],
    };

    render(<CountryCard country={country} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("renders with timezone missing", () => {
    const country = {
      name: "TestCountry",
      code: "TC",
      flag: "https://example.com/flag.png",
      population: 1000,
      region: "TestRegion",
      capital: "TestCapital",
      timezone: [], 
    };

    render(<CountryCard country={country} />);

    expect(screen.queryByText(/Local Time:/i)).not.toBeInTheDocument();
  });

  it("handles invalid timezone format gracefully", () => {
    const country = {
      name: "Weird Country",
      code: "WC",
      flag: "https://example.com/flag.png",
      population: 1000,
      region: "WeirdRegion",
      capital: "WeirdCapital",
      timezone: ["InvalidTimezone"], // Invalid timezone format
    };

    render(<CountryCard country={country} />);

    // Should display local time but with a fallback message
    expect(screen.getByText(/Local Time:/i)).toBeInTheDocument();
    // Update this line to match the actual text in your component
    expect(screen.getByText(/Unknown time/i)).toBeInTheDocument();
  });
});
