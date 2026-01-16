import { apiClient } from '@/lib/axios';
import type { Order, CreateOrderRequest } from '@/types';

export const ordersService = {
  // Crear nueva orden
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const { data } = await apiClient.post('/orders', orderData);
    return data.order;
  },

  // Obtener mis órdenes (cliente)
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get('/orders/my-orders');
    return data.orders;
  },

  // Obtener todas las órdenes (admin)
  getAllOrders: async (status?: string): Promise<Order[]> => {
    const params = status ? { status } : {};
    const { data } = await apiClient.get('/orders', { params });
    return data.orders;
  },

  // Obtener detalle de una orden
  getById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data.order;
  },

  // Actualizar estado (admin)
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return data.order;
  },
};