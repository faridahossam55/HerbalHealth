// backend/models/Cart.js

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    // اسم المنتج
    name: { type: String, required: true },
    // كمية المنتج
    qty: { type: Number, required: true, default: 1 },
    // سعر الوحدة
    price: { type: Number, required: true },
    // رابط المنتج الفعلي (لربط عنصر السلة بمستند Product في DB)
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product', // يفترض أن لديكِ موديل اسمه 'Product'
    },
    // يمكن إضافة حقول أخرى مثل صورة المنتج (image) إذا لزم الأمر
});

const cartSchema = new mongoose.Schema({
    // ربط السلة بالمستخدم (كل مستخدم له سلة واحدة)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // يفترض أن لديكِ موديل اسمه 'User'
        unique: true, // مهم جداً: لضمان أن لكل مستخدم سلة واحدة فقط
    },
    // مصفوفة (Array) تحتوي على عناصر السلة
    cartItems: [cartItemSchema],
}, {
    timestamps: true, // لإضافة createdAt و updatedAt
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;