import prisma from '../config/database';

// Campos públicos del cliente (sin la contraseña).
const publicSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  location: true,
  headline: true,
  summary: true,
  skills: true,
  createdAt: true,
};

// Acceso a datos de la tabla "clients".
export const clientRepository = {
  findByEmail(email: string) {
    return prisma.client.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.client.findUnique({ where: { id }, select: publicSelect });
  },

  // Lista todos los clientes registrados (para el panel del administrador).
  findAll() {
    return prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        ...publicSelect,
        _count: { select: { applications: true } },
      },
    });
  },

  create(data: { firstName: string; lastName: string; email: string; password: string }) {
    return prisma.client.create({ data, select: publicSelect });
  },

  update(id: number, data: Record<string, unknown>) {
    return prisma.client.update({ where: { id }, data, select: publicSelect });
  },
};
