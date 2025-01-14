import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HistoryList from '../components/HistoryList';
import { getHistory } from '../api/client';
import type { HistoryItem } from '../types';

/**
 * Страница истории расчётов
 * Доступна только авторизованным пользователям
 */
export default function History() {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем историю только если пользователь авторизован
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setItems(data);
    } catch (err) {
      setError('Не удалось загрузить историю');
      console.error('History load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-water-600"></div>
      </div>
    );
  }

  // Редирект если не авторизован
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        История расчётов
      </h1>

      {/* Загрузка */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-water-600"></div>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
          <button
            onClick={loadHistory}
            className="ml-4 underline hover:no-underline"
          >
            Повторить
          </button>
        </div>
      )}

      {/* Список истории */}
      {!isLoading && !error && <HistoryList items={items} />}
    </div>
  );
}
