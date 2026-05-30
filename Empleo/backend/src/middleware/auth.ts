import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../config/auth';
import { AppError } from './errorHandler';

// Extiende Request para incluir el usuario autenticado decodificado del token.
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

// Middleware: verifica que la petición traiga un token JWT válido.
export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticación no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
}

// Middleware: restringe el acceso a los roles indicados (ej. authorize('ADMIN')).
export function authorize(...roles: Array<'ADMIN' | 'CLIENT'>) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('No autenticado', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('No autorizado para esta acción', 403));
    }
    next();
  };
}
