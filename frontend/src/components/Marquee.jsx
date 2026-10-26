import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Continuous, low-key brand-name strip. Renders two copies of `items`
 * back-to-back so the -50% translateX loop (see `@keyframes marquee` in
 * index.css) has no visible seam, then pauses on hover so a curious user
 * can actually read a name.
 *
 * Accessibility + motion preference: the animated track is
 * `aria-hidden` and a plain `sr-only` list carries the content for screen
 * readers once (not doubled). When the user prefers reduced motion, we
 * skip the animation and the duplicated track entirely and just render
 * the list once, statically — no motion, no redundant DOM.
 */
export default function Marquee({ items, durationSeconds = 32 }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {items.map((item) => (
          <span key={item} className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="group overflow-hidden">
      <div
        className="flex w-max animate-[marquee_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ '--marquee-duration': `${durationSeconds}s` }}
        aria-hidden="true"
      >
        {[0, 1].map((loop) => (
          <div key={loop} className="flex shrink-0">
            {items.map((item) => (
              <span
                key={`${loop}-${item}`}
                className="flex items-center whitespace-nowrap px-8 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 transition-colors duration-300 hover:text-brand-600"
              >
                {item}
                <span className="ml-8 text-gray-200">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">{items.join(', ')}</span>
    </div>
  );
}
