// src/vitest.setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: IntersectionObserverCallback) {}
}

// Assign the mock to global
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock Next.js router
vi.mock("next/router", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "",
    query: { code: "DE" },
    asPath: "",
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string | object;
    alt?: string;
    layout?: string;
    objectFit?: string;
    blurDataURL?: string;
    [key: string]: any;
  }) => {
    // Remove the problematic props
    const { ...restProps } = props;
    return React.createElement("img", {
      ...restProps,
      alt: props.alt || "",
      src: typeof props.src === "string" ? props.src : "/placeholder.jpg",
    });
  },
}));

// Silence act() warnings
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    /Warning.*not wrapped in act/.test(args[0])
  ) {
    return;
  }
  originalError(...args);
};
