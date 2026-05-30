import prisma from '../config/database';

// Acceso a datos de la tabla "admins".
export const adminRepository = {
  findByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.admin.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  },

  create(data: { name: string; email: string; password: string }) {
    return prisma.admin.create({ data });
  },
};
