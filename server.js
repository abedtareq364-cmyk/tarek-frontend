/* ==========================================================================
   Tarek.Dev - Express Server & API Engine (server.js - Full Stack Core Updated)
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const db = require('./db'); // استدعاء ملف الاتصال بقاعدة البيانات

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (الوسائط البرمجية لمعالجة البيانات والـ CORS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سطر قراءة الملفات الثابتة (HTML, CSS, JS) من مجلد المشروع مباشرة
app.use(express.static(__dirname));

// مسار رئيسي لاختبار عمل السيرفر
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    developer: 'Tarek Khorshed',
    message: 'سيرفر منصة Tarek.Dev يعمل بانتظام وبكفاءة عالية 🚀'
  });
});

// API استقبال وحفظ رسائل نموذج التواصل (Contact Form API)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // التحقق من وجود الحقول الأساسية
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'جميع الحقول (الاسم، البريد، الرسالة) إجبارية يا بطل!' 
    });
  }

  // استعلام الإدخال في قاعدة البيانات
  const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
  
  db.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error('❌ خطأ أثناء تخزين البيانات في القاعدة:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'حدث خطأ داخلي في الخادم أثناء حفظ الرسالة.' 
      });
    }

    res.status(201).json({
      success: true,
      message: 'تم حفظ الرسالة في قاعدة البيانات بنجاح 🎯',
      insertedId: result.insertId
    });
  });
});

// API لجلب كل الرسائل المخزنة لوحة التحكم (Admin API)
app.get('/api/messages', (req, res) => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ خطأ أثناء جلب الرسائل:', err);
      return res.status(500).json({ success: false, error: 'تعذر جلب الرسائل من قاعدة البيانات.' });
    }
    
    res.status(200).json({
      success: true,
      count: results.length,
      messages: results
    });
  });
});

// تشغيل السيرفر على المنفذ المحدد
app.listen(PORT, () => {
  console.log(`🌐 السيرفر يعمل الآن بانتظام على الرابط: http://localhost:${PORT}`);
});