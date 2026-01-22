import { useState } from 'react';
import type { CalculateRequest, Season, Activity } from '../types';

interface CalculatorFormProps {
  onSubmit: (data: CalculateRequest) => void;
  isLoading: boolean;
}

/**
 * Парсит число из строки, убирая ведущие нули
 */
function parseCount(value: string): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
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
              Младшие (7-10 лет)
            </label>
            <input
              type="number"
              min="0"
              value={juniorCount || ''}
              onChange={(e) => setJuniorCount(parseCount(e.target.value))}
              onBlur={(e) => e.target.value = String(juniorCount)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Средние (11-14 лет)
            </label>
            <input
              type="number"
              min="0"
              value={middleCount || ''}
              onChange={(e) => setMiddleCount(parseCount(e.target.value))}
              onBlur={(e) => e.target.value = String(middleCount)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Старшие (15-17 лет)
            </label>
            <input
              type="number"
              min="0"
              value={seniorCount || ''}
              onChange={(e) => setSeniorCount(parseCount(e.target.value))}
              onBlur={(e) => e.target.value = String(seniorCount)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Персонал (18+ лет)
            </label>
            <input
              type="number"
              min="0"
              value={staffCount || ''}
              onChange={(e) => setStaffCount(parseCount(e.target.value))}
              onBlur={(e) => e.target.value = String(staffCount)}
              placeholder="0"
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
