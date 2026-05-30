// Ruta protegida: exige sesión y, opcionalmente, un rol específico.
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: Role; // si se indica, sólo ese rol puede entrar
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  // Mientras se valida el token, no redirigimos.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige un rol y el usuario no lo tiene, lo mandamos a su panel.
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/panel'} replace />;
  }

  return <>{children}</>;
}
