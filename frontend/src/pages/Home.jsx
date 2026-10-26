import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageSquare, PackageCheck } from 'lucide-react';
import FallbackImage from '../components/FallbackImage';
import Marquee from '../components/Marquee';
import DivisionCard from '../components/DivisionCard';
import Reveal from '../components/Reveal';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MARQUEE_ITEMS = ['Paramount', 'Finder', 'Supraj', 'Nirvee'];

const WORKFLOW_STEPS = [
  {
    n: '01',
    title: 'Locate',
    desc: 'Browse the dual catalogs and pinpoint the exact component by specification.',
    Icon: MapPin,
  },
  {
    n: '02',
    title: 'Inquire',
    desc: 'Reach out directly via phone or email for live pricing and stock availability.',
    Icon: MessageSquare,
  },
  {
    n: '03',
    title: 'Receive',
    desc: 'Fast dispatch from regional inventory hubs straight to your facility.',
    Icon: PackageCheck,
  },
];

export default function Home() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full bg-white selection:bg-brand-100 selection:text-brand-900">
      {/* ────────────────────────────────────────────────────────────────
          HERO — two columns on desktop (copy left, product right),
          stacked on mobile. `lg:grid-cols-2` is the only breakpoint that
          matters here: below 1024px there isn't enough width for two
          columns without cramping the headline, so it drops to a single
          centered column.
         ──────────────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-6 py-20 md:py-28 lg:grid-cols-2 lg:gap-12">
          <div className="text-center lg:text-left">
            <span className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              Est. 1985 &mdash; Industrial Grade Supply
            </span>

            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Precision automation.
              <br />
              <span className="text-brand-600">Absolute control.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-gray-500 lg:mx-0">
              Authorized regional distributors for Paramount &amp; Finder — relays, SMPS, and surge
              protection equipping Maharashtra&rsquo;s industrial sector since 1985.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/products"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-700 sm:w-auto"
              >
                Explore Catalog
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="group inline-flex w-full items-center justify-center gap-1.5 px-7 py-3.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:text-brand-600 sm:w-auto"
              >
                Our Heritage
                <span className="h-px w-4 bg-gray-300 transition-all duration-200 group-hover:w-6 group-hover:bg-brand-600" />
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div
              className="flex h-64 w-64 items-center justify-center rounded-3xl border border-gray-100 bg-gray-50 shadow-2xl shadow-gray-200/60 sm:h-80 sm:w-80"
              /* Idle float is purely decorative, so it's the one animation
                 fully disabled — not just shortened — when the user prefers
                 reduced motion, rather than relying on the CSS fallback. */
              style={{ animation: reducedMotion ? 'none' : 'floatSlow 6s ease-in-out infinite' }}
            >
              <FallbackImage
                src="/images/components/relay.png"
                alt="Industrial relay component"
                className="h-40 w-40 object-contain transition-transform duration-500 hover:scale-105 sm:h-52 sm:w-52"
                fallbackClassName="h-40 w-40 sm:h-52 sm:w-52"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          BRAND STRIP — a slow, pausable marquee rather than a static
          row, so the "who we distribute for" fact stays alive without
          shouting. See Marquee.jsx for the reduced-motion fallback.
         ──────────────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gray-50 py-6">
        <Marquee items={MARQUEE_ITEMS} durationSeconds={32} />
      </section>

      {/* ────────────────────────────────────────────────────────────────
          DIVISION PICKER — grid collapses to one column below 768px
          (`md:grid-cols-2`) so the two catalog cards each keep full
          width and legible line lengths on tablets/phones.
         ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-5xl px-6">
          <Reveal className="mb-16 text-center md:mb-20">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Two divisions. <span className="text-brand-600">One standard.</span>
            </h2>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-gray-400">
              Choose your catalog to begin
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DivisionCard
              to="/products?company=Supraj"
              logoSrc="/images/SuprajLogoTransparent.png"
              logoAlt="Supraj"
              brandLabel="Paramount"
              title="Supraj Catalog"
              description="Relays, power supplies, diode O-rings, relay boards & panel accessories."
              emphasis="outline"
            />
            <DivisionCard
              to="/products?company=Nirvee"
              logoSrc="/images/nirvee_rectangular_transparent.png"
              logoAlt="Nirvee"
              brandLabel="Finder"
              title="Nirvee Catalog"
              description="Surge protection devices, solid state relays, timer relays & sockets."
              emphasis="filled"
            />
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          WORKFLOW — same md:grid-cols-3 collapse pattern; three steps
          read fine stacked on mobile since each card is self-contained.
         ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 py-24 md:py-32">
        <div className="container mx-auto max-w-5xl px-6">
          <Reveal className="mb-16 text-center md:mb-20">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              How it <span className="text-brand-600">works</span>
            </h2>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.n}
                className="group rounded-2xl border border-transparent bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gray-100 hover:shadow-xl hover:shadow-gray-200/60"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-4xl font-semibold text-gray-200 transition-colors duration-300 group-hover:text-brand-100">
                    {step.n}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors duration-300 group-hover:bg-brand-50 group-hover:text-brand-600">
                    <step.Icon className="h-5 w-5" />
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h4>
                <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
