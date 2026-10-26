import { useEffect, useRef, useState } from 'react';

function supportsIntersectionObserver() {
  return typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';
}

/**
 * Reports whether the returned ref's element has scrolled into view, for
 * scroll-triggered reveal animations.
 *
 * Graceful fallback: if IntersectionObserver isn't available in the
 * current environment, the element is treated as already visible — content
 * is never left hidden waiting on an API that doesn't exist.
 *
 * @param {{ rootMargin?: string, once?: boolean }} options
 *   `rootMargin` shrinks/grows the trigger area (default fires ~80px before
 *   the element reaches the bottom of the viewport, so reveals feel timed
 *   rather than clipped). `once` (default true) stops observing after the
 *   first reveal — set false if a section should re-hide on scroll-away.
 */
export function useInViewport({ rootMargin = '0px 0px -80px 0px', once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(!supportsIntersectionObserver());

  useEffect(() => {
    const node = ref.current;
    if (!node || !supportsIntersectionObserver()) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return [ref, isVisible];
}
