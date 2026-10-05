const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ خطأ: متغير MONGO_URI غير متوفر في ملف البيئة!');
}

let client = null;
let database = null;

async function connectDB() {
  if (database) {
    return database;
  }

  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }
    
    // اسم قاعدة البيانات (تأكد إنه مطابق للاسم اللي تحبه أو سيبه tarek_db)
    database = client.db('tarek_db');
    console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح تام 🚀');
    return database;
  } catch (err) {
    console.error('❌ خطأ فادح في الاتصال بقاعدة البيانات:', err);
    throw err;
  }
}

module.exports = connectDB;