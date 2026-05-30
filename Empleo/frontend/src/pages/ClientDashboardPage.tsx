// Panel del cliente: ver sus postulaciones y editar su perfil.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, Trash2, AlertCircle, Loader2, CheckCircle, FileText } from 'lucide-react';
import { applicationApi, clientApi } from '../services/api';
import { Application, Client } from '../types';
import { statusLabel, statusColor, formatDate } from '../lib/format';
import { useAuth } from '../context/AuthContext';

type Tab = 'applications' | 'profile';

export default function ClientDashboardPage() {
  const { user, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('applications');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        Hola, {user?.firstName || 'cliente'}
      </h1>
      <p className="text-gray-500 mb-8">Gestiona tus postulaciones y tu perfil.</p>

      {/* Pestañas */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <TabButton active={tab === 'applications'} onClick={() => setTab('applications')} icon={<Briefcase className="w-4 h-4" />} label="Mis postulaciones" />
        <TabButton active={tab === 'profile'} onClick={() => setTab('profile')} icon={<User className="w-4 h-4" />} label="Mi perfil" />
      </div>

      {tab === 'applications' ? <MyApplications /> : <ProfileForm onSaved={refreshProfile} />}
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

// --- Lista de postulaciones del cliente ---
function MyApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationApi.myApplications();
      setApps(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar postulaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const withdraw = async (id: number) => {
    if (!confirm('¿Retirar esta postulación?')) return;
    try {
      await applicationApi.withdraw(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo retirar');
    }
  };

  if (loading) return <Centered><Loader2 className="w-6 h-6 animate-spin" /> Cargando...</Centered>;
  if (error) return <Centered className="text-red-600"><AlertCircle className="w-5 h-5" /> {error}</Centered>;

  if (apps.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        Aún no te has postulado a ninguna vacante.
        <div className="mt-4">
          <Link to="/jobs" className="btn-primary inline-flex">Explorar empleos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div key={app.id} className="card flex items-center justify-between gap-4">
          <div>
            <Link to={`/jobs/${app.jobId}`} className="font-semibold text-gray-900 hover:text-primary-600">
              {app.job?.title || `Vacante #${app.jobId}`}
            </Link>
            <p className="text-xs text-gray-400 mt-1">Postulado el {formatDate(app.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-lg ${statusColor[app.status] || 'bg-gray-100 text-gray-600'}`}>
              {statusLabel[app.status] || app.status}
            </span>
            <button onClick={() => withdraw(app.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Retirar postulación">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Formulario de perfil del cliente ---
function ProfileForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Client>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await clientApi.getProfile();
        setForm(res.data);
      } catch {
        // ignorar; el formulario quedará vacío
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (field: keyof Client) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Sólo enviamos los campos editables.
      await clientApi.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        location: form.location,
        headline: form.headline,
        summary: form.summary,
        skills: form.skills,
      });
      setMessage({ type: 'ok', text: 'Perfil actualizado correctamente.' });
      onSaved();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'No se pudo guardar' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Centered><Loader2 className="w-6 h-6 animate-spin" /> Cargando perfil...</Centered>;

  return (
    <div className="card max-w-2xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre"><input className="input" value={form.firstName || ''} onChange={update('firstName')} /></Field>
          <Field label="Apellido"><input className="input" value={form.lastName || ''} onChange={update('lastName')} /></Field>
        </div>
        <Field label="Email (no editable)"><input className="input bg-gray-100" value={form.email || ''} disabled /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono"><input className="input" value={form.phone || ''} onChange={update('phone')} /></Field>
          <Field label="Ubicación"><input className="input" value={form.location || ''} onChange={update('location')} /></Field>
        </div>
        <Field label="Titular profesional"><input className="input" value={form.headline || ''} onChange={update('headline')} placeholder="Ej. Desarrollador Frontend" /></Field>
        <Field label="Habilidades (separadas por comas)"><input className="input" value={form.skills || ''} onChange={update('skills')} placeholder="React, Node.js, SQL" /></Field>
        <Field label="Acerca de mí"><textarea className="input min-h-[100px]" value={form.summary || ''} onChange={update('summary')} /></Field>

        {message && (
          <div className={`flex items-center gap-2 text-sm ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {message.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
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

function Centered({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex items-center justify-center gap-2 py-16 text-gray-500 ${className}`}>{children}</div>;
}
