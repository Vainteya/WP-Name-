import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * <img> with a graceful fallback for missing or broken assets. Instead of
 * the browser's default broken-image icon, renders a neutral placeholder
 * box — a missing product photo or logo reads as "still loading design
 * polish" rather than "the site is broken".
 */
export default function FallbackImage({ src, alt, className = '', fallbackClassName = '', ...rest }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center rounded bg-gray-50 text-gray-300 ${fallbackClassName || className}`}
      >
        <ImageOff className="h-1/3 w-1/3 min-h-4 min-w-4" aria-hidden="true" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}
