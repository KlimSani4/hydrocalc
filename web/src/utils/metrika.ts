/**
 * Утилиты для работы с Яндекс Метрикой
 */

// ID счётчика из переменных окружения
export const METRIKA_ID = import.meta.env.VITE_METRIKA_ID
  ? Number(import.meta.env.VITE_METRIKA_ID)
  : null;

// Названия целей для отслеживания
export const GOALS = {
  CALCULATION_CREATED: 'calculation_created',
  USER_REGISTERED: 'user_registered',
  EXPORT_PDF: 'export_pdf',
} as const;

/**
 * Инициализация счётчика Яндекс Метрики
 */
export const initMetrika = (): void => {
  if (METRIKA_ID && window.ym) {
    window.ym(METRIKA_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }
};

/**
 * Отправляет достижение цели в Яндекс Метрику
 * @param goal - название цели
 */
export const reachGoal = (goal: string): void => {
  if (METRIKA_ID && window.ym) {
    window.ym(METRIKA_ID, 'reachGoal', goal);
  }
};
