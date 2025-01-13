import type { CalculateResult } from '../types';

interface ResultCardProps {
  result: CalculateResult;
}

/**
 * Карточка с результатом расчёта
 */
export default function ResultCard({ result }: ResultCardProps) {
  // Названия категорий
  const categoryNames = {
    junior: 'Младшие (7-10 лет)',
    middle: 'Средние (11-14 лет)',
    senior: 'Старшие (15-17 лет)',
    staff: 'Персонал (18+)',
  };

  return (
    <div className="bg-gradient-to-br from-water-500 to-water-700 rounded-xl shadow-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Результат расчёта
      </h2>

      {/* Общий результат */}
      <div className="bg-white/20 rounded-lg p-4 mb-4 text-center">
        <div className="text-4xl font-bold">
          {result.total_water.toFixed(1)} л
        </div>
        <div className="text-water-100 text-sm mt-1">
          Общая дневная норма на {result.total_people} чел.
        </div>
      </div>

      {/* Детализация по группам */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(result.breakdown).map(([key, data]) => (
          <div key={key} className="bg-white/10 rounded-lg p-3">
            <div className="text-lg font-semibold">
              {data.subtotal.toFixed(1)} л
            </div>
            <div className="text-water-200 text-xs">
              {categoryNames[key as keyof typeof categoryNames]}
            </div>
            <div className="text-water-300 text-xs">
              {data.count} чел. × {data.norm} л
            </div>
          </div>
        ))}
      </div>

      {/* Коэффициенты */}
      <div className="bg-white/10 rounded-lg p-3 mb-3">
        <div className="text-sm text-water-200 mb-1">Применённые коэффициенты:</div>
        <div className="flex justify-around text-xs">
          <span>Сезон: ×{result.coefficients.season}</span>
          <span>Активность: ×{result.coefficients.activity}</span>
        </div>
      </div>

      {/* Базовый расчёт */}
      <div className="text-center text-water-200 text-sm">
        Базовое потребление: {result.base_total.toFixed(1)} л
      </div>
    </div>
  );
}
