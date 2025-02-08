import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  limit: number;
}

export const productApi = {
  getProducts: async (page = 1, limit = 10, filters?: Record<string, any>) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await api.get<PaginatedResponse<Product>>(`/products?${params}`);
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await api.get<PaginatedResponse<Product>>(`/products/search?q=${query}`);
    return response.data;
  },

  createProduct: async (product: ProductInput) => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  updateProduct: async (id: string, product: Partial<ProductInput>) => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Home Appliances',
  'Beauty',
] as const;

export const PRICE_RANGES = [
  { label: '$0-$50', min: 0, max: 50 },
  { label: '$51-$100', min: 51, max: 100 },
  { label: '$100+', min: 100, max: null },
] as const;
