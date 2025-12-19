import { getDb } from '../config/database.js';
import { Hospital } from '../models/Hospital.js';
import { ObjectId } from 'mongodb';

export const hospitalController = {
  // الحصول على كل المستشفيات
  async getAll(req, res) {
    try {
      const db = getDb();
      const { type, city, search } = req.query;
      
      let filter = {};
      if (type) filter.type = type;
      if (city) filter['location.city'] = city;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { 'location.district': { $regex: search, $options: 'i' } },
          { 'contact.phone': { $regex: search, $options: 'i' } }
        ];
      }
      
      const hospitals = await db.collection('hospitals').find(filter).toArray();
      
      res.json({
        success: true,
        data: hospitals.map(h => new Hospital(h).toJSON()),
        count: hospitals.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على مستشفى بواسطة ID
  async getById(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const hospital = await db.collection('hospitals').findOne({ _id: new ObjectId(id) });
      if (!hospital) {
        return res.status(404).json({ success: false, error: 'Hospital not found' });
      }
      
      res.json({
        success: true,
        data: new Hospital(hospital).toJSON()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // إنشاء مستشفى جديد
  async create(req, res) {
    try {
      const db = getDb();
      const hospital = new Hospital(req.body);
      
      const result = await db.collection('hospitals').insertOne(hospital);
      hospital._id = result.insertedId;
      
      res.status(201).json({
        success: true,
        data: hospital.toJSON(),
        message: 'Hospital created successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // تحديث مستشفى
  async update(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const result = await db.collection('hospitals').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Hospital not found' });
      }
      
      res.json({ success: true, message: 'Hospital updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // حذف مستشفى
  async delete(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      
      const result = await db.collection('hospitals').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Hospital not found' });
      }
      
      res.json({ success: true, message: 'Hospital deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // البحث عن مستشفيات بالقرب من موقع معين
  async searchNearby(req, res) {
    try {
      const db = getDb();
      const { lat, lng, maxDistance = 10 } = req.query; // بالكيلومتر
      
      const hospitals = await db.collection('hospitals')
        .find({
          coordinates: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: maxDistance * 1000 // تحويل لكيلومتر
            }
          }
        })
        .toArray();
      
      res.json({
        success: true,
        data: hospitals.map(h => new Hospital(h).toJSON()),
        count: hospitals.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};