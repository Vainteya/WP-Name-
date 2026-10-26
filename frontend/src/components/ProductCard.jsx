import { Download } from 'lucide-react';
import FallbackImage from './FallbackImage';

export default function ProductCard({ product }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const imageSrc =
    product.imagePath?.startsWith('http') || product.imagePath?.startsWith('/images')
      ? product.imagePath
      : `${backendUrl}/${product.imagePath}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-gray-200/60">
      <div className="relative flex h-48 items-center justify-center border-b border-gray-100 bg-gray-50 p-6">
        <FallbackImage
          src={imageSrc}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          fallbackClassName="h-20 w-20"
        />
        <span className="absolute right-3 top-3 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 shadow-sm">
          {product.brand}
        </span>
      </div>

      <div className="flex grow flex-col justify-between p-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{product.category}</span>
          <h3 className="mt-2 text-base font-semibold leading-snug text-gray-900">{product.name}</h3>
        </div>

        {product.pdfPath && (
          <a
            href={`${backendUrl}/${product.pdfPath}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-brand-600"
          >
            <Download className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Download datasheet
          </a>
        )}
      </div>
    </div>
  );
}
