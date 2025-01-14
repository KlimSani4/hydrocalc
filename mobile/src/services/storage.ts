/**
 * Сервис для работы с локальным хранилищем
 * Используется для сохранения токена, пользователя и истории
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, LocalCalculation, HistoryItem } from '../types';

// Ключи для хранения
const KEYS = {
  TOKEN: 'hydrocalc_token',
  USER: 'hydrocalc_user',
  LOCAL_HISTORY: 'hydrocalc_local_history'
};

/**
 * Сохранить токен авторизации
 */
export async function saveToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
  } catch (error) {
    console.error('Ошибка сохранения токена:', error);
  }
}

/**
 * Получить токен авторизации
 */
export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.TOKEN);
  } catch (error) {
    console.error('Ошибка получения токена:', error);
    return null;
  }
}

/**
 * Удалить токен (при выходе)
 */
export async function removeToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.TOKEN);
  } catch (error) {
    console.error('Ошибка удаления токена:', error);
  }
}

/**
 * Сохранить данные пользователя
 */
export async function saveUser(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error);
  }
}

/**
 * Получить данные пользователя
 */
export async function getUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    return null;
  }
}

/**
 * Удалить данные пользователя (при выходе)
 */
export async function removeUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
  }
}

/**
 * Очистить все данные авторизации
 */
export async function clearAuth(): Promise<void> {
  await removeToken();
  await removeUser();
}

/**
 * Сохранить локальную историю расчётов
 */
export async function saveLocalHistory(history: LocalCalculation[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LOCAL_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Ошибка сохранения истории:', error);
  }
}

/**
 * Получить локальную историю расчётов
 */
export async function getLocalHistory(): Promise<LocalCalculation[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.LOCAL_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Ошибка получения истории:', error);
    return [];
  }
}

/**
 * Добавить расчёт в локальную историю
 */
export async function addToLocalHistory(calculation: LocalCalculation): Promise<void> {
  const history = await getLocalHistory();
  // Добавляем в начало, чтобы новые были сверху
  history.unshift(calculation);
  // Храним максимум 50 записей
  if (history.length > 50) {
    history.pop();
  }
  await saveLocalHistory(history);
}

/**
 * Очистить локальную историю
 */
export async function clearLocalHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.LOCAL_HISTORY);
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
  }
}

/**
 * Генерация уникального ID для локальных расчётов
 */
export function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
