import { Response, NextFunction } from 'express';
import { clientService } from '../services/clientService';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

export const clientController = {
  // GET /clients  (admin) -> lista de clientes registrados
  async list(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clients = await clientService.listClients();
      res.status(200).json({ success: true, data: clients } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // GET /clients/profile  (cliente) -> su propio perfil
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const client = await clientService.getProfile(req.user!.id);
      res.status(200).json({ success: true, data: client } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // PUT /clients/profile  (cliente) -> actualizar perfil
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const client = await clientService.updateProfile(req.user!.id, req.body);
      res.status(200).json({ success: true, data: client, message: 'Perfil actualizado exitosamente' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};
