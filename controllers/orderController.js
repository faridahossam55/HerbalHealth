import { getDb } from '../config/database.js';
import { Order } from '../models/Order.js';
import { ObjectId } from 'mongodb';

export const orderController = {
  // الحصول على كل الطلبات
  async getAll(req, res) {
    try {
      const db = getDb();
      const { status, userId, page = 1, limit = 10 } = req.query;
      
      let filter = {};
      if (status) filter.orderStatus = status;
      if (userId) filter.userId = new ObjectId(userId);
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [orders, total] = await Promise.all([
        db.collection('orders')
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        db.collection('orders').countDocuments(filter)
      ]);
      
      res.json({
        success: true,
        data: orders.map(o => new Order(o).toJSON()),
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

  // الحصول على طلب بواسطة ID
  async getById(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      
      res.json({
        success: true,
        data: new Order(order).toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // إنشاء طلب جديد
  async create(req, res) {
    try {
      const db = getDb();
      const order = new Order(req.body);
      order.calculateTotal();
      
      // التحقق من توفر المنتجات في المخزون
      for (const item of order.items) {
        const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Product ${item.productId} not found`
          });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          });
        }
      }
      
      // خصم الكمية من المخزون
      for (const item of order.items) {
        await db.collection('products').updateOne(
          { _id: new ObjectId(item.productId) },
          { $inc: { stock: -item.quantity } }
        );
      }
      
      const result = await db.collection('orders').insertOne(order);
      order._id = result.insertedId;
      
      res.status(201).json({
        success: true,
        data: order.toJSON(),
        message: 'Order created successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // تحديث حالة الطلب
  async updateStatus(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      const { orderStatus } = req.body;
      
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      const updateData = { orderStatus, updatedAt: new Date() };
      if (orderStatus === 'delivered') {
        updateData.deliveredAt = new Date();
      } else if (orderStatus === 'cancelled') {
        updateData.cancelledAt = new Date();
        
        // إرجاع المنتجات للمخزون إذا تم إلغاء الطلب
        const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
        for (const item of order.items) {
          await db.collection('products').updateOne(
            { _id: new ObjectId(item.productId) },
            { $inc: { stock: item.quantity } }
          );
        }
      }
      
      const result = await db.collection('orders').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      
      res.json({ success: true, message: `Order status updated to ${orderStatus}` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على طلبات مستخدم معين
  async getUserOrders(req, res) {
    try {
      const db = getDb();
      const { userId } = req.params;
      
      const orders = await db.collection('orders')
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();
      
      res.json({
        success: true,
        data: orders.map(o => new Order(o).toJSON()),
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // حذف طلب
  async delete(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      
      // لا يمكن حذف طلبات تم توصيلها أو قيد المعالجة
      if (order.orderStatus === 'delivered' || order.orderStatus === 'processing') {
        return res.status(400).json({
          success: false,
          error: `Cannot delete order with status: ${order.orderStatus}`
        });
      }
      
      // إرجاع المنتجات للمخزون
      for (const item of order.items) {
        await db.collection('products').updateOne(
          { _id: new ObjectId(item.productId) },
          { $inc: { stock: item.quantity } }
        );
      }
      
      await db.collection('orders').deleteOne({ _id: new ObjectId(id) });
      
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};