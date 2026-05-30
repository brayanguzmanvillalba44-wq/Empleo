import { Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

export const authController = {
  // POST /auth/register  -> registro de cliente
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerClient(req.body);
      const response: ApiResponse = { success: true, data: result, message: 'Registro exitoso' };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /auth/login  -> login de admin o cliente
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Inicio de sesión exitoso',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /auth/profile  -> perfil del usuario autenticado
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.getProfile(req.user!);
      const response: ApiResponse = { success: true, data: result };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
