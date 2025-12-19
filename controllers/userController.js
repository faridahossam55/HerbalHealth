
import { getDb } from '../config/database.js';
import { User } from '../models/User.js';
import { ObjectId } from 'mongodb';

export const userController = {
  // الحصول على كل المستخدمين (للمشرفين فقط)
  async getAll(req, res) {
    try {
      const db = getDb();
      const users = await db.collection('users').find().toArray();
      res.json(users.map(user => new User(user).toJSON()));
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على مستخدم بواسطة ID
  async getById(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json(new User(user).toJSON());
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // تحديث مستخدم
  async update(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // حذف مستخدم
  async delete(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};