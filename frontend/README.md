# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Design system

The whole site — Home, About, Product Catalog (`Products.jsx`), Commercial Terms, and the shared Navbar/Footer — follows one minimalist red/white design system: generous whitespace, a single accent color used strategically (never as a background default), and short, purposeful micro-interactions instead of heavy motion. It's built from a small set of reusable pieces, shared across every page:

| File | Purpose |
| --- | --- |
| `src/pages/Home.jsx` | Hero, brand strip, division picker, workflow sections. |
| `src/pages/About.jsx` | Hero, company narrative, client-trust grid, value cards, dark contact anchor. |
| `src/pages/Products.jsx` | Gateway view (division picker, reuses `DivisionCard`) + filtered catalog view (sidebar + product grid). |
| `src/pages/Commercial.jsx` | Hero + ordering-terms cards + territory notice. |
| `src/components/Navbar.jsx` | Site nav — desktop links, contact chip, and a slide-down mobile menu below `md`. |
| `src/components/Footer.jsx` | Site footer — logos, registered office, operational territory. |
| `src/components/Reveal.jsx` | Scroll-triggered fade-up wrapper, shared by every page section. |
| `src/components/DivisionCard.jsx` | The Supraj / Nirvee catalog picker card (outline or filled) — used on both Home and the Products gateway. |
| `src/components/ProductCard.jsx` | A single catalog item: image, brand badge, category, optional datasheet link. |
| `src/components/Marquee.jsx` | The looping brand-name strip, with a static fallback. |
| `src/components/FallbackImage.jsx` | `<img>` that swaps to a neutral placeholder if the asset 404s. |
| `src/hooks/useReducedMotion.js` | Live-tracks the OS `prefers-reduced-motion` setting. |
| `src/hooks/useInViewport.js` | Powers `Reveal`'s scroll-triggered fade-up. |

**One rule that keeps red from feeling decorative:** wherever two matched elements sit side by side (the Home/Products division cards, About's two value cards), exactly one is filled solid `brand-600` and the other stays white/outline — never both, never neither. See the comment in `DivisionCard.jsx`.

### Customizing the red

The palette is defined once, in `src/index.css`, as a Tailwind v4 `@theme` block:

```css
@theme {
  --color-brand-600: #dc2626; /* primary */
  --color-brand-700: #b91c1c; /* hover */
  --color-brand-50:  #fef2f2; /* tints */
  /* ...50–900 steps */
}
```

It defaults to Tailwind's stock `red-600`. To try a different shade (e.g. crimson `#DC143C` or a warmer `#E63946`), edit `--color-brand-600` (and, for a tonally consistent scale, run the new hex through a shade generator like [uicolors.app](https://uicolors.app/create) and paste in the resulting steps). Every `bg-brand-600` / `text-brand-700` / `border-brand-200`-style class across every page and component picks up the change immediately — no other file needs to change, since nothing in `src/pages` or `src/components` hardcodes a literal `red-*` Tailwind class anymore.

### Animation timings

There's no motion for its own sake — everything below is a purposeful, short micro-interaction:

- **Micro-interactions** (button hover, card lift, link underline, image zoom): `duration-200`–`duration-300` Tailwind classes, inline on each element.
- **Scroll reveal** (`Reveal.jsx`, backed by `useInViewport`): 0.7s fade + lift, defined as the `fadeUp` keyframe in `index.css` and applied via `animate-[fadeUp_0.7s_ease-out]`. Used at the top of every major section on every page.
- **Brand marquee**: 32s per loop by default, passed as the `durationSeconds` prop to `<Marquee>` in `Home.jsx` — raise it to slow the scroll down, lower it to speed it up.
- **Hero image float**: a barely-there 6s idle float, set inline in `Home.jsx` (`animation: floatSlow 6s ease-in-out infinite`) — purely decorative, so it's the one animation fully disabled (not just shortened) when reduced motion is preferred.
- **Mobile nav panel**: `transition-[max-height] duration-300` in `Navbar.jsx` — the slide-down open/close.
- **Product loading skeletons**: Tailwind's built-in `animate-pulse` on the placeholder cards in `Products.jsx` while a catalog fetch is in flight.

To change any of the above, edit the value at its listed location — none of the timings are duplicated elsewhere.

### Responsive breakpoints

Uses Tailwind's default breakpoints only, applied where the content actually needs it:

- `lg` (1024px): the Home hero's two-column layout (copy + floating product image) collapses to one centered column below this width.
- `md` (768px): every multi-column grid site-wide (division picker, workflow steps, client-trust grid, value cards, Products sidebar + grid) collapses to a single column below this width. The Navbar's link row and contact chip also switch to the hamburger menu below `md`.
- `lg` (1024px): the Navbar's inquiries-desk contact chip additionally needs `lg` (not just `md`) before there's room for it next to the nav links.

### Accessibility & graceful fallbacks

- **Reduced motion**: `useReducedMotion` (JS) plus a global `prefers-reduced-motion` media query (CSS, in `index.css`) — the marquee renders a static list instead of animating, and the hero image's idle float is turned off outright. `animate-pulse` skeletons and the `Reveal` fade are also covered by the global CSS backstop.
- **Missing images**: `FallbackImage` catches the `<img>` `onError` event and renders a neutral placeholder box with the same accessible name, instead of the browser's broken-image icon. Used for the Home hero image, division-card logos, and every `ProductCard` photo.
- **No `IntersectionObserver`**: `useInViewport` feature-detects the API; if it's absent, `Reveal` treats content as already visible rather than leaving it hidden forever.
- **Backend unreachable / empty catalog**: `Products.jsx` falls back to a static, category-derived placeholder catalog (built from `CATEGORIES_DATA`) whenever the API call fails or returns zero items, so the catalog view is never a blank page.
- **Keyboard/screen reader**: the mobile nav toggle carries `aria-expanded`/`aria-controls`/`aria-label`; the loading skeleton grid carries `role="status"`/`aria-live="polite"`.

### Running the tests

```bash
npm test         # single run (CI-friendly)
npm run test:watch  # watch mode while developing
```

Tests use [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) (`jsdom` environment, configured in `vite.config.js` / `src/test/setup.js`). Coverage includes:

- Both hooks' happy path + fallback path, and `Reveal`'s hidden→visible transition.
- `FallbackImage`'s error swap, `Marquee`'s duplicated-vs-static track, `DivisionCard`'s routing/content/fallback, `ProductCard`'s datasheet link + image fallback.
- `Navbar`'s link hrefs and mobile-menu open/close/auto-close behavior; `Footer`'s content and links.
- Page-level integration tests for `Home`, `About`, `Commercial`, and `Products` — the latter mocks `axios` to cover the gateway view, a successful fetch, an API failure falling back to the static catalog, an empty-response fallback, the back button, the company toggle, and category filtering (each re-triggering a fetch with the expected query string).
- Responsive assertions check that the correct Tailwind breakpoint classes are applied, since jsdom has no layout engine — an actual viewport-resize check would need an E2E tool like Playwright or Cypress.
