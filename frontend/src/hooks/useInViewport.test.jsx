import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useInViewport } from './useInViewport';

function TestTarget(props) {
  const [ref, isVisible] = useInViewport(props);
  return <div ref={ref}>{isVisible ? 'visible' : 'hidden'}</div>;
}

describe('useInViewport', () => {
  const originalIO = window.IntersectionObserver;

  afterEach(() => {
    window.IntersectionObserver = originalIO;
  });

  it('defaults to visible when IntersectionObserver is unsupported', () => {
    delete window.IntersectionObserver;
    render(<TestTarget />);
    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('starts hidden, then flips to visible once the observer reports intersection', () => {
    let capturedCallback;
    class FakeObserver {
      constructor(callback) {
        capturedCallback = callback;
      }
      observe() {}
      disconnect() {}
    }
    window.IntersectionObserver = FakeObserver;

    render(<TestTarget />);
    expect(screen.getByText('hidden')).toBeInTheDocument();

    act(() => {
      capturedCallback([{ isIntersecting: true }]);
    });

    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('stays visible without re-hiding once `once` is true (the default) and intersection ends', () => {
    let capturedCallback;
    let disconnected = false;
    class FakeObserver {
      constructor(callback) {
        capturedCallback = callback;
      }
      observe() {}
      disconnect() {
        disconnected = true;
      }
    }
    window.IntersectionObserver = FakeObserver;

    render(<TestTarget />);

    act(() => {
      capturedCallback([{ isIntersecting: true }]);
    });
    expect(screen.getByText('visible')).toBeInTheDocument();
    expect(disconnected).toBe(true);
  });
});
