import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Marquee from './Marquee';

function mockMatchMedia(matches) {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

describe('Marquee', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('duplicates the item list once for a seamless loop when motion is allowed', () => {
    mockMatchMedia(false);
    render(<Marquee items={['Paramount', 'Finder']} />);
    expect(screen.getAllByText('Paramount')).toHaveLength(2);
    expect(screen.getAllByText('Finder')).toHaveLength(2);
  });

  it('renders each item exactly once, statically, when reduced motion is preferred', () => {
    mockMatchMedia(true);
    render(<Marquee items={['Paramount', 'Finder']} />);
    expect(screen.getAllByText('Paramount')).toHaveLength(1);
    expect(screen.getAllByText('Finder')).toHaveLength(1);
  });
});
