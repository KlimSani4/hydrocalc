// Типы для приложения HydroCalc

// Пользователь
export interface User {
  id: number;
  email: string;
}

// Данные для входа
export interface LoginData {
  email: string;
  password: string;
}

// Данные для регистрации
export interface RegisterData {
  email: string;
  password: string;
}

// Ответ при авторизации
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Сезон года
export type Season = 'cold' | 'warm';

// Уровень активности
export type Activity = 'normal' | 'sport' | 'trip';

// Данные для расчёта
export interface CalculateRequest {
  junior_count: number;
  middle_count: number;
  senior_count: number;
  staff_count: number;
  season: Season;
  activity: Activity;
}

// Результат расчёта
export interface CalculateResult {
  id?: number;
  total_liters: number;
  junior_liters: number;
  middle_liters: number;
  senior_liters: number;
  staff_liters: number;
  season: Season;
  activity: Activity;
  created_at?: string;
}

// Элемент истории
export interface HistoryItem {
  id: number;
  junior_count: number;
  middle_count: number;
  senior_count: number;
  staff_count: number;
  season: Season;
  activity: Activity;
  total_liters: number;
  created_at: string;
}

// Контекст авторизации
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
