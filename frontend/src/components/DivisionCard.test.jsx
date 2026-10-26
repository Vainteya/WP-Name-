import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DivisionCard from './DivisionCard';

const baseProps = {
  to: '/products?company=Supraj',
  logoSrc: '/images/SuprajLogoTransparent.png',
  logoAlt: 'Supraj',
  brandLabel: 'Paramount',
  title: 'Supraj Catalog',
  description: 'Relays and panel accessories.',
};

function renderCard(props = baseProps) {
  return render(
    <MemoryRouter>
      <DivisionCard {...props} />
    </MemoryRouter>
  );
}

describe('DivisionCard', () => {
  it('links to the division route it was given', () => {
    renderCard();
    expect(screen.getByRole('link', { name: /supraj catalog/i })).toHaveAttribute(
      'href',
      '/products?company=Supraj'
    );
  });

  it('renders the title, brand label, and description', () => {
    renderCard();
    expect(screen.getByText('Supraj Catalog')).toBeInTheDocument();
    expect(screen.getByText('Paramount')).toBeInTheDocument();
    expect(screen.getByText(/relays and panel accessories/i)).toBeInTheDocument();
  });

  it('falls back gracefully when the division logo fails to load', () => {
    renderCard();
    const logo = screen.getByRole('img', { name: 'Supraj' });
    fireEvent.error(logo);
    expect(screen.getByRole('img', { name: 'Supraj' }).tagName).toBe('DIV');
  });
});
