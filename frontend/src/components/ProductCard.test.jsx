import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

const baseProduct = {
  _id: '1',
  name: 'Industrial Relay Series',
  brand: 'Finder',
  category: 'Relays',
  imagePath: '/images/components/relay.png',
  pdfPath: null,
};

describe('ProductCard', () => {
  it('renders the product name, category, and brand badge', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('Industrial Relay Series')).toBeInTheDocument();
    expect(screen.getByText('Relays')).toBeInTheDocument();
    expect(screen.getByText('Finder')).toBeInTheDocument();
  });

  it('omits the datasheet link entirely when the product has no PDF', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.queryByText(/download datasheet/i)).not.toBeInTheDocument();
  });

  it('links to the backend-hosted PDF when the product has a datasheet', () => {
    const product = { ...baseProduct, pdfPath: 'uploads/pdfs/relay.pdf' };
    render(<ProductCard product={product} />);
    const link = screen.getByRole('link', { name: /download datasheet/i });
    expect(link).toHaveAttribute('href', `${import.meta.env.VITE_BACKEND_URL}/uploads/pdfs/relay.pdf`);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('falls back to a placeholder box instead of a broken-image icon when the photo 404s', () => {
    render(<ProductCard product={baseProduct} />);
    const img = screen.getByRole('img', { name: 'Industrial Relay Series' });
    fireEvent.error(img);
    expect(screen.getByRole('img', { name: 'Industrial Relay Series' }).tagName).toBe('DIV');
  });
});
