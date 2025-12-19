import { getDb } from '../config/database.js';
import { Product } from '../models/Product.js';
import { ObjectId } from 'mongodb';

export const productController = {
  // الحصول على كل المنتجات مع فلترة
  async getAll(req, res) {
    try {
      const db = getDb();
      const { category, disease, search, page = 1, limit = 0 } = req.query;
      
      let filter = {};
      
      if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (disease) {
        filter.disease = { $regex: new RegExp(`^${disease}$`, 'i') };
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [products, total] = await Promise.all([
        db.collection('products')
          .find(filter)
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        db.collection('products').countDocuments(filter)
      ]);
      
      res.json({
        success: true,
        data: products.map(p => new Product(p).toJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على منتج بواسطة ID
  async getById(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      res.json({
        success: true,
        data: new Product(product).toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // إنشاء منتج جديد
  async create(req, res) {
    try {
      const db = getDb();
      const product = new Product(req.body);
      
      const result = await db.collection('products').insertOne(product);
      product._id = result.insertedId;
      
      if (product.disease) {
        await db.collection('categories').updateOne(
          { name: product.disease },
          { $inc: { productsCount: 1 } }
        );
      }
      
      res.status(201).json({
        success: true,
        data: product.toJSON(),
        message: 'Product created successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // تحديث منتج
  async update(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const result = await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // حذف منتج
  async delete(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      await db.collection('products').deleteOne({ _id: new ObjectId(id) });
      
      if (product.disease) {
        await db.collection('categories').updateOne(
          { name: product.disease },
          { $inc: { productsCount: -1 } }
        );
      }
      
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // البحث المتقدم في المنتجات
  async search(req, res) {
    try {
      const db = getDb();
      const { q, category, disease, minPrice, maxPrice, tags } = req.query;
      
      let filter = {};
      
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ];
      }
      
      if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (disease) {
        filter.disease = { $regex: new RegExp(`^${disease}$`, 'i') };
      }
      
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      if (tags) {
        filter.tags = { $in: tags.split(',') };
      }
      
      const products = await db.collection('products').find(filter).toArray();
      
      res.json({
        success: true,
        data: products.map(p => new Product(p).toJSON()),
        count: products.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
