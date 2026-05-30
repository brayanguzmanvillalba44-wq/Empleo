// Utilidades de formato y etiquetas reutilizables en toda la app.

export const jobTypeLabel: Record<string, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Medio tiempo',
  CONTRACT: 'Contrato',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Prácticas',
};

export const modalityLabel: Record<string, string> = {
  ONSITE: 'Presencial',
  REMOTE: 'Remoto',
  HYBRID: 'Híbrido',
};

export const statusLabel: Record<string, string> = {
  PENDING: 'Pendiente',
  REVIEWING: 'En revisión',
  INTERVIEW: 'Entrevista',
  REJECTED: 'Rechazado',
  HIRED: 'Contratado',
};

// Clases de color (Tailwind) para cada estado de postulación.
export const statusColor: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  REVIEWING: 'bg-blue-50 text-blue-700',
  INTERVIEW: 'bg-purple-50 text-purple-700',
  REJECTED: 'bg-red-50 text-red-700',
  HIRED: 'bg-green-50 text-green-700',
};

export const APPLICATION_STATUSES = [
  'PENDING',
  'REVIEWING',
  'INTERVIEW',
  'REJECTED',
  'HIRED',
] as const;

// Da formato a un rango salarial.
export function formatSalary(min?: number, max?: number, currency = 'MXN'): string {
  if (!min && !max) return 'Salario no especificado';
  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${currency}`;
  return `${fmt((min || max)!)} ${currency}`;
}

export function formatDate(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
