import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reachGoal, GOALS } from '../utils/metrika';

/**
 * Страница регистрации
 */
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Проверка длины пароля
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password });
      reachGoal(GOALS.USER_REGISTERED);
      navigate('/');
    } catch (err: unknown) {
      // Обработка ошибок от сервера
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response;
        setError(response?.data?.detail || 'Ошибка при регистрации');
      } else {
        setError('Ошибка подключения к серверу');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Регистрация
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
              placeholder="example@mail.ru"
            />
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
              placeholder="Минимум 6 символов"
            />
          </div>

          {/* Подтверждение пароля */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
              placeholder="Повторите пароль"
            />
          </div>

          {/* Ошибка */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Кнопка регистрации */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-water-600 hover:bg-water-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        {/* Ссылка на вход */}
        <div className="mt-6 text-center text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-water-600 hover:text-water-700 font-medium">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
