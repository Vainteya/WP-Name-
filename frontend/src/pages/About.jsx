import { Award, Building2, Users, Phone, Mail, MapPin } from 'lucide-react';
import Reveal from '../components/Reveal';

const CLIENTS = [
  'Bharat Forge Ltd.',
  'Tata Motors Ltd.',
  'Forbes Marshall',
  'Wipro Pari',
  'Alfa Laval Pvt. Ltd.',
  'Cotmac Pvt. Ltd.',
  'DitapV Pvt. Ltd.',
  'Oneness Control Panels Pvt. Ltd.',
];

const CONTACTS = [
  {
    Icon: MapPin,
    label: 'Head office address',
    content: (
      <>
        A202 Rajendra Park Society,
        <br />
        1479/80 Shukrawar Peth,
        <br />
        Pune 411002, Maharashtra
      </>
    ),
  },
  {
    Icon: Phone,
    label: 'Direct business line',
    content: (
      <a href="tel:9422323814" className="transition-colors duration-200 hover:text-brand-400">
        +91 9422323814
      </a>
    ),
  },
  {
    Icon: Mail,
    label: 'Official email',
    content: (
      <a
        href="mailto:suprajtraders@gmail.com"
        className="underline decoration-white/20 underline-offset-2 transition-colors duration-200 hover:text-brand-400"
      >
        suprajtraders@gmail.com
      </a>
    ),
  },
];

export default function About() {
  return (
    <div className="w-full bg-white selection:bg-brand-100 selection:text-brand-900">
      {/* ────────────────────────────────────────────────────────────────
          HERO — same badge + headline + subtext pattern as Home.jsx,
          centered since About has no second visual column to balance.
         ──────────────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              Est. 1985 &mdash; Industrial Grade Supply
            </span>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl">
              Four decades of trust in <span className="text-brand-600">industrial automation.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500">
              Supplying quality electrical and electronic components to automation panel builders, OEMs, system
              integrators, and industrial customers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* NARRATIVE */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto max-w-3xl px-6">
          <Reveal className="space-y-6 text-base leading-relaxed text-gray-600">
            <p>
              Established in August 1985, <strong className="font-semibold text-gray-900">Supraj Traders &amp;
              Manufacturers</strong> has been serving the electrical and industrial automation industry for over
              four decades. From the very beginning, our focus has been clear &mdash; supplying quality electrical
              and electronic components to automation panel builders, OEMs, system integrators, and industrial
              customers.
            </p>
            <p>
              Over the years, we have developed a deep understanding of the requirements of the industrial
              automation and control-panel industry. We recognize that for a panel builder, selecting the right
              component is only one part of the job. Consistent product availability, dependable quality,
              technical understanding, timely supply, and responsive service are equally important for completing
              projects and maintaining production schedules.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          CLIENT TRUST — same md:grid-cols-4 collapse pattern used
          throughout the site; a tinted section background separates it
          from the plain-white narrative above without adding a border.
         ──────────────────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-20 md:py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <Reveal className="mb-12 text-center md:mb-16">
            <div className="mb-4 flex items-center justify-center gap-2 text-brand-600">
              <Award className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest">Client trust</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by leading industrial organizations
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
              Our long-standing presence in the industry has enabled us to build relationships with several
              reputed organizations across industrial automation and manufacturing.
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {CLIENTS.map((client) => (
              <div
                key={client}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow-lg hover:shadow-gray-200/60"
              >
                {client}
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-8 text-center text-sm leading-relaxed text-gray-500">
            These relationships represent our commitment to serving customers across diverse industrial
            applications and requirements. We are proud to have supported organizations that operate in demanding
            manufacturing, engineering, automation, and industrial environments.
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          VALUES — exactly one of the pair filled with the brand color
          (same "strategic, not decorative" rule as DivisionCard), so the
          two cards read as a contrast pair rather than a matched set.
         ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
          <Reveal className="group flex flex-col justify-between rounded-2xl border border-gray-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-gray-200/60">
            <div>
              <Users className="mb-5 h-6 w-6 text-brand-600" aria-hidden="true" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">More than a component supplier</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                At Supraj Traders &amp; Manufacturers, we believe that a good supplier should be more than a
                source of products. Our objective is to become a reliable and responsive partner for our
                customers, helping them source the electrical and electronic components they need for their
                automation and control-panel applications.
              </p>
            </div>
            <p className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-400">
              Practical understanding developed through four decades of direct market relationships.
            </p>
          </Reveal>

          <Reveal className="flex flex-col justify-between rounded-2xl border border-brand-600 bg-brand-600 p-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/20">
            <div>
              <Building2 className="mb-5 h-6 w-6" aria-hidden="true" />
              <h3 className="mb-3 text-xl font-semibold">Looking ahead</h3>
              <p className="text-sm leading-relaxed text-white/80">
                While our foundation was built more than four decades ago, our focus remains firmly on the
                future. We continue to expand our product portfolio, strengthen our relationships with automation
                professionals, and support the evolving requirements of modern industrial automation.
              </p>
            </div>
            <p className="mt-6 border-t border-white/20 pt-4 text-xs font-semibold uppercase tracking-wider text-white/90">
              Reliable products. Responsive service. Long-term relationships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          CONTACT — the one deliberately dark section on the site: an
          anchor at the page's end, mirroring how a footer closes a page,
          without duplicating the site-wide Footer's content.
         ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-900 py-20 md:py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="mb-12 text-2xl font-semibold tracking-tight text-white">
              Registered office &amp; business contacts
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {CONTACTS.map(({ Icon, label, content }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</h4>
                    <p className="mt-1 text-sm font-medium text-gray-200">{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
