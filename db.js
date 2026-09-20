// db.js - محرك الاتصال بقاعدة البيانات لمنصة Tarek.Dev
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGO_URI;

// إنشاء كائن الاتصال بالسيرفر السحابي
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    // الاتصال بالسيرفر السحابي
    await client.connect();
    // إرسال أمر فحص الإشارة (Ping) للتحقق من نجاح الاتصال
    await client.db("admin").command({ ping: 1 });
    console.log("=========================================");
    console.log("🟢 تم الاتصال بنجاح بقاعدة بيانات MongoDB Atlas!");
    console.log("=========================================");
    return client.db("tarek_db"); // إرجاع قاعدة البيانات لاستخدامها بالمشاريع
  } catch (error) {
    console.error("🔴 فشل الاتصال بقاعدة البيانات السحابية:", error.message);
  }
}

module.exports = connectDB;
