import { useInViewport } from '../hooks/useInViewport';

/**
 * Fades + lifts `children` into place the first time they scroll into
 * view, then leaves them alone. If the viewport hook can't observe
 * intersection (see useInViewport's fallback), `isVisible` is already
 * `true` on first render, so content simply appears with no animation —
 * it is never left invisible.
 *
 * Shared across Home, About, Products, and Commercial so every page's
 * scroll-reveal timing stays driven by one keyframe (`fadeUp` in index.css).
 */
export default function Reveal({ children, className = '' }) {
  const [ref, isVisible] = useInViewport();
  return (
    <div
      ref={ref}
      className={`${className} transition-opacity duration-700 ${
        isVisible ? 'opacity-100 animate-[fadeUp_0.7s_ease-out]' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
