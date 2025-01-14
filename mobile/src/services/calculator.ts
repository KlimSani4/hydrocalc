/**
 * Локальный сервис расчёта воды (для оффлайн режима)
 * Формула: V = SUM(Ni * Vi) * Ks * Ka
 */

import type { CalculateRequest, CalculateResponse, Breakdown, CategoryBreakdown } from '../types';

// Нормы потребления воды (литры/сутки на человека)
const WATER_NORMS = {
  junior: 1.6,   // 7-10 лет
  middle: 1.85,  // 11-14 лет
  senior: 2.15,  // 15-17 лет
  staff: 2.25    // 18+ лет
};

// Коэффициенты сезона
const SEASON_COEFFICIENTS = {
  cold: 1.0,
  warm: 1.3
};

// Коэффициенты активности
const ACTIVITY_COEFFICIENTS = {
  normal: 1.0,
  sport: 1.5,
  trip: 2.0
};

/**
 * Локальный расчёт потребления воды
 * Используется когда нет интернета
 */
export function calculateWaterLocally(request: CalculateRequest): CalculateResponse {
  // Получаем коэффициенты
  const ks = SEASON_COEFFICIENTS[request.season];
  const ka = ACTIVITY_COEFFICIENTS[request.activity];

  // Считаем по категориям
  const juniorSubtotal = request.junior_count * WATER_NORMS.junior;
  const middleSubtotal = request.middle_count * WATER_NORMS.middle;
  const seniorSubtotal = request.senior_count * WATER_NORMS.senior;
  const staffSubtotal = request.staff_count * WATER_NORMS.staff;

  // Базовое потребление (без коэффициентов)
  const baseTotal = juniorSubtotal + middleSubtotal + seniorSubtotal + staffSubtotal;

  // Итоговое потребление с коэффициентами
  const totalWater = baseTotal * ks * ka;

  // Общее количество людей
  const totalPeople =
    request.junior_count +
    request.middle_count +
    request.senior_count +
    request.staff_count;

  // Формируем детализацию
  const breakdown: Breakdown = {
    junior: {
      count: request.junior_count,
      norm: WATER_NORMS.junior,
      subtotal: Math.round(juniorSubtotal * 100) / 100
    },
    middle: {
      count: request.middle_count,
      norm: WATER_NORMS.middle,
      subtotal: Math.round(middleSubtotal * 100) / 100
    },
    senior: {
      count: request.senior_count,
      norm: WATER_NORMS.senior,
      subtotal: Math.round(seniorSubtotal * 100) / 100
    },
    staff: {
      count: request.staff_count,
      norm: WATER_NORMS.staff,
      subtotal: Math.round(staffSubtotal * 100) / 100
    }
  };

  return {
    total_water: Math.round(totalWater * 100) / 100,
    base_total: Math.round(baseTotal * 100) / 100,
    breakdown,
    coefficients: { season: ks, activity: ka },
    total_people: totalPeople
  };
}

/**
 * Получить описание сезона на русском
 */
export function getSeasonLabel(season: string): string {
  return season === 'cold' ? 'Холодный' : 'Тёплый';
}

/**
 * Получить описание активности на русском
 */
export function getActivityLabel(activity: string): string {
  switch (activity) {
    case 'normal': return 'Обычная';
    case 'sport': return 'Спорт';
    case 'trip': return 'Поход';
    default: return activity;
  }
}
