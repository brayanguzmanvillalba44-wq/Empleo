import prisma from '../config/database';

// Datos del cliente que se muestran al administrador (sin contraseña).
const clientSelect = {
  select: { id: true, firstName: true, lastName: true, email: true, phone: true, headline: true },
};

// Acceso a datos de la tabla "applications".
export const applicationRepository = {
  findById(id: number) {
    return prisma.application.findUnique({
      where: { id },
      include: { client: clientSelect, job: true },
    });
  },

  findByClient(clientId: number) {
    return prisma.application.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: { job: { include: { admin: { select: { name: true } } } } },
    });
  },

  findByJob(jobId: number) {
    return prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      include: { client: clientSelect },
    });
  },

  // Todas las postulaciones (vista global del administrador).
  findAll() {
    return prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: clientSelect,
        job: { select: { id: true, title: true } },
      },
    });
  },

  findByJobAndClient(jobId: number, clientId: number) {
    return prisma.application.findUnique({
      where: { jobId_clientId: { jobId, clientId } },
    });
  },

  create(data: { jobId: number; clientId: number; coverLetter?: string }) {
    return prisma.application.create({
      data,
      include: { job: { select: { id: true, title: true } } },
    });
  },

  update(id: number, data: Record<string, unknown>) {
    return prisma.application.update({
      where: { id },
      data,
      include: { client: clientSelect, job: { select: { id: true, title: true } } },
    });
  },

  delete(id: number) {
    return prisma.application.delete({ where: { id } });
  },
};
