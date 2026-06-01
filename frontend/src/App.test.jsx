import { vi, describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

vi.mock('./stores/useUserStore', () => ({
  useUserStore: () => ({ checkAuth: vi.fn(), checkingAuth: false, user: null, wishlist: [] })
}));

vi.mock('./stores/useCartStore', () => ({
  useCartStore: () => ({ getCartItems: vi.fn(), cart: [] })
}));

vi.mock('./stores/useProductStore', () => ({
  useProductStore: () => ({ fetchFeaturedProducts: vi.fn(), products: [], loading: false })
}));

vi.mock('./stores/useCategoryStore', () => ({
  useCategoryStore: () => ({ fetchCategories: vi.fn(), categories: [], loading: false })
}));

describe('Modular testing of the main system component', () => {
  test('Successful launch and rendering of the application', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const textElement = screen.getByText(/Catalog/i);
    expect(textElement).toBeInTheDocument();
  });
});