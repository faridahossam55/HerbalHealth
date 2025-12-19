import express from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/categories - الحصول على كل التصنيفات (عام)
router.get('/', categoryController.getAll);

// GET /api/categories/:id - الحصول على تصنيف بواسطة ID
router.get('/:id', categoryController.getById);

// GET /api/categories/:id/products - الحصول على منتجات التصنيف
router.get('/:id/products', categoryController.getProducts);

// POST /api/categories - إنشاء تصنيف جديد (للمشرفين فقط)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, categoryController.create);

// PUT /api/categories/:id - تحديث تصنيف (للمشرفين فقط)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, categoryController.update);

// DELETE /api/categories/:id - حذف تصنيف (للمشرفين فقط)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, categoryController.delete);

export default router;