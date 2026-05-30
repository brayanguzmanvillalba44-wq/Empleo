// Detalle de una vacante + formulario de postulación (para clientes).
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Clock,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { jobApi, applicationApi } from '../services/api';
import { Job } from '../types';
import { jobTypeLabel, modalityLabel, formatSalary, formatDate } from '../lib/format';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isClient } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario de postulación
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await jobApi.getById(Number(id));
        setJob(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar la vacante');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    setApplyMessage(null);
    try {
      await applicationApi.apply(job.id, { coverLetter: coverLetter.trim() || undefined });
      setApplyMessage({ type: 'ok', text: '¡Postulación enviada con éxito!' });
      setCoverLetter('');
    } catch (err) {
      setApplyMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo enviar la postulación',
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{error || 'Vacante no encontrada'}</p>
        <Link to="/jobs" className="btn-primary inline-flex mt-6">Volver a empleos</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6 inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            {job.category && <p className="text-gray-500 mt-1">{job.category}</p>}
          </div>
          {job.status !== 'ACTIVE' && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">Cerrada</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1 text-sm text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4" /> {job.location}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-accent-700 bg-accent-50 px-3 py-1.5 rounded-lg">
            <DollarSign className="w-4 h-4" /> {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4" /> {jobTypeLabel[job.type] || job.type}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
            {modalityLabel[job.modality] || job.modality}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-3">Publicada el {formatDate(job.createdAt)}</p>

        <div className="mt-6 space-y-6">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
          </section>
          {job.requirements && (
            <section>
              <h2 className="font-semibold text-gray-900 mb-2">Requisitos</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</p>
            </section>
          )}
          {job.benefits && (
            <section>
              <h2 className="font-semibold text-gray-900 mb-2">Beneficios</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.benefits}</p>
            </section>
          )}
        </div>
      </div>

      {/* Postulación */}
      <div className="card mt-6">
        <h2 className="font-semibold text-gray-900 mb-4">Postularme a esta vacante</h2>

        {!isAuthenticated && (
          <p className="text-gray-600">
            Debes{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">iniciar sesión</Link>{' '}
            como cliente para postularte. ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">Regístrate</Link>.
          </p>
        )}

        {isAuthenticated && !isClient && (
          <p className="text-gray-600">Sólo los clientes pueden postularse a vacantes.</p>
        )}

        {isClient && job.status === 'ACTIVE' && (
          <div className="space-y-4">
            <textarea
              className="input min-h-[120px]"
              placeholder="Escribe una breve carta de presentación (opcional)..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            {applyMessage && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  applyMessage.type === 'ok' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {applyMessage.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {applyMessage.text}
              </div>
            )}
            <button onClick={handleApply} disabled={applying} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {applying ? 'Enviando...' : 'Enviar postulación'}
            </button>
          </div>
        )}

        {isClient && job.status !== 'ACTIVE' && (
          <p className="text-gray-600">Esta vacante ya no está activa.</p>
        )}
      </div>
    </div>
  );
}
