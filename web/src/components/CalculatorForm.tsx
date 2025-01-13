import { useState } from 'react';
import type { CalculateRequest, Season, Activity } from '../types';

interface CalculatorFormProps {
  onSubmit: (data: CalculateRequest) => void;
  isLoading: boolean;
}

/**
 * Форма калькулятора нормы воды
 */
export default function CalculatorForm({ onSubmit, isLoading }: CalculatorFormProps) {
  const [juniorCount, setJuniorCount] = useState(0);
  const [middleCount, setMiddleCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [season, setSeason] = useState<Season>('cold');
  const [activity, setActivity] = useState<Activity>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      junior_count: juniorCount,
      middle_count: middleCount,
      senior_count: seniorCount,
      staff_count: staffCount,
      season,
      activity,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Группы людей */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Количество людей по группам
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Junior (1-3 курс)
            </label>
            <input
              type="number"
              min="0"
              value={juniorCount}
              onChange={(e) => setJuniorCount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Middle (4-5 курс)
            </label>
            <input
              type="number"
              min="0"
              value={middleCount}
              onChange={(e) => setMiddleCount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senior (магистратура)
            </label>
            <input
              type="number"
              min="0"
              value={seniorCount}
              onChange={(e) => setSeniorCount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff (преподаватели)
            </label>
            <input
              type="number"
              min="0"
              value={staffCount}
              onChange={(e) => setStaffCount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
            />
          </div>
        </div>
      </div>

      {/* Сезон */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Сезон
        </h3>

        <div className="flex space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="season"
              value="cold"
              checked={season === 'cold'}
              onChange={() => setSeason('cold')}
              className="w-4 h-4 text-water-600 focus:ring-water-500"
            />
            <span className="ml-2 text-gray-700">
              Холодный (осень-зима)
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="season"
              value="warm"
              checked={season === 'warm'}
              onChange={() => setSeason('warm')}
              className="w-4 h-4 text-water-600 focus:ring-water-500"
            />
            <span className="ml-2 text-gray-700">
              Тёплый (весна-лето)
            </span>
          </label>
        </div>
      </div>

      {/* Активность */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Уровень активности
        </h3>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="activity"
              value="normal"
              checked={activity === 'normal'}
              onChange={() => setActivity('normal')}
              className="w-4 h-4 text-water-600 focus:ring-water-500"
            />
            <span className="ml-2 text-gray-700">
              Обычная
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="activity"
              value="sport"
              checked={activity === 'sport'}
              onChange={() => setActivity('sport')}
              className="w-4 h-4 text-water-600 focus:ring-water-500"
            />
            <span className="ml-2 text-gray-700">
              Спорт
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="activity"
              value="trip"
              checked={activity === 'trip'}
              onChange={() => setActivity('trip')}
              className="w-4 h-4 text-water-600 focus:ring-water-500"
            />
            <span className="ml-2 text-gray-700">
              Поход
            </span>
          </label>
        </div>
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-water-600 hover:bg-water-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Расчёт...' : 'Рассчитать норму воды'}
      </button>
    </form>
  );
}
