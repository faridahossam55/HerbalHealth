import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/database.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import hospitalRoutes from './routes/hospitals.js';
import cartRoutes from './routes/cartRoutes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Needed for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// ================= تعديل إعدادات CORS للتوافق مع Live Server =================
const allowedOrigins = ['http://localhost:5000', 'http://127.0.0.1:5500']; 

app.use(cors({
    origin: (origin, callback) => {
        // السماح بالطلبات التي تأتي من الأصول المسموح بها أو الطلبات التي لا تحتوي على أصل (مثل تطبيقات الهاتف أو طلبات Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // تأكد من السماح بكل الطرق
    credentials: true // 🏆 هذا السطر بالغ الأهمية لعملية تسجيل الدخول والكوكيز
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`
🌿 Herbal Health Backend + Frontend
========================================
🚀 Server: http://localhost:${PORT}
📊 Database: MongoDB Atlas
🌐 Frontend: Served from /public
========================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
