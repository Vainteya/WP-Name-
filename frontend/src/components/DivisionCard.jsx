import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FallbackImage from './FallbackImage';

/**
 * One half of the Supraj / Nirvee division picker.
 *
 * `emphasis="filled"` gives one card a solid red surface; the other stays
 * `emphasis="outline"` (white, red only on hover). Keeping exactly one of
 * the pair filled — never both, never neither — is what makes the red feel
 * "strategic" rather than decorative, per the minimalist brief.
 */
export default function DivisionCard({ to, logoSrc, logoAlt, brandLabel, title, description, emphasis = 'outline' }) {
  const filled = emphasis === 'filled';

  return (
    <Link
      to={to}
      className={`group relative flex flex-col justify-between rounded-2xl border p-10 transition-all duration-300 ease-out hover:-translate-y-1 ${
        filled
          ? 'border-brand-600 bg-brand-600 text-white hover:shadow-xl hover:shadow-brand-900/20'
          : 'border-gray-200 bg-white text-gray-900 hover:border-brand-200 hover:shadow-xl hover:shadow-gray-200/60'
      }`}
    >
      <div>
        <div className="mb-8 flex items-center justify-between">
          <FallbackImage
            src={logoSrc}
            alt={logoAlt}
            className={`h-9 w-auto object-contain ${filled ? 'brightness-0 invert' : ''}`}
            fallbackClassName="h-9 w-24"
          />
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              filled ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-700'
            }`}
          >
            {brandLabel}
          </span>
        </div>

        <h3 className="mb-3 text-2xl font-semibold tracking-tight">{title}</h3>
        <p className={`text-sm leading-relaxed ${filled ? 'text-white/80' : 'text-gray-500'}`}>{description}</p>
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm font-semibold">
        View catalog
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
