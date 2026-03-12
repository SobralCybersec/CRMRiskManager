import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { LayoutDashboard, Users, LogOut, Database, BarChart3, Moon, Sun } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const isAdmin = token ? jwtDecode(token).role === 'ADMIN' : false;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/customers', icon: Users },
    ...(isAdmin ? [
      { name: 'Admin', href: '/admin', icon: Database },
      { name: 'Estatísticas', href: '/statistics', icon: BarChart3 }
    ] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <nav className="glass-effect sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Logo />
              <NavigationLinks navigation={navigation} isActive={isActive} />
            </div>
            <div className="flex items-center gap-2">
              <DarkModeToggle isDark={isDark} toggle={toggle} />
              <LogoutButton onClick={logout} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in">
        {children}
      </main>
    </div>
  );
};

const Logo = () => (
  <div className="flex items-center gap-2">
    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
      Gerenciador de Risco CRM
    </h1>
  </div>
);

const NavigationLinks = ({ navigation, isActive }) => (
  <div className="hidden sm:flex sm:gap-2">
    {navigation.map((item) => (
      <NavLink key={item.name} item={item} isActive={isActive(item.href)} />
    ))}
  </div>
);

const NavLink = ({ item, isActive }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`${
        isActive
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
      } inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
    >
      <Icon className="h-4 w-4" />
      {item.name}
    </Link>
  );
};

const DarkModeToggle = ({ isDark, toggle }) => (
  <button
    onClick={toggle}
    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
    aria-label="Toggle dark mode"
  >
    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </button>
);

const LogoutButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200"
  >
    <LogOut className="h-4 w-4" />
    Sair
  </button>
);

export default Layout;