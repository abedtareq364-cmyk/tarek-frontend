const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// قراءة الملفات الثابتة (الموقع، الـ HTML، الصور) مباشرة
app.use(express.static(__dirname));

// مسار حالة السيرفر (مفصول تماماً تحت api)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    developer: 'Tarek Abed',
    message: 'سيرفر منصة Tarek.Dev يعمل بانتظام وبكفاءة عالية مع MongoDB 🚀'
  });
});

// مسار الـ Contact API
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'جميع الحقول إجبارية!' });
  }
  try {
    const database = await connectDB();
    const collection = database.collection('messages');
    const result = await collection.insertOne({ name, email, message, created_at: new Date() });
    res.status(201).json({ success: true, message: 'تم حفظ الرسالة بنجاح 🎯', insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ success: false, error: 'خطأ داخلي في الخادم.' });
  }
});

// مسار جلب الرسائل للوحة التحكم
app.get('/api/messages', async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection('messages');
    const results = await collection.find({}).sort({ created_at: -1 }).toArray();
    res.status(200).json({ success: true, count: results.length, messages: results });
  } catch (err) {
    res.status(500).json({ success: false, error: 'تعذر جلب الرسائل.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌐 السيرفر يعمل محلياً على: http://localhost:${PORT}`);
  });
}

module.exports = app;