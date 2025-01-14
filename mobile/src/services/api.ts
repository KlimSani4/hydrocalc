/**
 * API клиент для работы с backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { getToken } from './storage';
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  CalculateRequest,
  CalculateResponse,
  HistoryItem
} from '../types';

// URL API сервера (для локальной разработки)
// В Android эмуляторе localhost не работает, нужен IP машины
const API_URL = 'http://192.168.1.100:8000/api/v1';

// Создаём экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Проверка доступности сервера
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await api.get('/health', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Регистрация нового пользователя
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    if (axiosError.response?.data?.detail) {
      throw new Error(axiosError.response.data.detail);
    }
    throw new Error('Ошибка регистрации. Проверьте подключение к интернету.');
  }
}

/**
 * Вход в систему
 */
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    // Backend ожидает form-data с username (email) и password
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);

    const response = await api.post<AuthResponse>('/auth/login', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    if (axiosError.response?.status === 401) {
      throw new Error('Неверный email или пароль');
    }
    if (axiosError.response?.data?.detail) {
      throw new Error(axiosError.response.data.detail);
    }
    throw new Error('Ошибка входа. Проверьте подключение к интернету.');
  }
}

/**
 * Расчёт потребления воды через API
 */
export async function calculateWater(data: CalculateRequest): Promise<CalculateResponse> {
  try {
    const response = await api.post<CalculateResponse>('/calculate', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    if (axiosError.response?.data?.detail) {
      throw new Error(axiosError.response.data.detail);
    }
    throw new Error('Ошибка расчёта. Проверьте подключение к интернету.');
  }
}

/**
 * Получение истории расчётов
 */
export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const response = await api.get<HistoryItem[]>('/history');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    if (axiosError.response?.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (axiosError.response?.data?.detail) {
      throw new Error(axiosError.response.data.detail);
    }
    throw new Error('Ошибка загрузки истории. Проверьте подключение к интернету.');
  }
}

/**
 * Установка базового URL (для настройки через .env)
 */
export function setApiBaseUrl(url: string): void {
  api.defaults.baseURL = url;
}

export default api;
