import axios from 'axios';
import type {
  AuthResponse,
  CalculateRequest,
  CalculateResult,
  HistoryItem,
  RegisterData
} from '../types';

// Базовый URL API (берём из переменных окружения или используем дефолтный)
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Создаём экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для добавления токена к запросам
// Используем X-Auth-Token вместо Authorization чтобы обойти Istio JWT validation
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['X-Auth-Token'] = token;
  }
  return config;
});

// Интерсептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = import.meta.env.BASE_URL + 'login';
    }
    return Promise.reject(error);
  }
);

// --- Авторизация ---

/**
 * Регистрация нового пользователя
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

/**
 * Вход в систему
 * Используем FormData для OAuth2 совместимости
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post<AuthResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}

// --- Калькулятор ---

/**
 * Расчёт нормы воды
 */
export async function calculateWater(data: CalculateRequest): Promise<CalculateResult> {
  const response = await api.post<CalculateResult>('/calculate', data);
  return response.data;
}

// --- История ---

/**
 * Получение истории расчётов (требует авторизации)
 */
export async function getHistory(): Promise<HistoryItem[]> {
  const response = await api.get<HistoryItem[]>('/history');
  return response.data;
}

export default api;
