import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

function mockMatchMedia({ matches, addEventListener = vi.fn(), removeEventListener = vi.fn() }) {
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches, addEventListener, removeEventListener });
}

describe('useReducedMotion', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when the OS reports no motion preference', () => {
    mockMatchMedia({ matches: false });
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when the OS prefers reduced motion', () => {
    mockMatchMedia({ matches: true });
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates live when the preference changes after mount', () => {
    let changeHandler;
    mockMatchMedia({
      matches: false,
      addEventListener: (event, handler) => {
        if (event === 'change') changeHandler = handler;
      },
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      changeHandler({ matches: true });
    });

    expect(result.current).toBe(true);
  });

  it('falls back to false (motion allowed) when matchMedia is unavailable', () => {
    const original = window.matchMedia;
    delete window.matchMedia;

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    window.matchMedia = original;
  });
});
