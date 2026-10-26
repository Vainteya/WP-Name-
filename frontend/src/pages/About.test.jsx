import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About page', () => {
  it('renders the hero headline', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { level: 1, name: /four decades of trust in\s*industrial automation\./i })
    ).toBeInTheDocument();
  });

  it('renders every client in the trust portfolio', () => {
    render(<About />);
    [
      'Bharat Forge Ltd.',
      'Tata Motors Ltd.',
      'Forbes Marshall',
      'Wipro Pari',
      'Alfa Laval Pvt. Ltd.',
      'Cotmac Pvt. Ltd.',
      'DitapV Pvt. Ltd.',
      'Oneness Control Panels Pvt. Ltd.',
    ].forEach((client) => {
      expect(screen.getByText(client)).toBeInTheDocument();
    });
  });

  it('renders both value proposition cards', () => {
    render(<About />);
    expect(screen.getByText('More than a component supplier')).toBeInTheDocument();
    expect(screen.getByText('Looking ahead')).toBeInTheDocument();
  });

  it('renders the registered office contact details with working tel/mailto links', () => {
    render(<About />);
    expect(screen.getByRole('link', { name: '+91 9422323814' })).toHaveAttribute('href', 'tel:9422323814');
    expect(screen.getByRole('link', { name: 'suprajtraders@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:suprajtraders@gmail.com'
    );
  });

  it('collapses the client-trust and values grids to a single column below their breakpoint', () => {
    const { container } = render(<About />);
    const responsiveGrids = Array.from(container.querySelectorAll('div.grid')).filter((el) =>
      el.className.includes('md:grid-cols')
    );
    expect(responsiveGrids.length).toBeGreaterThanOrEqual(2);
    responsiveGrids.forEach((grid) => {
      expect(grid.className).toContain('grid-cols-1');
    });
  });
});
