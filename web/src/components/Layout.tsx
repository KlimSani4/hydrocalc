import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * Основной лейаут приложения
 * Содержит шапку и область для контента
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-water-800 text-water-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          HydroCalc &copy; 2025 - Калькулятор нормы воды
        </div>
      </footer>
    </div>
  );
}
