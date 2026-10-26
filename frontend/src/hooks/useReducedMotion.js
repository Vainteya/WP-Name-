import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getInitialValue() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    // matchMedia isn't available (very old browser, some test/SSR setups) —
    // default to motion allowed rather than throwing.
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks the OS/browser-level "reduce motion" accessibility preference,
 * live — if the user flips the setting while the page is open, components
 * using this hook re-render immediately.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(getInitialValue);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(QUERY);
    const handleChange = (event) => setReduced(event.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}
