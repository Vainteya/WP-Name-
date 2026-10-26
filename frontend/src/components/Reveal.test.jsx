import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Reveal from './Reveal';

describe('Reveal', () => {
  const originalIO = window.IntersectionObserver;

  afterEach(() => {
    window.IntersectionObserver = originalIO;
  });

  it('renders children immediately visible when IntersectionObserver is unsupported', () => {
    delete window.IntersectionObserver;
    render(<Reveal>Panel content</Reveal>);
    expect(screen.getByText('Panel content')).toBeInTheDocument();
    expect(screen.getByText('Panel content')).toHaveClass('opacity-100');
  });

  it('starts hidden (opacity-0) then reveals once scrolled into view', () => {
    let capturedCallback;
    class FakeObserver {
      constructor(callback) {
        capturedCallback = callback;
      }
      observe() {}
      disconnect() {}
    }
    window.IntersectionObserver = FakeObserver;

    render(<Reveal>Panel content</Reveal>);
    expect(screen.getByText('Panel content')).toHaveClass('opacity-0');

    act(() => {
      capturedCallback([{ isIntersecting: true }]);
    });

    expect(screen.getByText('Panel content')).toHaveClass('opacity-100');
  });

  it('merges the caller-supplied className with its own reveal classes', () => {
    delete window.IntersectionObserver;
    render(<Reveal className="text-center mb-16">Panel content</Reveal>);
    const node = screen.getByText('Panel content');
    expect(node).toHaveClass('text-center');
    expect(node).toHaveClass('mb-16');
    expect(node).toHaveClass('opacity-100');
  });
});
