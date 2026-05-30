import { clientRepository } from '../repositories/clientRepository';
import { AppError } from '../middleware/errorHandler';

export const clientService = {
  // Lista de clientes registrados (panel del administrador).
  listClients() {
    return clientRepository.findAll();
  },

  async getProfile(clientId: number) {
    const client = await clientRepository.findById(clientId);
    if (!client) throw new AppError('Cliente no encontrado', 404);
    return client;
  },

  // Actualiza el perfil del propio cliente. No permite cambiar email/contraseña aquí.
  async updateProfile(clientId: number, data: Record<string, unknown>) {
    const client = await clientRepository.findById(clientId);
    if (!client) throw new AppError('Cliente no encontrado', 404);
    return clientRepository.update(clientId, data);
  },
};
