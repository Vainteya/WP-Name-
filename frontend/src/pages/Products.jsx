import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import DivisionCard from '../components/DivisionCard';
import Reveal from '../components/Reveal';
import { CATEGORIES_DATA } from '../utils/categoryData';
import { Building2, ArrowLeft } from 'lucide-react';

const SKELETON_COUNT = 6;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCompany = searchParams.get('company');
  const activeCategory = searchParams.get('category') || 'All';
  const targetBrand = activeCompany === 'Supraj' ? 'Paramount' : 'Finder';

  useEffect(() => {
    if (!activeCompany) return undefined;

    // Same-shape placeholder catalog used both when the backend is
    // unreachable and when it responds with an empty result set, so the
    // page never shows a blank grid just because live inventory data
    // hasn't been seeded yet.
    const fallbackFor = () =>
      CATEGORIES_DATA.filter((cat) => cat.defaultBrand === targetBrand)
        .filter((cat) => activeCategory === 'All' || cat.name === activeCategory)
        .map((cat, idx) => ({
          _id: `fallback-${idx}`,
          name: `Industrial ${cat.name} Series`,
          brand: cat.defaultBrand,
          category: cat.name,
          imagePath: cat.image,
          pdfPath: null,
        }));

    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/products?brand=${targetBrand}`;
        if (activeCategory !== 'All') {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        const { data } = await axios.get(url);
        if (cancelled) return;
        setProducts(data && data.length > 0 ? data : fallbackFor());
      } catch {
        if (!cancelled) setProducts(fallbackFor());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [activeCompany, activeCategory, targetBrand]);

  // ──────────────────────────────────────────────────────────────────
  // VIEW 1: GATEWAY — reuses the same DivisionCard pair as the Home
  // division picker (same two catalogs, same "one filled, one outline"
  // rule), so choosing a division reads identically wherever it's shown.
  // ──────────────────────────────────────────────────────────────────
  if (!activeCompany) {
    return (
      <div className="w-full bg-white selection:bg-brand-100 selection:text-brand-900">
        <section className="border-b border-gray-100">
          <div className="container mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
                Product Catalog
              </span>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl">
                Select a distribution division
              </h1>
              <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-gray-500">
                Choose a catalog to browse specialized industrial components by category and specification.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container mx-auto max-w-5xl px-6">
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
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // VIEW 2: FILTERED CATALOG
  // ──────────────────────────────────────────────────────────────────
  const availableCategories = CATEGORIES_DATA.filter((cat) => cat.defaultBrand === targetBrand);

  return (
    <div className="w-full bg-white selection:bg-brand-100 selection:text-brand-900">
      <section className="border-b border-gray-100">
        <div className="container mx-auto flex flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
              title="Back to catalog selection"
              aria-label="Back to catalog selection"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                {activeCompany} Catalog
              </h1>
              <p className="mt-1 text-sm font-medium text-brand-600">Showing {targetBrand} components</p>
            </div>
          </div>

          <div className="flex rounded-full border border-gray-200 bg-gray-50 p-1 text-sm font-semibold">
            {['Supraj', 'Nirvee'].map((company) => (
              <button
                key={company}
                type="button"
                onClick={() => setSearchParams({ company })}
                className={`rounded-full px-5 py-2 transition-colors duration-200 ${
                  activeCompany === company ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto flex flex-col gap-10 px-6 md:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full shrink-0 md:w-64">
            <div className="sticky top-24 rounded-2xl border border-gray-200 p-5">
              <h3 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <Building2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                Categories
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ company: activeCompany })}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                      activeCategory === 'All'
                        ? 'bg-brand-50 font-semibold text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
                    }`}
                  >
                    All {activeCompany} Components
                  </button>
                </li>
                {availableCategories.map((cat) => (
                  <li key={cat.name}>
                    <button
                      type="button"
                      onClick={() => setSearchParams({ company: activeCompany, category: cat.name })}
                      className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                        activeCategory === cat.name
                          ? 'bg-brand-50 font-semibold text-brand-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product grid */}
          <div className="grow">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeCategory === 'All' ? `All ${targetBrand} products` : activeCategory}
              </h2>
              <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
                {products.length} item{products.length === 1 ? '' : 's'}
              </span>
            </div>

            {loading ? (
              <div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                role="status"
                aria-live="polite"
                aria-label="Loading products"
              >
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                <p className="text-sm text-gray-500">No components found for this selection.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
