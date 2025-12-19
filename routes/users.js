import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users - الحصول على كل المستخدمين (للمشرفين فقط)
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getAll);

// GET /api/users/:id - الحصول على مستخدم بواسطة ID
router.get('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, userController.getById);

// PUT /api/users/:id - تحديث مستخدم
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, userController.update);

// DELETE /api/users/:id - حذف مستخدم
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, userController.delete);

export default router;