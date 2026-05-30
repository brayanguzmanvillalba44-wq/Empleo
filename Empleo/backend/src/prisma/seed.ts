/**
 * Seed de datos de ejemplo.
 * Crea: 1 administrador, varios clientes, vacantes y algunas postulaciones.
 * Ejecutar con:  npm run db:seed
 */
import prisma from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Limpieza (respetando el orden de las relaciones)
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.client.deleteMany();
  await prisma.admin.deleteMany();

  const hashed = await bcrypt.hash('password123', 10);

  // ---------- Administrador ----------
  const admin = await prisma.admin.create({
    data: {
      name: 'Administrador General',
      email: 'admin@empleo.com',
      password: hashed,
    },
  });

  // ---------- Clientes ----------
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        password: hashed,
        phone: '+52 776 123 4567',
        location: 'Huauchinango, Puebla',
        headline: 'Desarrollador Full Stack',
        summary: 'Desarrollador con experiencia en React, Node.js y TypeScript.',
        skills: 'React, Node.js, TypeScript, SQL',
      },
    }),
    prisma.client.create({
      data: {
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@email.com',
        password: hashed,
        phone: '+52 776 765 4321',
        location: 'Xicotepec, Puebla',
        headline: 'Diseñadora UX/UI',
        summary: 'Diseñadora enfocada en experiencia de usuario e interfaces modernas.',
        skills: 'Figma, Diseño UX, Prototipado',
      },
    }),
    prisma.client.create({
      data: {
        firstName: 'Carlos',
        lastName: 'Hernández',
        email: 'carlos.hernandez@email.com',
        password: hashed,
        location: 'Zacatlán, Puebla',
        headline: 'Ingeniero DevOps',
        skills: 'Docker, CI/CD, Linux',
      },
    }),
  ]);

  // ---------- Vacantes (publicadas por el administrador) ----------
  const jobsData = [
    {
      title: 'Desarrollador Frontend React',
      description:
        'Buscamos un desarrollador frontend con React para construir interfaces modernas y de alto rendimiento en nuestra plataforma de empleo.',
      requirements: '3+ años con React, TypeScript, APIs REST, Tailwind CSS',
      benefits: 'Horario flexible, modalidad híbrida, bonos por desempeño',
      location: 'Huauchinango, Puebla',
      type: 'FULL_TIME',
      modality: 'HYBRID',
      salaryMin: 22000,
      salaryMax: 32000,
      category: 'Desarrollo',
      tags: 'React,TypeScript,Frontend',
    },
    {
      title: 'Ingeniero Backend Node.js',
      description:
        'Únete al equipo backend para construir servicios seguros y escalables: endpoints, lógica de negocio y optimización de consultas.',
      requirements: '3+ años con Node.js, Prisma o similar, JWT, pruebas',
      benefits: 'Trabajo híbrido, seguro, certificaciones pagadas',
      location: 'Huauchinango, Puebla',
      type: 'FULL_TIME',
      modality: 'HYBRID',
      salaryMin: 24000,
      salaryMax: 36000,
      category: 'Desarrollo',
      tags: 'Node.js,Backend,APIs',
    },
    {
      title: 'Ingeniero DevOps',
      description:
        'Gestiona infraestructura y automatiza despliegues. Asegura alta disponibilidad, monitoreo y pipelines CI/CD.',
      requirements: '3+ años en DevOps, CI/CD, Docker, IaC',
      benefits: 'Modalidad híbrida, certificaciones, bonos por objetivos',
      location: 'Zacatlán, Puebla',
      type: 'CONTRACT',
      modality: 'ONSITE',
      salaryMin: 26000,
      salaryMax: 38000,
      category: 'Infraestructura',
      tags: 'DevOps,CI/CD,Docker',
    },
    {
      title: 'Diseñador UI/UX',
      description:
        'Crea experiencias centradas en el usuario: wireframes, prototipos y diseño visual coherente con el producto.',
      requirements: '2+ años en diseño UX/UI, dominio de Figma, diseño responsive',
      benefits: 'Presupuesto de diseño, equipo, conferencias',
      location: 'Huauchinango, Puebla',
      type: 'FULL_TIME',
      modality: 'ONSITE',
      salaryMin: 18000,
      salaryMax: 26000,
      category: 'Diseño',
      tags: 'UX,UI,Figma',
    },
    {
      title: 'QA Automation Engineer',
      description:
        'Diseña y automatiza pruebas para garantizar la calidad en cada release de la plataforma.',
      requirements: '2+ años en automatización, Cypress o Playwright, CI',
      benefits: 'Home office parcial, crecimiento profesional',
      location: 'Xicotepec, Puebla',
      type: 'FULL_TIME',
      modality: 'HYBRID',
      salaryMin: 20000,
      salaryMax: 30000,
      category: 'QA',
      tags: 'QA,Automation,Cypress',
    },
    {
      title: 'Desarrollador Mobile (React Native)',
      description:
        'Desarrolla y mantiene aplicaciones móviles multiplataforma con React Native.',
      requirements: '2+ años con React Native, integración de APIs, publicación en tiendas',
      benefits: 'Trabajo remoto, equipo proporcionado',
      location: 'Remoto',
      type: 'FULL_TIME',
      modality: 'REMOTE',
      salaryMin: 25000,
      salaryMax: 38000,
      category: 'Desarrollo',
      tags: 'React Native,Mobile',
    },
  ];

  const jobs = [];
  for (const data of jobsData) {
    const job = await prisma.job.create({
      data: { ...data, currency: 'MXN', adminId: admin.id },
    });
    jobs.push(job);
  }

  // ---------- Postulaciones de ejemplo ----------
  await prisma.application.create({
    data: {
      jobId: jobs[0].id,
      clientId: clients[0].id,
      status: 'PENDING',
      coverLetter: 'Me interesa mucho esta posición de frontend, tengo experiencia con React.',
    },
  });
  await prisma.application.create({
    data: {
      jobId: jobs[3].id,
      clientId: clients[1].id,
      status: 'REVIEWING',
      coverLetter: 'Diseñadora UX/UI con portafolio disponible.',
    },
  });

  console.log('✅ Seed completado:');
  console.log(`   - 1 administrador (admin@empleo.com / password123)`);
  console.log(`   - ${clients.length} clientes (password: password123)`);
  console.log(`   - ${jobs.length} vacantes`);
  console.log(`   - 2 postulaciones`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
