import { applicationRepository } from '../repositories/applicationRepository';
import { jobRepository } from '../repositories/jobRepository';
import { AppError } from '../middleware/errorHandler';

export const applicationService = {
  // Un cliente se postula a una vacante.
  async applyToJob(clientId: number, jobId: number, data: { coverLetter?: string }) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError('Vacante no encontrada', 404);
    if (job.status !== 'ACTIVE') throw new AppError('Esta vacante ya no está activa', 400);

    const existing = await applicationRepository.findByJobAndClient(jobId, clientId);
    if (existing) throw new AppError('Ya te has postulado a esta vacante', 409);

    return applicationRepository.create({ jobId, clientId, coverLetter: data.coverLetter });
  },

  // Postulaciones del cliente autenticado.
  getClientApplications(clientId: number) {
    return applicationRepository.findByClient(clientId);
  },

  // Postulantes de una vacante (admin).
  async getJobApplications(jobId: number) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError('Vacante no encontrada', 404);
    return applicationRepository.findByJob(jobId);
  },

  // Todas las postulaciones (admin).
  getAllApplications() {
    return applicationRepository.findAll();
  },

  // El admin cambia el estado de una postulación.
  async updateStatus(applicationId: number, status: string) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw new AppError('Postulación no encontrada', 404);
    return applicationRepository.update(applicationId, { status });
  },

  // El cliente retira su propia postulación.
  async withdraw(applicationId: number, clientId: number) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw new AppError('Postulación no encontrada', 404);
    if (application.clientId !== clientId) {
      throw new AppError('No autorizado para retirar esta postulación', 403);
    }
    await applicationRepository.delete(applicationId);
    return { message: 'Postulación retirada exitosamente' };
  },
};
