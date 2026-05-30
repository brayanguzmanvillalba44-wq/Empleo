import bcrypt from 'bcryptjs';
import { adminRepository } from '../repositories/adminRepository';
import { clientRepository } from '../repositories/clientRepository';
import { generateToken, TokenPayload } from '../config/auth';
import { AppError } from '../middleware/errorHandler';

export const authService = {
  // Registro de CLIENTE (los administradores se crean por seed/manualmente).
  async registerClient(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    // El email no puede existir ni como admin ni como cliente.
    const existsAdmin = await adminRepository.findByEmail(data.email);
    const existsClient = await clientRepository.findByEmail(data.email);
    if (existsAdmin || existsClient) {
      throw new AppError('El email ya está registrado', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const client = await clientRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });

    const token = generateToken({ id: client.id, email: client.email, role: 'CLIENT' });
    return { token, user: { ...client, role: 'CLIENT' as const } };
  },

  // Login unificado: busca primero como administrador, luego como cliente.
  async login(email: string, password: string) {
    const admin = await adminRepository.findByEmail(email);
    if (admin) {
      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) throw new AppError('Credenciales inválidas', 401);

      const token = generateToken({ id: admin.id, email: admin.email, role: 'ADMIN' });
      return {
        token,
        user: { id: admin.id, name: admin.name, email: admin.email, role: 'ADMIN' as const },
      };
    }

    const client = await clientRepository.findByEmail(email);
    if (client) {
      const ok = await bcrypt.compare(password, client.password);
      if (!ok) throw new AppError('Credenciales inválidas', 401);

      const token = generateToken({ id: client.id, email: client.email, role: 'CLIENT' });
      const { password: _pw, ...safe } = client;
      return { token, user: { ...safe, role: 'CLIENT' as const } };
    }

    throw new AppError('Credenciales inválidas', 401);
  },

  // Devuelve el perfil del usuario autenticado según su rol.
  async getProfile(payload: TokenPayload) {
    if (payload.role === 'ADMIN') {
      const admin = await adminRepository.findById(payload.id);
      if (!admin) throw new AppError('Administrador no encontrado', 404);
      return { ...admin, role: 'ADMIN' as const };
    }

    const client = await clientRepository.findById(payload.id);
    if (!client) throw new AppError('Cliente no encontrado', 404);
    return { ...client, role: 'CLIENT' as const };
  },
};
