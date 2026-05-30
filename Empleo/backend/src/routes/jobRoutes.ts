import { Router } from 'express';
import { jobController } from '../controllers/jobController';
import { validateBody, validateQuery } from '../middleware/validate';
import { createJobSchema, updateJobSchema, jobQuerySchema } from '../utils/schemas';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Listar vacantes activas (catálogo público)
 *     tags: [Jobs]
 *     responses:
 *       200: { description: Lista de vacantes }
 */
router.get('/', validateQuery(jobQuerySchema), jobController.getAllJobs);

/**
 * @swagger
 * /jobs/manage:
 *   get:
 *     summary: Listar todas las vacantes incluidas las cerradas (admin)
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de vacantes }
 */
router.get('/manage', authenticate, authorize('ADMIN'), validateQuery(jobQuerySchema), jobController.getManagedJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Detalle de una vacante
 *     tags: [Jobs]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Detalle de la vacante }
 *       404: { description: Vacante no encontrada }
 */
router.get('/:id', jobController.getJobById);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Crear nueva vacante (admin)
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Vacante creada }
 *       403: { description: No autorizado }
 */
router.post('/', authenticate, authorize('ADMIN'), validateBody(createJobSchema), jobController.createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Actualizar vacante (admin)
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Vacante actualizada }
 */
router.put('/:id', authenticate, authorize('ADMIN'), validateBody(updateJobSchema), jobController.updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Eliminar vacante (admin)
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Vacante eliminada }
 */
router.delete('/:id', authenticate, authorize('ADMIN'), jobController.deleteJob);

export default router;
