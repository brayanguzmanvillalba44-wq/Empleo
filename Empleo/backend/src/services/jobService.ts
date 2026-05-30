import { jobRepository } from '../repositories/jobRepository';
import { AppError } from '../middleware/errorHandler';
import { QueryParams } from '../types';
import { getPaginationParams, getSortParams } from '../utils/pagination';

export const jobService = {
  // Catálogo paginado con filtros. includeInactive lo usa el panel admin.
  async getAllJobs(query: QueryParams, includeInactive = false) {
    const { page, limit, skip } = getPaginationParams(query);
    const orderBy = getSortParams(query);

    const filters = {
      search: query.search,
      location: query.location,
      category: query.category,
      type: query.type,
      modality: query.modality,
      minSalary: query.minSalary ? parseInt(query.minSalary, 10) : undefined,
      maxSalary: query.maxSalary ? parseInt(query.maxSalary, 10) : undefined,
      includeInactive,
    };

    const { jobs, total } = await jobRepository.findAll(filters, skip, limit, orderBy);

    return {
      jobs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  },

  async getJobById(id: number) {
    const job = await jobRepository.findById(id);
    if (!job) throw new AppError('Vacante no encontrada', 404);
    return job;
  },

  // Crear vacante (sólo administradores). adminId proviene del token.
  createJob(adminId: number, data: any) {
    return jobRepository.create({ ...data, adminId });
  },

  async updateJob(jobId: number, data: any) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError('Vacante no encontrada', 404);
    return jobRepository.update(jobId, data);
  },

  async deleteJob(jobId: number) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError('Vacante no encontrada', 404);
    await jobRepository.delete(jobId);
    return { message: 'Vacante eliminada exitosamente' };
  },
};
