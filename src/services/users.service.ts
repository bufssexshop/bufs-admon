import { apiClient } from '@/lib/axios';
import type { User, LoginRequest, LoginResponse } from '@/types';

export const usersService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/users/signin', credentials);
    return data;
  },

  // Obtener usuario actual (el que está logueado)
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/users/me');
    return data.user;
  },

  // Obtener todos los usuarios (solo admin)
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/users/all'); // ← Corregido
    return data.users;
  },

  // Crear usuario
  create: async (userData: any): Promise<User> => {
    const { data } = await apiClient.post('/users/signup', userData);
    return data.user;
  },

  // Actualizar usuario
  update: async (id: string, userData: any): Promise<User> => {
    const { data } = await apiClient.patch(`/users/${id}`, userData);
    return data.user;
  },

  // Toggle status (activar/desactivar)
  toggleStatus: async (id: string): Promise<{ active: boolean }> => {
    const { data } = await apiClient.patch(`/users/toggle-status/${id}`);
    return data;
  },

  // Aceptar términos (usuario actual)
  acceptTerms: async (): Promise<User> => {
    const { data } = await apiClient.patch('/users/accept-terms');
    return data.user;
  },

  // Actualizar perfil propio (cualquier usuario autenticado)
  updateOwnProfile: async (userData: any): Promise<User> => {
    const { data } = await apiClient.patch('/users/profile', userData);
    return data.user;
  },
};