import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register - تسجيل مستخدم جديد
router.post('/register', authController.register);

// POST /api/auth/login - تسجيل الدخول
router.post('/login', authController.login);

// GET /api/auth/me - الحصول على بيانات المستخدم الحالي
router.get('/me', authMiddleware.verifyToken, authController.getMe);

// PUT /api/auth/profile - تحديث الملف الشخصي
router.put('/profile', authMiddleware.verifyToken, authController.updateProfile);

// PUT /api/auth/change-password - تغيير كلمة المرور
router.put('/change-password', authMiddleware.verifyToken, authController.changePassword);

export default router;