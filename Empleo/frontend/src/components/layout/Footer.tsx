import { Link } from 'react-router-dom';
import { Briefcase, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Marca */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Trabajo<span className="text-primary-400">TEC</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma de bolsa de trabajo donde encuentras vacantes y te postulas en minutos.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">Inicio</Link></li>
              <li><Link to="/jobs" className="text-gray-400 hover:text-primary-400 transition-colors">Empleos</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors">Iniciar sesión</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors">Registrarse</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>trabajosTec34@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>Huauchinango, Puebla, México</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center sm:text-left">
          <p className="text-gray-500 text-sm">
            © {currentYear} Encuentra el trabajo que necesitas.
          </p>
        </div>
      </div>
    </footer>
  );
}
