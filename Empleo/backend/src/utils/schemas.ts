import { z } from 'zod';

// --- Autenticación ---
export const registerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// --- Perfil de cliente ---
export const updateClientSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    headline: z.string().optional(),
    summary: z.string().optional(),
    skills: z.string().optional(),
  })
  .strict();

// --- Vacantes ---
export const createJobSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  location: z.string().min(1, 'La ubicación es requerida'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']).default('FULL_TIME'),
  modality: z.enum(['ONSITE', 'REMOTE', 'HYBRID']).default('ONSITE'),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  currency: z.string().default('MXN'),
  status: z.enum(['ACTIVE', 'CLOSED']).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const jobQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  modality: z.string().optional(),
  minSalary: z.string().optional(),
  maxSalary: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// --- Postulaciones ---
export const createApplicationSchema = z.object({
  coverLetter: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'HIRED']),
});
