import { MongoClient } from 'mongodb';

let db;
let client;

export async function connectToDatabase() {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.DB_NAME || 'herbalDB');
    
    console.log('✅ Connected to MongoDB');
    console.log(`📁 Database: ${db.databaseName}`);
    
    // التحقق من Collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Collections: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   • ${col.name}`);
    });
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase first.');
  }
  return db;
}

export function getClient() {
  return client;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}