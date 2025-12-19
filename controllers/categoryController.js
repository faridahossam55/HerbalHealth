import { getDb } from '../config/database.js';
import { Category } from '../models/Category.js';
import { ObjectId } from 'mongodb';

export const categoryController = {
  // الحصول على كل التصنيفات
  async getAll(req, res) {
    try {
      const db = getDb();
      const { type, featured } = req.query;
      
      let filter = {};
      if (type) filter.type = type;
      if (featured !== undefined) filter.featured = featured === 'true';
      
      const categories = await db.collection('categories').find(filter).toArray();
      
      res.json({
        success: true,
        data: categories.map(cat => new Category(cat).toJSON())
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على تصنيف بواسطة ID
  async getById(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });
      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
      
      res.json({
        success: true,
        data: new Category(category).toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // إنشاء تصنيف جديد
  async create(req, res) {
    try {
      const db = getDb();
      const category = new Category(req.body);
      
      const result = await db.collection('categories').insertOne(category);
      category._id = result.insertedId;
      
      res.status(201).json({
        success: true,
        data: category.toJSON(),
        message: 'Category created successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // تحديث تصنيف
  async update(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const result = await db.collection('categories').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
      
      res.json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // حذف تصنيف
  async delete(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      // التحقق من وجود منتجات مرتبطة بالتصنيف
      const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });
      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
      
      if (category.productsCount > 0) {
        return res.status(400).json({
          success: false,
          error: `Cannot delete category with ${category.productsCount} products. Remove products first.`
        });
      }
      
      await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
      
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على منتجات التصنيف
  async getProducts(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });
      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
      
      const products = await db.collection('products')
        .find({ disease: category.name })
        .toArray();
      
      res.json({
        success: true,
        category: new Category(category).toJSON(),
        products: products.map(p => new Product(p).toJSON()),
        count: products.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};