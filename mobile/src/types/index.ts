/**
 * Типы для HydroCalc Mobile App
 */

// Сезон для расчёта
export type Season = 'cold' | 'warm';

// Тип активности
export type Activity = 'normal' | 'sport' | 'trip';

// Данные пользователя
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

// Запрос на расчёт воды
export interface CalculateRequest {
  junior_count: number;
  middle_count: number;
  senior_count: number;
  staff_count: number;
  season: Season;
  activity: Activity;
}

// Детализация по категории
export interface CategoryBreakdown {
  count: number;
  norm: number;
  subtotal: number;
}

// Полная детализация расчёта
export interface Breakdown {
  junior: CategoryBreakdown;
  middle: CategoryBreakdown;
  senior: CategoryBreakdown;
  staff: CategoryBreakdown;
}

// Коэффициенты
export interface Coefficients {
  season: number;
  activity: number;
}

// Ответ с результатом расчёта
export interface CalculateResponse {
  total_water: number;
  base_total: number;
  breakdown: Breakdown;
  coefficients: Coefficients;
  total_people: number;
}

// Параметры расчёта для истории
export interface CalculationParams {
  junior_count: number;
  middle_count: number;
  senior_count: number;
  staff_count: number;
  season: string;
  activity: string;
}

// Элемент истории
export interface HistoryItem {
  id: number;
  total_water: number;
  created_at: string;
  params: CalculationParams;
}

// Ответ авторизации
export interface AuthResponse {
  access_token: string;
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

// Локальный расчёт (для оффлайн режима)
export interface LocalCalculation {
  id: string;
  request: CalculateRequest;
  result: CalculateResponse;
  createdAt: string;
  synced: boolean;
}
