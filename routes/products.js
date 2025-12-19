import express from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/products - الحصول على كل المنتجات (عام)
router.get('/', productController.getAll);

// GET /api/products/search - البحث المتقدم في المنتجات
router.get('/search', productController.search);

// GET /api/products/:id - الحصول على منتج بواسطة ID
router.get('/:id', productController.getById);

// POST /api/products - إنشاء منتج جديد (للموظفين والمشرفين)
router.post('/', authMiddleware.verifyToken, authMiddleware.isStaffOrAdmin, productController.create);

// PUT /api/products/:id - تحديث منتج (للموظفين والمشرفين)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isStaffOrAdmin, productController.update);

// DELETE /api/products/:id - حذف منتج (للمشرفين فقط)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.delete);

export default router;