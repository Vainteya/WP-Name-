import '@testing-library/jest-dom/vitest';

/*
 * jsdom doesn't implement `window.matchMedia`. Provide a minimal polyfill
 * so any component reading it (e.g. useReducedMotion) gets a real object
 * with addEventListener/removeEventListener instead of crashing at import
 * time. Defaults to "no preference" (matches: false) — individual tests
 * override this with `vi.spyOn(window, 'matchMedia')` when they need to
 * simulate `prefers-reduced-motion: reduce`.
 */
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
