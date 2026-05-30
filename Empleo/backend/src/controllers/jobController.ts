import { Response, NextFunction } from 'express';
import { jobService } from '../services/jobService';
import { QueryParams, ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

export const jobController = {
  // GET /jobs  (público) -> sólo vacantes activas
  async getAllJobs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await jobService.getAllJobs(req.query as QueryParams);
      res.status(200).json({ success: true, data: result.jobs, meta: result.meta } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // GET /jobs/manage  (admin) -> incluye también vacantes cerradas
  async getManagedJobs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await jobService.getAllJobs(req.query as QueryParams, true);
      res.status(200).json({ success: true, data: result.jobs, meta: result.meta } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // GET /jobs/:id
  async getJobById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const job = await jobService.getJobById(parseInt(req.params.id, 10));
      res.status(200).json({ success: true, data: job } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // POST /jobs  (admin)
  async createJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const job = await jobService.createJob(req.user!.id, req.body);
      res.status(201).json({ success: true, data: job, message: 'Vacante creada exitosamente' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // PUT /jobs/:id  (admin)
  async updateJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const job = await jobService.updateJob(parseInt(req.params.id, 10), req.body);
      res.status(200).json({ success: true, data: job, message: 'Vacante actualizada exitosamente' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /jobs/:id  (admin)
  async deleteJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await jobService.deleteJob(parseInt(req.params.id, 10));
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};
