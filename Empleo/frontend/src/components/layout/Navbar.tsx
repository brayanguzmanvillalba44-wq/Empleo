import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Menu,
  X,
  LayoutDashboard,
  Search,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cierra el menú móvil al navegar.
  useEffect(() => setIsOpen(false), [location]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Enlaces visibles para todos.
  const navLinks = [
    { path: '/', label: 'Inicio', icon: Search },
    { path: '/jobs', label: 'Empleos', icon: Briefcase },
  ];

  // Ruta del panel según el rol.
  const panelPath = isAdmin ? '/admin' : '/panel';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Trabajo</span>
              <span className="gradient-text">TEC</span>
            </span>
          </Link>

          {/* Navegación escritorio */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to={panelPath}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(panelPath)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {isAdmin ? 'Panel admin' : 'Mi panel'}
              </Link>
            )}
          </div>

          {/* Acciones (escritorio) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-500">
                  {user?.name || user?.firstName || user?.email}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Iniciar sesión
                </Link>
                <Link to="/register" className="btn-primary text-sm flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated && (
            <Link
              to={panelPath}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              {isAdmin ? 'Panel admin' : 'Mi panel'}
            </Link>
          )}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-center py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            ) : (
              <>
                <Link to="/login" className="w-full block text-center py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="w-full btn-primary text-sm text-center block">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
