import { apiClient } from '@/lib/axios';
import type { Product, ProductsResponse, DashboardMetrics } from '@/types';

export const productsService = {
  // Obtener todos los productos con paginación y filtros
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    min?: number;
    max?: number;
  }): Promise<ProductsResponse> => {
    const { data } = await apiClient.get('/products/filter', { params });
    return data;
  },

  // Obtener un producto por ID
  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data.product;
  },

  // Crear producto (con imágenes) - REQUIERE AUTH ADMIN
  create: async (formData: FormData): Promise<Product> => {
    const { data } = await apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.product;
  },

  // Actualizar producto - REQUIERE AUTH ADMIN
  update: async (id: string, formData: FormData): Promise<Product> => {
    const { data } = await apiClient.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.product;
  },

  // Eliminar producto - REQUIERE AUTH ADMIN
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Obtener métricas para dashboard - REQUIERE AUTH ADMIN
  getIndicators: async (): Promise<DashboardMetrics> => {
    const { data } = await apiClient.get('/products/indicators');
    return data;
  },
};