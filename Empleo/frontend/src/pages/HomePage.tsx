// Página de inicio: hero + catálogo de vacantes.
import { Link } from 'react-router-dom';
import { Search, Briefcase, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import JobCatalog from '../components/JobCatalog';

export default function HomePage() {
  const { isAuthenticated, isClient } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Encuentra tu próximo empleo
          </h1>
          <p className="mt-5 text-lg text-primary-100 max-w-2xl mx-auto">
            Explora las vacantes publicadas y postúlate en minutos. Una plataforma simple y directa.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#vacantes" className="btn-secondary flex items-center gap-2">
              <Search className="w-4 h-4" /> Ver vacantes
            </a>
            {!isAuthenticated && (
              <Link to="/register" className="px-6 py-3 bg-white/15 hover:bg-white/25 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Crear cuenta
              </Link>
            )}
            {isClient && (
              <Link to="/panel" className="px-6 py-3 bg-white/15 hover:bg-white/25 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Mis postulaciones
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="vacantes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vacantes disponibles</h2>
        <p className="text-gray-500 mb-8">Filtra por palabra clave, ubicación, tipo o modalidad.</p>
        <JobCatalog />
      </section>
    </div>
  );
}
