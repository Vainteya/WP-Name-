import { CheckCircle2, Clock, MapPin } from 'lucide-react';
import Reveal from '../components/Reveal';

const NEW_CUSTOMER_TERMS = [
  {
    title: 'In-stock items',
    desc: 'Dispatched immediately upon receipt of 100% upfront payment.',
  },
  {
    title: 'Out-of-stock items (non-stock)',
    desc: 'Requires a formal Purchase Order (PO). Standard lead time is 2–3 weeks from the date of PO acknowledgement.',
  },
];

const RECURRING_TERMS = [
  'Standard stock and non-stock fulfillment rules apply.',
  'Eligible accounts qualify for standard 60-day credit terms.',
  'Credit terms can be extended up to 90 days based on long-term purchasing relationships and historical volume.',
];

export default function Commercial() {
  return (
    <div className="w-full bg-white selection:bg-brand-100 selection:text-brand-900">
      {/* HERO — same badge + headline pattern as About.jsx / Home.jsx */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              Commercial Terms
            </span>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl">
              Ordering process &amp; commercial terms
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500">
              A clear, predictable process for new and recurring customers &mdash; from purchase order to
              dispatch.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto max-w-3xl space-y-6 px-6">
          <Reveal className="rounded-2xl border border-gray-200 p-8 transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-200/50">
            <div className="mb-6 flex items-center gap-3">
              <Clock className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">New customers</h2>
            </div>
            <ul className="space-y-5">
              {NEW_CUSTOMER_TERMS.map((term) => (
                <li key={term.title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-gray-600">
                    <strong className="font-semibold text-gray-900">{term.title}:</strong> {term.desc}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="rounded-2xl border border-gray-200 p-8 transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-200/50">
            <div className="mb-6 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">Recurring / registered customers</h2>
            </div>
            <ul className="space-y-4">
              {RECURRING_TERMS.map((term) => (
                <li key={term} className="flex gap-3 text-sm leading-relaxed text-gray-600">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  {term}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="rounded-2xl border border-brand-100 bg-brand-50 p-8">
            <div className="mb-3 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <h3 className="text-base font-semibold text-brand-800">Notice regarding fulfillment territory</h3>
            </div>
            <p className="text-sm leading-relaxed text-brand-700">
              As clearly stated in our company policy, Supraj &amp; Nirvee strictly fulfill orders for clients
              located within <strong className="font-semibold">Pune and Maharashtra (excluding Mumbai)</strong>.
              Occasional out-of-state fulfillment is handled on a case-by-case basis. We do not support
              international shipping.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
