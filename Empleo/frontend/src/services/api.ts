import {
  ApiResponse,
  Job,
  Client,
  Application,
  JobFilters,
  PaginationMeta,
  JobInput,
} from '../types';

const API_BASE_URL = 'https://empleos-poo8.onrender.com/api/v1';
const TOKEN_KEY = 'empleo_token';

// --- Manejo del token en localStorage ---
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Función base: agrega el token (si existe) y maneja errores de forma uniforme.
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || payload?.message || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

function buildQuery(filters?: JobFilters): string {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// --- Autenticación ---
export const authApi = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    request<ApiResponse<{ token: string; user: any }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<ApiResponse<{ token: string; user: any }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  profile: () => request<ApiResponse<any>>('/auth/profile'),
};

// --- Vacantes ---
export const jobApi = {
  // Catálogo público (sólo activas)
  getAll: (filters?: JobFilters) =>
    request<ApiResponse<Job[]>>(`/jobs${buildQuery(filters)}`),

  // Listado para el admin (incluye cerradas)
  getManaged: (filters?: JobFilters) =>
    request<ApiResponse<Job[]>>(`/jobs/manage${buildQuery(filters)}`),

  getById: (id: number) => request<ApiResponse<Job>>(`/jobs/${id}`),

  create: (data: JobInput) =>
    request<ApiResponse<Job>>('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Partial<JobInput>) =>
    request<ApiResponse<Job>>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  remove: (id: number) =>
    request<ApiResponse<{ message: string }>>(`/jobs/${id}`, { method: 'DELETE' }),
};

// --- Clientes ---
export const clientApi = {
  // Lista de clientes registrados (admin)
  list: () => request<ApiResponse<Client[]>>('/clients'),

  // Perfil del cliente autenticado
  getProfile: () => request<ApiResponse<Client>>('/clients/profile'),

  updateProfile: (data: Partial<Client>) =>
    request<ApiResponse<Client>>('/clients/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// --- Postulaciones ---
export const applicationApi = {
  apply: (jobId: number, data: { coverLetter?: string }) =>
    request<ApiResponse<Application>>(`/applications/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  myApplications: () => request<ApiResponse<Application[]>>('/applications/my-applications'),

  all: () => request<ApiResponse<Application[]>>('/applications'),

  byJob: (jobId: number) =>
    request<ApiResponse<Application[]>>(`/applications/jobs/${jobId}/applicants`),

  updateStatus: (id: number, status: string) =>
    request<ApiResponse<Application>>(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  withdraw: (id: number) =>
    request<ApiResponse<{ message: string }>>(`/applications/${id}`, { method: 'DELETE' }),
};

export type { PaginationMeta };
