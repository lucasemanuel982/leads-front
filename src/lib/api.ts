import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Instância do Axios configurada
 */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para adicionar token em todas as requisições
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratamento de erros
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Funções helper para chamadas à API
 */

// Leads
export const leadsApi = {
  create: (data: any) => api.post('/leads', data),
  createAdmin: (data: any) => api.post('/leads/admin', data),
  getAll: (params?: any) => api.get('/leads/admin', { params }),
  getById: (id: string) => api.get(`/leads/admin/${id}`),
  update: (id: string, data: any) => api.put(`/leads/admin/${id}`, data),
  deactivate: (id: string) => api.delete(`/leads/admin/${id}`),
  delete: (id: string) => api.delete(`/leads/admin/${id}/permanent`),
  getStats: () => api.get('/leads/admin/stats'),
};

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  register: (data: any) => api.post('/auth/register', data),
  getUsers: () => api.get('/auth/users'),
};


