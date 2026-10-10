const { MongoClient, ServerApiVersion } = require('mongodb'); require('dotenv').config();
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('❌ خطأ قاتل: متغير MONGO_URI غير موجود في البيئة في Render!');
}

// إنشاء عميل مونجو مع خيارات الأمان والاتصال الحديثة لـ Atlas
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 10000, // مهلة 10 ثواني عشان السيرفر مايعلقش
    socketTimeoutMS: 45000,
});

let dbInstance = null;

async function connectDB() {
    if (dbInstance) {
        return dbInstance;
    }
    
    try {
        console.log('🔄 جاري الاتصال بقاعدة بيانات MongoDB Atlas...');
        await client.connect();
        
        // اختبار الاتصال الفعلي بقاعدة البيانات
        await client.db("admin").command({ ping: 1 });
        
        dbInstance = client.db('tarek_db');
        console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح تام 🚀');
        return dbInstance;
    } catch (error) {
       console.error('❌ خطأ حقيقي في اتصال MongoDB:', error.message);
        // نطبع الـ error كاملاً عشان نعرف السبب الدقيق لو فيه حاجة مستخبية
        console.error(error);
        throw error;
    }
}

module.exports = connectDB;