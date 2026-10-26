import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FallbackImage from './FallbackImage';

describe('FallbackImage', () => {
  it('renders a normal <img> while the asset is assumed to load', () => {
    render(<FallbackImage src="/images/components/relay.png" alt="Relay" className="h-10 w-10" />);
    const img = screen.getByRole('img', { name: 'Relay' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/images/components/relay.png');
  });

  it('swaps to a placeholder box instead of a broken-image icon on load failure', () => {
    render(<FallbackImage src="/images/missing.png" alt="Missing asset" />);
    const img = screen.getByRole('img', { name: 'Missing asset' });

    fireEvent.error(img);

    const placeholder = screen.getByRole('img', { name: 'Missing asset' });
    expect(placeholder.tagName).toBe('DIV');
  });
});
