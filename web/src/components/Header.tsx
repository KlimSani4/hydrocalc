import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Шапка сайта с навигацией
 */
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-water-600 text-white shadow-lg">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
            <span className="text-lg sm:text-xl font-bold">HydroCalc</span>
          </Link>

          {/* Навигация */}
          <nav className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base">
            <Link
              to="/"
              className="hover:text-water-200 transition-colors hidden sm:inline"
            >
              Калькулятор
            </Link>

            {user ? (
              <>
                <Link
                  to="/history"
                  className="hover:text-water-200 transition-colors"
                >
                  История
                </Link>
                <span className="text-water-200 text-xs sm:text-sm hidden md:inline truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-water-700 hover:bg-water-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors text-sm"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-water-200 transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-water-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-water-100 transition-colors text-sm"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
