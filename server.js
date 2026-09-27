/* ==========================================================================
   Tarek.Dev - Express Server & MongoDB API Engine (Full Stack Core Updated)
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// قراءة الملفات الثابتة (HTML, CSS, JS) وتفعيل الواجهة كصفحة رئيسية للموقع
app.use(express.static(__dirname));

// مسار فحص حالة السيرفر (مفصول عن الصفحة الرئيسية)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    developer: 'Tarek Abed',
    message: 'سيرفر منصة Tarek.Dev يعمل بانتظام وبكفاءة عالية مع MongoDB 🚀'
  });
});

// API استقبال وحفظ رسائل نموذج التواصل (Contact Form API)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'جميع الحقول (الاسم، البريد، الرسالة) إجبارية يا بطل!' 
    });
  }

  try {
    const database = await connectDB();
    const collection = database.collection('messages');

    const newMessage = {
      name,
      email,
      message,
      created_at: new Date()
    };

    const result = await collection.insertOne(newMessage);

    res.status(201).json({
      success: true,
      message: 'تم حفظ الرسالة في قاعدة البيانات السحابية بنجاح 🎯',
      insertedId: result.insertedId
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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌐 السيرفر يعمل الآن بانتظام على الرابط: http://localhost:${PORT}`);
  });
}

module.exports = app; // توجيه صريح لصفحة لوحة التحكم والصفحات الأساسية لتجنب خطأ 404
app.get('/admin.html', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

app.get('/about.html', (req, res) => {
  res.sendFile(__dirname + '/about.html');
});