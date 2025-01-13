import type { HistoryItem } from '../types';

interface HistoryListProps {
  items: HistoryItem[];
}

/**
 * Список истории расчётов
 */
export default function HistoryList({ items }: HistoryListProps) {
  // Названия для отображения
  const seasonNames = {
    cold: 'Холодный',
    warm: 'Тёплый',
  };

  const activityNames = {
    normal: 'Обычная',
    sport: 'Спорт',
    trip: 'Поход',
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p>История расчётов пуста</p>
        <p className="text-sm mt-1">Сделайте первый расчёт на главной странице</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            {/* Результат */}
            <div>
              <div className="text-2xl font-bold text-water-600">
                {item.total_liters.toFixed(1)} л
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(item.created_at)}
              </div>
            </div>

            {/* Параметры */}
            <div className="text-right text-sm">
              <div className="text-gray-600">
                {seasonNames[item.season]} | {activityNames[item.activity]}
              </div>
            </div>
          </div>

          {/* Группы */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
            {item.junior_count > 0 && (
              <span className="bg-water-100 text-water-700 px-2 py-1 rounded">
                Junior: {item.junior_count}
              </span>
            )}
            {item.middle_count > 0 && (
              <span className="bg-water-100 text-water-700 px-2 py-1 rounded">
                Middle: {item.middle_count}
              </span>
            )}
            {item.senior_count > 0 && (
              <span className="bg-water-100 text-water-700 px-2 py-1 rounded">
                Senior: {item.senior_count}
              </span>
            )}
            {item.staff_count > 0 && (
              <span className="bg-water-100 text-water-700 px-2 py-1 rounded">
                Staff: {item.staff_count}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
