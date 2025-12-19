// backend/controllers/cartController.js

import asyncHandler from 'express-async-handler';
import { ObjectId } from "mongodb"; 
// استيراد دالة getClient من ملف الاتصال
import { getDb } from '../config/database.js';
// 1. استدعاء getClient() مرة واحدة للحصول على كائن الاتصال
//const client = getClient(); 

// 2. اسم قاعدة البيانات (تأكدي أنه يطابق ما في .env أو database.js)
// قد تحتاجين لتغيير "HerbalDB" إذا كان لديكِ اسم آخر
const DB_NAME = "herbalDB"; 


// @desc    إضافة عنصر جديد للسلة أو تحديث الكمية
// @route   POST /api/cart
// @access  Private 
const updateOrCreateCart = asyncHandler(async (req, res) => {
    
    // 🏆 هذا هو السطر المفقود/المعدّل: نستخدم req.user.userId
    const userId = req.user.userId; 
    
    // البيانات التي نأمل أن تأتي من الفرونت إند
    const { productId, name, price, qty = 1 } = req.body;

    if (!userId || !productId) {
        res.status(400);
        // إذا كان المستخدم غير مسجل، سيتم إيقافه بواسطة authMiddleware.verifyToken
        // لكن هذا يتحقق من وجود البيانات في حال مرور الـ Token
        throw new Error('User ID and Product ID are required.');
    }

    // نحول الـ IDs إلى ObjectId
    const userObjectId = new ObjectId(userId); 
    const productObjectId = new ObjectId(productId); 

    try {
        const db = getDb();
        const carts = db.collection('carts'); // المجموعة التي سيتم حفظ السلال فيها

        const cartItem = {
            product: productObjectId,
            name: name,
            price: price,
            qty: qty
        };

        // 1. البحث عن سلة التسوق الحالية للمستخدم
        const cart = await carts.findOne({ user: userObjectId });

        if (cart) {
            // سلة التسوق موجودة: نحاول تحديث عنصر موجود
            const existingItemIndex = cart.cartItems.findIndex(
                (item) => item.product.toString() === productId
            );

            let updatedCart;
            
            if (existingItemIndex > -1) {
                // العنصر موجود بالفعل: زيادة الكمية
                updatedCart = await carts.findOneAndUpdate(
                    { user: userObjectId, "cartItems.product": productObjectId },
                    { $inc: { "cartItems.$.qty": qty } }, 
                    { returnDocument: 'after' }
                );
            } else {
                // العنصر جديد: إضافته إلى مصفوفة cartItems
                updatedCart = await carts.findOneAndUpdate(
                    { user: userObjectId },
                    { $push: { cartItems: cartItem } },
                    { returnDocument: 'after' }
                );
            }

            if (updatedCart.value) {
                return res.status(200).json(updatedCart.value);
            } else {
                 res.status(404);
                 throw new Error('Cart not found after update attempt.');
            }

        } else {
            // سلة التسوق غير موجودة: إنشاء سلة جديدة
            const newCart = {
                user: userObjectId,
                cartItems: [cartItem],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await carts.insertOne(newCart);
            const createdCart = await carts.findOne({ _id: result.insertedId });
            
            res.status(201).json(createdCart);
        }

    } catch (error) {
        console.error("Cart processing error:", error);
        res.status(500);
        throw new Error(`Server Error: ${error.message}`);
    } 
});

// @desc    جلب سلة التسوق الحالية للمستخدم
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    
    // 🏆 هذا هو السطر المفقود/المعدّل: نستخدم req.user.userId
    const userId = req.user.userId; 
    
    if (!userId) {
        res.status(400);
        throw new Error('User ID is required.');
    }

    const userObjectId = new ObjectId(userId); 

    try {
        const db = getDb();
        const carts = db.collection('carts');
        
        const cart = await carts.findOne({ user: userObjectId });

        if (cart) {
            res.json(cart);
        } else {
            // إذا لم يكن لدى المستخدم سلة بعد، نعيد سلة فارغة
            res.json({ user: userId, cartItems: [] });
        }

    } catch (error) {
        console.error("Cart fetching error:", error);
        res.status(500);
        throw new Error(`Server Error: ${error.message}`);
    } 
});


export { updateOrCreateCart, getCart };