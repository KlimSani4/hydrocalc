import type { CalculateResult } from '../types';

interface ResultCardProps {
  result: CalculateResult;
}

/**
 * Карточка с результатом расчёта
 */
export default function ResultCard({ result }: ResultCardProps) {
  // Названия для отображения
  const seasonNames = {
    cold: 'Холодный сезон',
    warm: 'Тёплый сезон',
  };

  const activityNames = {
    normal: 'Обычная активность',
    sport: 'Спорт',
    trip: 'Поход',
  };

  return (
    <div className="bg-gradient-to-br from-water-500 to-water-700 rounded-xl shadow-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Результат расчёта
      </h2>

      {/* Общий результат */}
      <div className="bg-white/20 rounded-lg p-4 mb-4 text-center">
        <div className="text-4xl font-bold">
          {result.total_liters.toFixed(1)} л
        </div>
        <div className="text-water-100 text-sm mt-1">
          Общая дневная норма
        </div>
      </div>

      {/* Детализация по группам */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-lg font-semibold">
            {result.junior_liters.toFixed(1)} л
          </div>
          <div className="text-water-200 text-xs">Junior</div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-lg font-semibold">
            {result.middle_liters.toFixed(1)} л
          </div>
          <div className="text-water-200 text-xs">Middle</div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-lg font-semibold">
            {result.senior_liters.toFixed(1)} л
          </div>
          <div className="text-water-200 text-xs">Senior</div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-lg font-semibold">
            {result.staff_liters.toFixed(1)} л
          </div>
          <div className="text-water-200 text-xs">Staff</div>
        </div>
      </div>

      {/* Параметры расчёта */}
      <div className="text-center text-water-200 text-sm">
        {seasonNames[result.season]} | {activityNames[result.activity]}
      </div>
    </div>
  );
}
