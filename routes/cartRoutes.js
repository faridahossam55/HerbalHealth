// backend/routes/cartRoutes.js (الكود الجديد الصحيح)

import express from 'express';
const router = express.Router();
import { updateOrCreateCart, getCart } from '../controllers/cartController.js';
// 1. استيراد الكائن كاملاً (authMiddleware) بدلاً من دالة protect غير الموجودة
import { authMiddleware } from '../middleware/authMiddleware.js'; 

// المسارات تتطلب استخدام الدالة verifyToken الموجودة داخل الكائن
router.route('/')
    .get(authMiddleware.verifyToken, getCart) 
    .post(authMiddleware.verifyToken, updateOrCreateCart); 

export default router;