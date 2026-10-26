import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the hero headline and both calls to action', () => {
    renderHome();
    expect(
      screen.getByRole('heading', { level: 1, name: /precision automation\.\s*absolute control\./i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore catalog/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /our heritage/i })).toHaveAttribute('href', '/about');
  });

  it('renders the brand marquee with all four distributor/division names', () => {
    renderHome();
    ['Paramount', 'Finder', 'Supraj', 'Nirvee'].forEach((name) => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    });
  });

  it('links both division cards to their catalog query params', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /supraj catalog/i })).toHaveAttribute(
      'href',
      '/products?company=Supraj'
    );
    expect(screen.getByRole('link', { name: /nirvee catalog/i })).toHaveAttribute(
      'href',
      '/products?company=Nirvee'
    );
  });

  it('renders all three workflow steps', () => {
    renderHome();
    expect(screen.getByText('Locate')).toBeInTheDocument();
    expect(screen.getByText('Inquire')).toBeInTheDocument();
    expect(screen.getByText('Receive')).toBeInTheDocument();
  });

  // jsdom has no layout engine, so these two checks confirm the correct
  // Tailwind responsive classes are present rather than measuring
  // rendered pixel widths — a true viewport-resize check belongs in an
  // E2E tool (Playwright/Cypress), not a jsdom-based unit test.
  it('collapses the two-column hero to a single column below the lg breakpoint', () => {
    const { container } = renderHome();
    const heroGrid = container.querySelector('section > div.grid');
    expect(heroGrid.className).toContain('grid-cols-1');
    expect(heroGrid.className).toContain('lg:grid-cols-2');
  });

  it('collapses the division and workflow grids to a single column below md', () => {
    renderHome();
    const responsiveGrids = Array.from(document.querySelectorAll('div.grid')).filter((el) =>
      el.className.includes('md:grid-cols')
    );
    expect(responsiveGrids.length).toBeGreaterThanOrEqual(2);
    responsiveGrids.forEach((grid) => {
      expect(grid.className).toContain('grid-cols-1');
    });
  });
});
