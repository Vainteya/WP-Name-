import { useState, useEffect } from 'react';
import axios from 'axios';
import { CATEGORIES_DATA } from '../utils/categoryData';
import { Trash2, Edit, Plus, LogOut, Package, AlertCircle } from 'lucide-react';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // keep in sync with backend/middleware/upload.js
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const EMPTY_FORM = { name: '', brand: 'Paramount', category: CATEGORIES_DATA[0].name, image: null, pdf: null };

/** Small red inline message shown directly under an invalid field. */
function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
      <AlertCircle size={12} className="shrink-0" />
      {message}
    </p>
  );
}

/** Border/background treatment applied to a field once it has an error, layered onto its base classes. */
function fieldClasses(base, hasError) {
  return hasError ? `${base} border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-1 focus:ring-red-200` : base;
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/products`);
      setProducts(data);
    } catch {
      console.error('Failed to fetch products');
    }
  };

  // Fetch Products when logged in. fetchProducts is also reused as a plain
  // "refresh the list" call after a successful submit/delete below, so it's
  // declared once above rather than inlined here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setProducts fires after the awaited GET resolves, not synchronously in the effect body
    if (token) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchProducts is stable across renders; re-running on token change is the only trigger needed
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { username, password });
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
    } catch {
      alert('Invalid Credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  const openModal = (product = null) => {
    setErrors({});
    if (product) {
      setEditingId(product._id);
      setFormData({ name: product.name, brand: product.brand, category: product.category, image: null, pdf: null });
    } else {
      setEditingId(null);
      setFormData(EMPTY_FORM);
    }
    setIsModalOpen(true);
  };

  // Clears a field's error as soon as the user changes it, so the red
  // highlight doesn't linger after they've actually fixed it.
  const updateField = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key]);
      delete next.form;
      return next;
    });
  };

  /**
   * Mirrors the backend's validation (see backend/routes/productRoutes.js)
   * so the user sees exactly which field is wrong inline, before a
   * network round-trip, rather than a single generic alert after the
   * fact. Returns the error map it produced (empty = valid).
   */
  const validate = () => {
    const next = {};

    if (!formData.name.trim()) next.name = 'Component name is required.';
    if (!formData.brand) next.brand = 'Please select a brand.';
    if (!formData.category) next.category = 'Please select a category.';

    if (!editingId && !formData.image) {
      next.image = 'Product image (.png/.jpg) is required.';
    } else if (formData.image) {
      if (!ACCEPTED_IMAGE_TYPES.includes(formData.image.type)) {
        next.image = 'Only .png or .jpg image files are allowed.';
      } else if (formData.image.size > MAX_FILE_BYTES) {
        next.image = 'Image is too large (10MB max).';
      }
    }

    if (formData.pdf) {
      if (formData.pdf.type !== 'application/pdf') {
        next.pdf = 'Only .pdf files are allowed for the datasheet.';
      } else if (formData.pdf.size > MAX_FILE_BYTES) {
        next.pdf = 'Datasheet is too large (10MB max).';
      }
    }

    setErrors(next);
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return; // inline messages below each field already explain what's wrong
    }

    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('brand', formData.brand);
    data.append('category', formData.category);
    if (formData.image) data.append('image', formData.image);
    if (formData.pdf) data.append('pdf', formData.pdf);

    setSubmitting(true);
    try {
      // IMPORTANT: do not set a manual 'Content-Type' header here. Axios
      // auto-generates 'multipart/form-data; boundary=...' for a FormData
      // body — a hardcoded header without that boundary produces a request
      // the backend's multer parser can't split into fields/files, so
      // every "required" field looks empty to the server even though the
      // form was filled in correctly.
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${backendUrl}/api/products/${editingId}`, data, config);
      } else {
        await axios.post(`${backendUrl}/api/products`, data, config);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      const responseErrors = error.response?.data?.errors;
      if (responseErrors) {
        // Server found something client-side validation missed (e.g. the
        // record already exists elsewhere, or a Mongoose-level rule) —
        // surface it against the same fields instead of a blind alert.
        setErrors(responseErrors);
      } else if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        setIsModalOpen(false);
        handleLogout();
      } else if (!error.response) {
        setErrors({ form: 'Could not reach the server. Check your connection and try again.' });
      } else {
        setErrors({ form: error.response?.data?.message || 'Failed to save product. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await axios.delete(`${backendUrl}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchProducts();
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Your session has expired. Please log in again.');
          handleLogout();
        } else if (!error.response) {
          alert('Could not reach the server. Make sure the backend is running.');
        } else {
          alert(error.response.data?.message || 'Failed to delete');
        }
      }
    }
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Admin Login</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:border-red-500 outline-none" />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:border-red-500 outline-none" />
            <button type="submit" className="w-full bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700">Login</button>
          </div>
        </form>
      </div>
    );
  }

  // ---------------- DASHBOARD ----------------
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Catalog Management</h1>
          <p className="text-gray-500 text-sm mt-1">Add, update, or remove components from the live database.</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => openModal()} className="flex items-center bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">
            <Plus size={18} className="mr-2" /> Add Component
          </button>
          <button onClick={handleLogout} className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 border-b">
              <th className="p-4 font-bold">Component Name</th>
              <th className="p-4 font-bold">Brand</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No components in database yet. Click "Add Component" to start.</td></tr>
            )}
            {products.map(product => (
              <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium flex items-center">
                  <Package size={16} className="mr-2 text-gray-400" /> {product.name}
                </td>
                <td className="p-4 text-sm font-semibold text-gray-600">{product.brand}</td>
                <td className="p-4 text-sm text-gray-500">{product.category}</td>
                <td className="p-4 flex justify-end space-x-2">
                  <button onClick={() => openModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{editingId ? 'Edit Component' : 'Add New Component'}</h2>

            {/* Form-level error (auth/network/unexpected server failure) — field-specific
                errors render inline below each input instead of here. */}
            {errors.form && (
              <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              <div>
                <label htmlFor="product-name" className="block text-sm font-bold text-gray-700 mb-1">Component Name</label>
                <input
                  id="product-name"
                  type="text"
                  value={formData.name}
                  onChange={e => updateField({ name: e.target.value })}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'product-name-error' : undefined}
                  className={fieldClasses('w-full p-2.5 border border-gray-300 rounded outline-none', Boolean(errors.name))}
                />
                <FieldError id="product-name-error" message={errors.name} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="product-brand" className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                  <select
                    id="product-brand"
                    value={formData.brand}
                    onChange={e => updateField({ brand: e.target.value })}
                    aria-invalid={Boolean(errors.brand)}
                    aria-describedby={errors.brand ? 'product-brand-error' : undefined}
                    className={fieldClasses('w-full p-2.5 border border-gray-300 rounded outline-none', Boolean(errors.brand))}
                  >
                    <option value="Paramount">Paramount</option>
                    <option value="Finder">Finder</option>
                  </select>
                  <FieldError id="product-brand-error" message={errors.brand} />
                </div>
                <div>
                  <label htmlFor="product-category" className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select
                    id="product-category"
                    value={formData.category}
                    onChange={e => updateField({ category: e.target.value })}
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={errors.category ? 'product-category-error' : undefined}
                    className={fieldClasses('w-full p-2.5 border border-gray-300 rounded outline-none', Boolean(errors.category))}
                  >
                    {CATEGORIES_DATA.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <FieldError id="product-category-error" message={errors.category} />
                </div>
              </div>

              <div className="pt-2">
                <label htmlFor="product-image" className="block text-sm font-bold text-gray-700 mb-1">
                  Product Image (.png, .jpg) {editingId && <span className="text-xs font-normal text-gray-400">(Leave blank to keep existing)</span>}
                </label>
                <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={e => updateField({ image: e.target.files[0] || null })}
                  aria-invalid={Boolean(errors.image)}
                  aria-describedby={errors.image ? 'product-image-error' : undefined}
                  className={fieldClasses(
                    'w-full text-sm text-gray-500 border border-transparent rounded p-1 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100',
                    Boolean(errors.image)
                  )}
                />
                <FieldError id="product-image-error" message={errors.image} />
              </div>

              <div className="pt-2">
                <label htmlFor="product-pdf" className="block text-sm font-bold text-gray-700 mb-1">
                  Technical Datasheet (.pdf) {editingId && <span className="text-xs font-normal text-gray-400">(Leave blank to keep existing)</span>}
                </label>
                <input
                  id="product-pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={e => updateField({ pdf: e.target.files[0] || null })}
                  aria-invalid={Boolean(errors.pdf)}
                  aria-describedby={errors.pdf ? 'product-pdf-error' : undefined}
                  className={fieldClasses(
                    'w-full text-sm text-gray-500 border border-transparent rounded p-1 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200',
                    Boolean(errors.pdf)
                  )}
                />
                <FieldError id="product-pdf-error" message={errors.pdf} />
                <p className="mt-1 text-xs text-gray-400">Optional — datasheet can be added later by editing this component.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded">Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Upload Component'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
