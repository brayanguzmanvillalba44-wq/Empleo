import { Response, NextFunction } from 'express';
import { applicationService } from '../services/applicationService';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

export const applicationController = {
  // POST /applications/jobs/:jobId/apply  (cliente)
  async apply(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const jobId = parseInt(req.params.jobId, 10);
      const application = await applicationService.applyToJob(req.user!.id, jobId, req.body);
      res.status(201).json({ success: true, data: application, message: 'Postulación enviada exitosamente' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // GET /applications/my-applications  (cliente)
  async getMyApplications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applications = await applicationService.getClientApplications(req.user!.id);
      res.status(200).json({ success: true, data: applications } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // GET /applications  (admin) -> todas las postulaciones
  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applications = await applicationService.getAllApplications();
      res.status(200).json({ success: true, data: applications } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // GET /applications/jobs/:jobId/applicants  (admin)
  async getJobApplications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const jobId = parseInt(req.params.jobId, 10);
      const applications = await applicationService.getJobApplications(jobId);
      res.status(200).json({ success: true, data: applications } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // PUT /applications/:id/status  (admin)
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = parseInt(req.params.id, 10);
      const application = await applicationService.updateStatus(applicationId, req.body.status);
      res.status(200).json({ success: true, data: application, message: 'Estado actualizado' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /applications/:id  (cliente) -> retirar postulación
  async withdraw(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicationId = parseInt(req.params.id, 10);
      const result = await applicationService.withdraw(applicationId, req.user!.id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};
