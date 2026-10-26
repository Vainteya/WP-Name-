import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-4">
            <img src="/images/SuprajLogoTransparent.png" alt="Supraj" className="h-8 w-auto object-contain" />
            <span className="text-xl font-light text-gray-200" aria-hidden="true">
              |
            </span>
            <img
              src="/images/nirvee_rectangular_transparent.png"
              alt="Nirvee"
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
            Supraj Traders &amp; Manufacturers and Nirvee Traders &mdash; serving industrial automation and
            control panels since 1985.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Registered office</h4>
          <address className="space-y-3 text-sm not-italic text-gray-600">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              A202 Rajendra Park Society, 1479/80 Shukrawar Peth, Pune 411002
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <a href="tel:9422323814" className="transition-colors duration-200 hover:text-brand-600">
                +91 9422323814
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <a
                href="mailto:suprajtraders@gmail.com"
                className="transition-colors duration-200 hover:text-brand-600"
              >
                suprajtraders@gmail.com
              </a>
            </p>
          </address>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Operational territory
          </h4>
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
            <p className="text-sm font-semibold text-brand-700">Pune &amp; Maharashtra industrial clusters</p>
            <p className="mt-1 text-xs text-brand-600/80">(Excluding Mumbai)</p>
          </div>
          <p className="mt-3 text-xs text-gray-400">Authorized distributors for Paramount &amp; Finder.</p>
        </div>
      </div>

      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Supraj Traders &amp; Manufacturers &amp; Nirvee Traders. All rights
        reserved.
      </div>
    </footer>
  );
}
