// Página de catálogo completo de empleos.
import JobCatalog from '../components/JobCatalog';

export default function JobsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Empleos</h1>
      <p className="text-gray-500 mb-8">Todas las vacantes activas publicadas en la plataforma.</p>
      <JobCatalog />
    </div>
  );
}
