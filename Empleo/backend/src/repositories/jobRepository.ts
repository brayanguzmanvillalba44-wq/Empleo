import prisma from '../config/database';

// Datos del administrador que se exponen junto a la vacante.
const adminSelect = { select: { id: true, name: true, email: true } };

// Acceso a datos de la tabla "jobs".
export const jobRepository = {
  findById(id: number) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        admin: adminSelect,
        _count: { select: { applications: true } },
      },
    });
  },

  // Búsqueda con filtros, paginación y orden (catálogo público).
  async findAll(filters: any, skip: number, take: number, orderBy: any) {
    const where: any = {};

    // Por defecto sólo se muestran vacantes activas en el catálogo público.
    if (filters.includeInactive !== true) {
      where.status = 'ACTIVE';
    }

    if (filters.search) {
      // SQLite no soporta `mode: "insensitive"`, usamos coincidencia parcial.
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }
    if (filters.location) where.location = { contains: filters.location };
    if (filters.category) where.category = { equals: filters.category };
    if (filters.type) where.type = filters.type;
    if (filters.modality) where.modality = filters.modality;
    if (filters.minSalary !== undefined) where.salaryMin = { gte: filters.minSalary };
    if (filters.maxSalary !== undefined) where.salaryMax = { lte: filters.maxSalary };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          admin: adminSelect,
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return { jobs, total };
  },

  create(data: any) {
    return prisma.job.create({ data, include: { admin: adminSelect } });
  },

  update(id: number, data: any) {
    return prisma.job.update({ where: { id }, data, include: { admin: adminSelect } });
  },

  delete(id: number) {
    return prisma.job.delete({ where: { id } });
  },
};
