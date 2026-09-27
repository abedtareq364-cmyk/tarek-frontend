const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('❌ خطأ: متغير البيئة MONGO_URI غير موجود!');
}

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
    if (cachedDb) {
        return cachedDb;
    }

    if (!uri) {
        throw new Error('Please define the MONGO_URI environment variable');
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    cachedClient = client;
    cachedDb = client.db(); // يتم استخدام قاعدة البيانات الافتراضية من الرابط
    
    console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح (Cached)');
    return cachedDb;
}

module.exports = connectDB;