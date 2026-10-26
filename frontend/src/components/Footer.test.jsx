import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders both company logos', () => {
    render(<Footer />);
    expect(screen.getByAltText('Supraj')).toBeInTheDocument();
    expect(screen.getByAltText('Nirvee')).toBeInTheDocument();
  });

  it('renders working tel/mailto links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: '+91 9422323814' })).toHaveAttribute('href', 'tel:9422323814');
    expect(screen.getByRole('link', { name: 'suprajtraders@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:suprajtraders@gmail.com'
    );
  });

  it('renders the operational territory notice', () => {
    render(<Footer />);
    expect(screen.getByText(/pune & maharashtra industrial clusters/i)).toBeInTheDocument();
    expect(screen.getByText(/excluding mumbai/i)).toBeInTheDocument();
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
