import { getDb } from '../config/database.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const authController = {
  // تسجيل مستخدم جديد
  async register(req, res) {
    try {
      const db = getDb();
      const { name, email, password, phone, role = 'user' } = req.body;
      
      // التحقق من وجود المستخدم
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }
      
      // إنشاء مستخدم جديد
      const user = new User({ name, email, password, phone, role });
      await user.hashPassword();
      
      const result = await db.collection('users').insertOne(user);
      user._id = result.insertedId;
      
      // إنشاء token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        success: true,
        data: {
          user: user.toJSON(),
          token,
          expiresIn: '7 days'
        },
        message: 'Registration successful'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

async login(req, res) {
  try {
    console.log('🔍 LOGIN REQUEST BODY:', req.body);  // للـ debugging
    
    // التحقق من وجود body
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const { email, password } = req.body;
    const db = getDb();
    
    // البحث عن المستخدم
    const userData = await db.collection('users').findOne({ email: email.toLowerCase() });
    
    if (!userData) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // استخدام ObjectId للـ _id
    const userId = userData._id.toString();
    const user = new User(userData);
    
    // التحقق من كلمة المرور
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // تحديث آخر دخول
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { lastLogin: new Date() } }
    );
    
    // إنشاء token
    const token = jwt.sign(
      { 
        userId: userId,  // استخدم userId هنا
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
        expiresIn: '7 days'
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
},

  // الحصول على بيانات المستخدم الحالي
  async getMe(req, res) {
    try {
      const db = getDb();
      
      // سيتم إضافة middleware لاستخراج userId من token
      const { userId } = req.user || {};
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      const userData = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      const user = new User(userData);
      
      res.json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // تحديث بيانات المستخدم
  async updateProfile(req, res) {
    try {
      const db = getDb();
      const { userId } = req.user || {};
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      // عدم السماح بتحديث بعض الحقول
      const { email, role, password, ...updateData } = req.body;
      
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      // الحصول على البيانات المحدثة
      const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      
      res.json({
        success: true,
        data: new User(updatedUser).toJSON(),
        message: 'Profile updated successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // تغيير كلمة المرور
  async changePassword(req, res) {
    try {
      const db = getDb();
      const { userId } = req.user || {};
      const { currentPassword, newPassword } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      const userData = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!userData) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      const user = new User(userData);
      
      // التحقق من كلمة المرور الحالية
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }
      
      // تحديث كلمة المرور الجديدة
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};