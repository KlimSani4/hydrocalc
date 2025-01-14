import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '../api/client';
import type { User, LoginData, RegisterData, AuthContextType } from '../types';

// Создаём контекст авторизации
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Провайдер контекста авторизации
 * Управляет состоянием пользователя и токена
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При загрузке проверяем сохранённые данные
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // Если данные повреждены - очищаем
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Вход в систему
   */
  const login = async (data: LoginData) => {
    const response = await loginUser(data.email, data.password);

    // Сохраняем токен
    setToken(response.access_token);
    localStorage.setItem('token', response.access_token);

    // Создаём объект пользователя (email из формы)
    const userData: User = { id: 0, email: data.email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Регистрация нового пользователя
   */
  const register = async (data: RegisterData) => {
    const response = await registerUser(data);

    // После регистрации сразу авторизуем
    setToken(response.access_token);
    localStorage.setItem('token', response.access_token);

    const userData: User = { id: 0, email: data.email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Выход из системы
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
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
