/* ==========================================================================
   Tarek.Dev - Express Server & MongoDB API Engine (Full Stack Core Updated)
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // استدعاء ملف الاتصال بـ MongoDB السحابية

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
    developer: 'Tarek Abed',
    message: 'سيرفر منصة Tarek.Dev يعمل بانتظام وبكفاءة عالية مع MongoDB 🚀'
  });
});

// API استقبال وحفظ رسائل نموذج التواصل (Contact Form API)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // التحقق من وجود الحقول الأساسية
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'جميع الحقول (الاسم، البريد، الرسالة) إجبارية يا بطل!' 
    });
  }

  try {
    // الاتصال بقاعدة البيانات وجلب الكائن
    const database = await connectDB();
    const collection = database.collection('messages');

    // تجهيز الوثيقة (Document) لحفظها في MongoDB السحابية
    const newMessage = {
      name,
      email,
      message,
      created_at: new Date() // إضافة التوقيت تلقائياً
    };

    const result = await collection.insertOne(newMessage);

    res.status(201).json({
      success: true,
      message: 'تم حفظ الرسالة في قاعدة البيانات السحابية بنجاح 🎯',
      insertedId: result.insertedId // معرف الوثيقة الفريد في MongoDB
    });
  } catch (err) {
    console.error('❌ خطأ أثناء تخزين البيانات في القاعدة السحابية:', err);
    res.status(500).json({ 
      success: false, 
      error: 'حدث خطأ داخلي في الخادم أثناء حفظ الرسالة.' 
    });
  }
});

// API لجلب كل الرسائل المخزنة لوحة التحكم (Admin API)
app.get('/api/messages', async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection('messages');

    // جلب الرسائل وترتيبها من الأحدث للأقدم
    const results = await collection.find({}).sort({ created_at: -1 }).toArray();
    
    res.status(200).json({
      success: true,
      count: results.length,
      messages: results
    });
  } catch (err) {
    console.error('❌ خطأ أثناء جلب الرسائل من السحابة:', err);
    res.status(500).json({ success: false, error: 'تعذر جلب الرسائل من قاعدة البيانات.' });
  }
});

// تشغيل السيرفر محلياً فقط إذا لم تكن في بيئة الإنتاج السحابية
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌐 السيرفر يعمل الآن بانتظام على الرابط: http://localhost:${PORT}`);
  });
}

// تصدير التطبيق ليعمل على سيرفرات Vercel السحابية بدون أخطاء
module.exports = app;