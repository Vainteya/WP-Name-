import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Product Catalog', path: '/products' },
  { name: 'Commercial Terms', path: '/commercial' },
];

const BUSINESS_PHONE = '+91 9422323814';
const BUSINESS_EMAIL = 'suprajtraders@gmail.com';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex shrink-0 items-center gap-4" onClick={() => setMobileOpen(false)}>
          <img src="/images/SuprajLogoTransparent.png" alt="Supraj" className="h-9 w-auto object-contain sm:h-10" />
          <span className="text-lg font-light text-gray-200" aria-hidden="true">
            |
          </span>
          <img
            src="/images/nirvee_rectangular_transparent.png"
            alt="Nirvee"
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        {/* Center nav — collapses into the slide-down panel below md */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="group relative text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-brand-600"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-600 transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Inquiries desk — hidden below lg where there isn't room next to the nav links */}
        <div className="hidden flex-col items-end rounded-lg border border-gray-100 bg-gray-50 px-4 py-1.5 text-xs lg:flex">
          <a
            href={`tel:${BUSINESS_PHONE.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 font-semibold text-gray-800 transition-colors duration-200 hover:text-brand-600"
          >
            <Phone className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            {BUSINESS_PHONE}
          </a>
          <a
            href={`mailto:${BUSINESS_EMAIL}`}
            className="flex items-center gap-1.5 pt-0.5 text-gray-500 transition-colors duration-200 hover:text-brand-600"
          >
            <Mail className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            {BUSINESS_EMAIL}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-brand-600 md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Slide-down mobile panel — height-animated rather than shown/hidden
          outright so the open/close reads as a transition, not a jump cut. */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-gray-100 bg-white transition-[max-height] duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-1 border-t border-gray-100 pt-3 text-sm">
            <a href={`tel:${BUSINESS_PHONE.replace(/\s+/g, '')}`} className="flex items-center gap-2 px-3 py-1.5 font-semibold text-gray-800">
              <Phone className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {BUSINESS_PHONE}
            </a>
            <a href={`mailto:${BUSINESS_EMAIL}`} className="flex items-center gap-2 px-3 py-1.5 text-gray-500">
              <Mail className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {BUSINESS_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
