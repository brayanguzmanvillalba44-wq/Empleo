import { Router } from 'express';
import { clientController } from '../controllers/clientController';
import { validateBody } from '../middleware/validate';
import { updateClientSchema } from '../utils/schemas';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Listar clientes registrados (admin)
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de clientes }
 */
router.get('/', authenticate, authorize('ADMIN'), clientController.list);

/**
 * @swagger
 * /clients/profile:
 *   get:
 *     summary: Perfil del cliente autenticado
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil del cliente }
 */
router.get('/profile', authenticate, authorize('CLIENT'), clientController.getProfile);

/**
 * @swagger
 * /clients/profile:
 *   put:
 *     summary: Actualizar perfil del cliente autenticado
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil actualizado }
 */
router.put('/profile', authenticate, authorize('CLIENT'), validateBody(updateClientSchema), clientController.updateProfile);

export default router;
