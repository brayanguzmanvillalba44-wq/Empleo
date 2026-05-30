// Catálogo de vacantes con búsqueda, filtros y paginación.
import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { jobApi } from '../services/api';
import { Job, PaginationMeta } from '../types';
import JobCard from './ui/JobCard';

export default function JobCatalog() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros controlados
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [modality, setModality] = useState('');
  const [page, setPage] = useState(1);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.getAll({ search, location, type, modality, page, limit: 9 });
      setJobs(res.data);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las vacantes');
    } finally {
      setLoading(false);
    }
  }, [search, location, type, modality, page]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Al cambiar un filtro, volvemos a la página 1.
  const onFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div>
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input pl-10"
              placeholder="Buscar por título o descripción..."
              value={search}
              onChange={(e) => onFilterChange(setSearch)(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input pl-10"
              placeholder="Ubicación (ej. Huauchinango)"
              value={location}
              onChange={(e) => onFilterChange(setLocation)(e.target.value)}
            />
          </div>
          <select className="input" value={type} onChange={(e) => onFilterChange(setType)(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="FULL_TIME">Tiempo completo</option>
            <option value="PART_TIME">Medio tiempo</option>
            <option value="CONTRACT">Contrato</option>
            <option value="FREELANCE">Freelance</option>
            <option value="INTERNSHIP">Prácticas</option>
          </select>
          <select className="input" value={modality} onChange={(e) => onFilterChange(setModality)(e.target.value)}>
            <option value="">Todas las modalidades</option>
            <option value="ONSITE">Presencial</option>
            <option value="REMOTE">Remoto</option>
            <option value="HYBRID">Híbrido</option>
          </select>
        </div>
      </div>

      {/* Estados de carga / error / vacío */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando vacantes...
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-2 justify-center py-20 text-red-600">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No se encontraron vacantes con esos criterios.
        </div>
      )}

      {/* Lista de vacantes */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Paginación */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                className="btn-secondary text-sm disabled:opacity-40 flex items-center gap-1"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {meta.page} de {meta.totalPages}
              </span>
              <button
                className="btn-secondary text-sm disabled:opacity-40 flex items-center gap-1"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
