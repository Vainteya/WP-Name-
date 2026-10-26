import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Commercial from './Commercial';

describe('Commercial page', () => {
  it('renders the hero headline', () => {
    render(<Commercial />);
    expect(
      screen.getByRole('heading', { level: 1, name: /ordering process & commercial terms/i })
    ).toBeInTheDocument();
  });

  it('renders both new-customer terms', () => {
    render(<Commercial />);
    expect(screen.getByText(/in-stock items:/i)).toBeInTheDocument();
    expect(screen.getByText(/out-of-stock items \(non-stock\):/i)).toBeInTheDocument();
    expect(screen.getByText(/2–3 weeks/i)).toBeInTheDocument();
  });

  it('renders all recurring-customer credit terms', () => {
    render(<Commercial />);
    expect(screen.getByText(/60-day credit terms/i)).toBeInTheDocument();
    expect(screen.getByText(/extended up to 90 days/i)).toBeInTheDocument();
  });

  it('renders the fulfillment territory notice', () => {
    render(<Commercial />);
    expect(screen.getByText(/notice regarding fulfillment territory/i)).toBeInTheDocument();
    expect(screen.getByText(/pune and maharashtra \(excluding mumbai\)/i)).toBeInTheDocument();
  });
});
