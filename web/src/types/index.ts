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

// Детализация по категории
export interface CategoryBreakdown {
  count: number;
  norm: number;
  subtotal: number;
}

// Детализация по всем категориям
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

// Результат расчёта
export interface CalculateResult {
  total_water: number;
  base_total: number;
  breakdown: Breakdown;
  coefficients: Coefficients;
  total_people: number;
}

// Параметры расчёта
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

// Детальный элемент истории
export interface HistoryDetail extends HistoryItem {
  breakdown: Breakdown;
  coefficients: Coefficients;
  total_people: number;
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
