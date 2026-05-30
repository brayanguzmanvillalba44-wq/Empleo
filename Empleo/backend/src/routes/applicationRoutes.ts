import { Router } from 'express';
import { applicationController } from '../controllers/applicationController';
import { validateBody } from '../middleware/validate';
import { createApplicationSchema, updateApplicationSchema } from '../utils/schemas';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /applications/jobs/{jobId}/apply:
 *   post:
 *     summary: Postularse a una vacante (cliente)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: jobId, required: true, schema: { type: integer } }
 *     responses:
 *       201: { description: Postulación enviada }
 *       409: { description: Ya te postulaste a esta vacante }
 */
router.post('/jobs/:jobId/apply', authenticate, authorize('CLIENT'), validateBody(createApplicationSchema), applicationController.apply);

/**
 * @swagger
 * /applications/my-applications:
 *   get:
 *     summary: Postulaciones del cliente autenticado
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de postulaciones }
 */
router.get('/my-applications', authenticate, authorize('CLIENT'), applicationController.getMyApplications);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Listar todas las postulaciones (admin)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de postulaciones }
 */
router.get('/', authenticate, authorize('ADMIN'), applicationController.getAll);

/**
 * @swagger
 * /applications/jobs/{jobId}/applicants:
 *   get:
 *     summary: Postulantes de una vacante (admin)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: jobId, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Lista de postulantes }
 */
router.get('/jobs/:jobId/applicants', authenticate, authorize('ADMIN'), applicationController.getJobApplications);

/**
 * @swagger
 * /applications/{id}/status:
 *   put:
 *     summary: Actualizar estado de una postulación (admin)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Estado actualizado }
 */
router.put('/:id/status', authenticate, authorize('ADMIN'), validateBody(updateApplicationSchema), applicationController.updateStatus);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Retirar una postulación (cliente)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Postulación retirada }
 */
router.delete('/:id', authenticate, authorize('CLIENT'), applicationController.withdraw);

export default router;
