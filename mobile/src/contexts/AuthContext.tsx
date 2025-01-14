/**
 * Контекст авторизации
 * Управляет состоянием пользователя и токена
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '../services/api';
import {
  saveToken,
  saveUser,
  getToken,
  getUser,
  clearAuth
} from '../services/storage';
import type { User, LoginData, RegisterData, AuthContextType } from '../types';

// Создаём контекст
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Провайдер контекста авторизации
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При запуске приложения проверяем сохранённые данные
  useEffect(() => {
    loadStoredAuth();
  }, []);

  /**
   * Загрузка сохранённых данных авторизации
   */
  const loadStoredAuth = async () => {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных авторизации:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Вход в систему
   */
  const login = async (data: LoginData) => {
    const response = await loginUser(data);

    // Сохраняем токен
    await saveToken(response.access_token);
    setToken(response.access_token);

    // Создаём объект пользователя
    const userData: User = { id: 0, email: data.email };
    await saveUser(userData);
    setUser(userData);
  };

  /**
   * Регистрация нового пользователя
   */
  const register = async (data: RegisterData) => {
    const response = await registerUser(data);

    // После регистрации сразу авторизуем
    await saveToken(response.access_token);
    setToken(response.access_token);

    const userData: User = { id: 0, email: data.email };
    await saveUser(userData);
    setUser(userData);
  };

  /**
   * Выход из системы
   */
  const logout = async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Хук для использования контекста авторизации
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
