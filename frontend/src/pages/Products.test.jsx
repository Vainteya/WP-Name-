import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Products from './Products';

vi.mock('axios');

function renderProducts(initialEntry = '/products') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/products" element={<Products />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Products page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('gateway view', () => {
    it('renders both division catalog cards when no company is selected', () => {
      renderProducts();
      expect(screen.getByRole('link', { name: /supraj catalog/i })).toHaveAttribute(
        'href',
        '/products?company=Supraj'
      );
      expect(screen.getByRole('link', { name: /nirvee catalog/i })).toHaveAttribute(
        'href',
        '/products?company=Nirvee'
      );
    });

    it('navigates into the Supraj catalog view on click', async () => {
      axios.get.mockResolvedValue({ data: [] });
      const user = userEvent.setup();
      renderProducts();

      await user.click(screen.getByRole('link', { name: /supraj catalog/i }));

      expect(await screen.findByRole('heading', { level: 1, name: /supraj catalog/i })).toBeInTheDocument();
    });
  });

  describe('catalog view', () => {
    it('renders products returned by the API for the active company', async () => {
      axios.get.mockResolvedValueOnce({
        data: [
          {
            _id: 'p1',
            name: 'SSR Module',
            brand: 'Finder',
            category: 'Solid State Relays',
            imagePath: '/images/components/ssr.png',
            pdfPath: null,
          },
        ],
      });
      renderProducts('/products?company=Nirvee');

      expect(await screen.findByText('SSR Module')).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('brand=Finder'));
    });

    it('falls back to the static category catalog when the API call fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('network down'));
      renderProducts('/products?company=Supraj');

      expect(await screen.findByText(/Industrial Relay Boards Series/i)).toBeInTheDocument();
    });

    it('falls back to the static category catalog when the API returns no products', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      renderProducts('/products?company=Supraj');

      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
      expect(screen.getAllByText(/Industrial .+ Series/).length).toBeGreaterThan(0);
    });

    it('returns to the gateway view when the back button is clicked', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      const user = userEvent.setup();
      renderProducts('/products?company=Supraj');
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

      await user.click(screen.getByRole('button', { name: /back to catalog selection/i }));

      expect(screen.getByRole('heading', { level: 1, name: /select a distribution division/i })).toBeInTheDocument();
    });

    it('re-fetches filtered by category when a sidebar item is clicked', async () => {
      axios.get.mockResolvedValue({ data: [] });
      const user = userEvent.setup();
      renderProducts('/products?company=Supraj');
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

      await user.click(screen.getByRole('button', { name: 'Relay Boards' }));

      await waitFor(() => {
        expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('category=Relay%20Boards'));
      });
    });

    it('switches company via the Supraj/Nirvee toggle', async () => {
      axios.get.mockResolvedValue({ data: [] });
      const user = userEvent.setup();
      renderProducts('/products?company=Supraj');
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

      await user.click(screen.getByRole('button', { name: 'Nirvee' }));

      expect(await screen.findByRole('heading', { level: 1, name: /nirvee catalog/i })).toBeInTheDocument();
      expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('brand=Finder'));
    });
  });
});
