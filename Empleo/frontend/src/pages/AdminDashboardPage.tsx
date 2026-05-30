// Panel del administrador: gestionar vacantes (CRUD), ver clientes y postulaciones.
import { useEffect, useState } from 'react';
import {
  Briefcase,
  Users,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  MapPin,
} from 'lucide-react';
import { jobApi, clientApi, applicationApi } from '../services/api';
import { Job, Client, Application, JobInput } from '../types';
import {
  jobTypeLabel,
  modalityLabel,
  statusLabel,
  statusColor,
  formatSalary,
  formatDate,
  APPLICATION_STATUSES,
} from '../lib/format';
import { useAuth } from '../context/AuthContext';

type Tab = 'jobs' | 'clients' | 'applications';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('jobs');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Panel de administración</h1>
      <p className="text-gray-500 mb-8">Bienvenido, {user?.name || 'administrador'}.</p>

      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <TabButton active={tab === 'jobs'} onClick={() => setTab('jobs')} icon={<Briefcase className="w-4 h-4" />} label="Vacantes" />
        <TabButton active={tab === 'clients'} onClick={() => setTab('clients')} icon={<Users className="w-4 h-4" />} label="Clientes" />
        <TabButton active={tab === 'applications'} onClick={() => setTab('applications')} icon={<FileText className="w-4 h-4" />} label="Postulaciones" />
      </div>

      {tab === 'jobs' && <JobsManager />}
      {tab === 'clients' && <ClientsList />}
      {tab === 'applications' && <ApplicationsManager />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-800'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Centered({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex items-center justify-center gap-2 py-16 text-gray-500 ${className}`}>{children}</div>;
}

// ====================== VACANTES (CRUD) ======================
function JobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Job | null>(null); // vacante en edición
  const [creating, setCreating] = useState(false); // modal de creación

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.getManaged({ limit: 50 });
      setJobs(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vacantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm('¿Eliminar esta vacante? Esta acción no se puede deshacer.')) return;
    try {
      await jobApi.remove(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  };

  const closeModal = (reload: boolean) => {
    setCreating(false);
    setEditing(null);
    if (reload) load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{jobs.length} vacante(s)</p>
        <button onClick={() => setCreating(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva vacante
        </button>
      </div>

      {loading && <Centered><Loader2 className="w-6 h-6 animate-spin" /> Cargando...</Centered>}
      {error && !loading && <Centered className="text-red-600"><AlertCircle className="w-5 h-5" /> {error}</Centered>}

      {!loading && !error && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="card flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${job.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {job.status === 'ACTIVE' ? 'Activa' : 'Cerrada'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span>· {jobTypeLabel[job.type] || job.type}</span>
                  <span>· {modalityLabel[job.modality] || job.modality}</span>
                  <span>· {formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                  <span>· {job._count?.applications ?? 0} postulaciones</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setEditing(job)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Editar">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(job.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <Centered>No hay vacantes. Crea la primera.</Centered>}
        </div>
      )}

      {(creating || editing) && <JobFormModal job={editing} onClose={closeModal} />}
    </div>
  );
}

// Modal de formulario para crear/editar vacante.
const emptyForm: JobInput = {
  title: '',
  description: '',
  requirements: '',
  benefits: '',
  location: '',
  type: 'FULL_TIME',
  modality: 'ONSITE',
  salaryMin: undefined,
  salaryMax: undefined,
  currency: 'MXN',
  status: 'ACTIVE',
  category: '',
  tags: '',
};

function JobFormModal({ job, onClose }: { job: Job | null; onClose: (reload: boolean) => void }) {
  const isEdit = !!job;
  const [form, setForm] = useState<JobInput>(
    job
      ? {
          title: job.title,
          description: job.description,
          requirements: job.requirements || '',
          benefits: job.benefits || '',
          location: job.location,
          type: job.type,
          modality: job.modality,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          currency: job.currency || 'MXN',
          status: job.status,
          category: job.category || '',
          tags: job.tags || '',
        }
      : { ...emptyForm }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof JobInput, value: string | number | undefined) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const save = async () => {
    setError(null);
    if (!form.title || !form.description || !form.location) {
      setError('Título, descripción y ubicación son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      // Limpiamos cadenas vacías opcionales para no enviarlas vacías.
      const payload: JobInput = {
        ...form,
        requirements: form.requirements || undefined,
        benefits: form.benefits || undefined,
        category: form.category || undefined,
        tags: form.tags || undefined,
      };
      if (isEdit && job) {
        await jobApi.update(job.id, payload);
      } else {
        await jobApi.create(payload);
      }
      onClose(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la vacante');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Editar vacante' : 'Nueva vacante'}</h2>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Título *"><input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
          <Field label="Descripción *"><textarea className="input min-h-[100px]" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
          <Field label="Requisitos"><textarea className="input min-h-[70px]" value={form.requirements} onChange={(e) => set('requirements', e.target.value)} /></Field>
          <Field label="Beneficios"><textarea className="input min-h-[70px]" value={form.benefits} onChange={(e) => set('benefits', e.target.value)} /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Ubicación *"><input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} /></Field>
            <Field label="Categoría"><input className="input" value={form.category} onChange={(e) => set('category', e.target.value)} /></Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="FULL_TIME">Tiempo completo</option>
                <option value="PART_TIME">Medio tiempo</option>
                <option value="CONTRACT">Contrato</option>
                <option value="FREELANCE">Freelance</option>
                <option value="INTERNSHIP">Prácticas</option>
              </select>
            </Field>
            <Field label="Modalidad">
              <select className="input" value={form.modality} onChange={(e) => set('modality', e.target.value)}>
                <option value="ONSITE">Presencial</option>
                <option value="REMOTE">Remoto</option>
                <option value="HYBRID">Híbrido</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Salario mín.">
              <input type="number" className="input" value={form.salaryMin ?? ''} onChange={(e) => set('salaryMin', e.target.value ? Number(e.target.value) : undefined)} />
            </Field>
            <Field label="Salario máx.">
              <input type="number" className="input" value={form.salaryMax ?? ''} onChange={(e) => set('salaryMax', e.target.value ? Number(e.target.value) : undefined)} />
            </Field>
            <Field label="Moneda"><input className="input" value={form.currency} onChange={(e) => set('currency', e.target.value)} /></Field>
          </div>

          {isEdit && (
            <Field label="Estado">
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="ACTIVE">Activa</option>
                <option value="CLOSED">Cerrada</option>
              </select>
            </Field>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={() => onClose(false)} className="btn-secondary">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Guardar cambios' : 'Crear vacante'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================== CLIENTES ======================
function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await clientApi.list();
        setClients(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar clientes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Centered><Loader2 className="w-6 h-6 animate-spin" /> Cargando...</Centered>;
  if (error) return <Centered className="text-red-600"><AlertCircle className="w-5 h-5" /> {error}</Centered>;
  if (clients.length === 0) return <Centered>No hay clientes registrados.</Centered>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="py-3 pr-4 font-medium">Nombre</th>
            <th className="py-3 pr-4 font-medium">Email</th>
            <th className="py-3 pr-4 font-medium">Ubicación</th>
            <th className="py-3 pr-4 font-medium">Postulaciones</th>
            <th className="py-3 pr-4 font-medium">Registro</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 pr-4 font-medium text-gray-900">{c.firstName} {c.lastName}</td>
              <td className="py-3 pr-4 text-gray-600">{c.email}</td>
              <td className="py-3 pr-4 text-gray-600">{c.location || '—'}</td>
              <td className="py-3 pr-4 text-gray-600">{c._count?.applications ?? 0}</td>
              <td className="py-3 pr-4 text-gray-400">{formatDate(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ====================== POSTULACIONES ======================
function ApplicationsManager() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await applicationApi.all();
        setApps(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar postulaciones');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const changeStatus = async (id: number, status: string) => {
    try {
      await applicationApi.updateStatus(id, status);
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo actualizar el estado');
    }
  };

  if (loading) return <Centered><Loader2 className="w-6 h-6 animate-spin" /> Cargando...</Centered>;
  if (error) return <Centered className="text-red-600"><AlertCircle className="w-5 h-5" /> {error}</Centered>;
  if (apps.length === 0) return <Centered>No hay postulaciones todavía.</Centered>;

  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div key={app.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">{app.job?.title || `Vacante #${app.jobId}`}</p>
            <p className="text-sm text-gray-600">
              {app.client ? `${app.client.firstName} ${app.client.lastName} · ${app.client.email}` : `Cliente #${app.clientId}`}
            </p>
            {app.coverLetter && <p className="text-sm text-gray-500 mt-1 italic">“{app.coverLetter}”</p>}
            <p className="text-xs text-gray-400 mt-1">{formatDate(app.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-lg ${statusColor[app.status] || 'bg-gray-100 text-gray-600'}`}>
              {statusLabel[app.status] || app.status}
            </span>
            <select
              className="input py-2 text-sm w-auto"
              value={app.status}
              onChange={(e) => changeStatus(app.id, e.target.value)}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>{statusLabel[s]}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
