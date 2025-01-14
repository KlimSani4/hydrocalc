import { useState } from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ResultCard from '../components/ResultCard';
import { calculateWater } from '../api/client';
import type { CalculateRequest, CalculateResult } from '../types';

/**
 * Главная страница с калькулятором
 */
export default function Home() {
  const [result, setResult] = useState<CalculateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (data: CalculateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calculateWater(data);
      setResult(response);
    } catch (err) {
      setError('Ошибка при расчёте. Попробуйте ещё раз.');
      console.error('Calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Калькулятор нормы воды
        </h1>
        <p className="text-gray-600">
          Рассчитайте дневную норму потребления воды для вашей группы
        </p>
      </div>

      {/* Форма калькулятора */}
      <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />

      {/* Ошибка */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Результат */}
      {result && (
        <div className="mt-8">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}
