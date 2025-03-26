import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from '../../components/Layout';

// Mock Next.js Head component
vi.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }:{children:React.ReactNode}) => <>{children}</>
}));

// Mock Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>
}));

describe('Layout', () => {
  it('renders the layout with children', () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>
    );
    
    // Check if the layout renders the children
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Check if the layout renders the header and footer
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });
  
  it('renders the correct title', () => {
    render(
      <Layout title="Custom Title">
        <div>Content</div>
      </Layout>
    );
    
    // Check if the title is correct
    const titleElement = document.querySelector('title');
    expect(titleElement?.textContent).toBe('Custom Title');
  });
  
  it('renders the default title when not provided', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Check if the default title is used
    const titleElement = document.querySelector('title');
    expect(titleElement?.textContent).toBe('Country Data Dashboard');
  });
});