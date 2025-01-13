/// <reference types="vite/client" />

// Типы для Яндекс Метрики
interface Window {
  ym?: (
    counterId: number,
    method: string,
    ...args: unknown[]
  ) => void;
}
