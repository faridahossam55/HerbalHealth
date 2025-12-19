import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/orders - الحصول على كل الطلبات (للموظفين والمشرفين)
router.get('/', authMiddleware.verifyToken, authMiddleware.isStaffOrAdmin, orderController.getAll);

// GET /api/orders/user/:userId - الحصول على طلبات مستخدم معين
router.get('/user/:userId', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, orderController.getUserOrders);

// GET /api/orders/:id - الحصول على طلب بواسطة ID
router.get('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, orderController.getById);

// POST /api/orders - إنشاء طلب جديد
router.post('/', authMiddleware.verifyToken, orderController.create);

// PUT /api/orders/:id/status - تحديث حالة الطلب (للموظفين والمشرفين)
router.put('/:id/status', authMiddleware.verifyToken, authMiddleware.isStaffOrAdmin, orderController.updateStatus);

// DELETE /api/orders/:id - حذف طلب
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, orderController.delete);

export default router;