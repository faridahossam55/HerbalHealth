import jwt from 'jsonwebtoken';

export const authMiddleware = {
  // التحقق من token
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Access denied. No token provided.'
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  },

  // التحقق من صلاحيات المشرف
  isAdmin: (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }
    next();
  },

  // التحقق من صلاحيات الموظف أو المشرف
  isStaffOrAdmin: (req, res, next) => {
    if (!['admin', 'staff'].includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Staff or admin privileges required.'
      });
    }
    next();
  },

  // التحقق من أن المستخدم هو نفسه أو مشرف
  isOwnerOrAdmin: (req, res, next) => {
    const { id } = req.params;
    
    if (req.user?.role === 'admin') {
      return next();
    }
    
    if (req.user?.userId === id) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      error: 'Access denied. You can only access your own data.'
    });
  }
};