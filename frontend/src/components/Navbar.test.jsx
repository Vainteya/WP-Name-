import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  it('links the logo home', () => {
    const { container } = renderNavbar();
    const logoLink = container.querySelector('a[href="/"]');
    expect(logoLink).toBeInTheDocument();
    expect(within(logoLink).getByAltText('Supraj')).toBeInTheDocument();
    expect(within(logoLink).getByAltText('Nirvee')).toBeInTheDocument();
  });

  it('renders every nav link, in both the desktop and mobile menus, with the correct href', () => {
    renderNavbar();
    [
      ['About Us', '/about'],
      ['Product Catalog', '/products'],
      ['Commercial Terms', '/commercial'],
    ].forEach(([name, href]) => {
      const links = screen.getAllByRole('link', { name });
      expect(links.length).toBeGreaterThanOrEqual(2);
      links.forEach((link) => expect(link).toHaveAttribute('href', href));
    });
  });

  it('mobile menu starts closed and expands when the toggle button is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-nav')).toHaveClass('max-h-0');

    await user.click(toggle);

    const closeToggle = screen.getByRole('button', { name: /close menu/i });
    expect(closeToggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('mobile-nav')).toHaveClass('max-h-96');
  });

  it('closes the mobile menu after a link inside it is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    const mobileLinks = screen.getAllByRole('link', { name: 'About Us' });

    await user.click(mobileLinks[mobileLinks.length - 1]);

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
  });
});
