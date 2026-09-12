/* ==========================================================================
   Tarek.Dev - Database Connection Configuration (db.js)
   ========================================================================== */

const mysql = require('mysql2');

// إنشاء اتصال مع قاعدة البيانات المحلية على XAMPP
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // كلمة المرور الافتراضية لـ XAMPP فارغة عادةً
  database: 'tarek_dev_db'
});

// تفعيل الاتصال مع التعامل الاحترافي مع الأخطاء
db.connect((err) => {
  if (err) {
    console.error('❌ خطأ فادح في الاتصال بقاعدة بيانات MySQL:', err.message);
    return;
  }
  console.log(`🚀 تم الاتصال بقاعدة بيانات MySQL بنجاح برقم ID: ${db.threadId}`);
});

module.exports = db;