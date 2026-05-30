// Tipos compartidos del frontend.

export type Role = 'ADMIN' | 'CLIENT';

// Usuario autenticado (admin o cliente). Campos opcionales según el rol.
export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  name?: string; // admin
  firstName?: string; // cliente
  lastName?: string; // cliente
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills?: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills?: string;
  createdAt?: string;
  _count?: { applications: number };
}

export interface Job {
  id: number;
  adminId: number;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location: string;
  type: string;
  modality: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status: string;
  category?: string;
  tags?: string;
  createdAt: string;
  admin?: Admin;
  _count?: { applications: number };
}

export interface Application {
  id: number;
  jobId: number;
  clientId: number;
  status: string;
  coverLetter?: string;
  createdAt: string;
  job?: Partial<Job> & { admin?: { name: string } };
  client?: Partial<Client>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  type?: string;
  modality?: string;
  page?: number;
  limit?: number;
}

// Datos para crear/editar una vacante (formulario del admin).
export interface JobInput {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location: string;
  type: string;
  modality: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status?: string;
  category?: string;
  tags?: string;
}
