const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسار فحص حالة السيرفر (API)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    developer: 'Tarek Khorshed',
    message: 'سيرفر منصة Tarek.Dev يعمل بانتظام وبكفاءة عالية مع MongoDB 🚀'
  });
});

// API استقبال وحفظ رسائل نموذج التواصل
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'جميع الحقول (الاسم، البريد، الرسالة) إجبارية!' 
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
      message: 'تم حفظ الرسالة في قاعدة البيانات بنجاح 🎯',
      insertedId: result.insertedId
    });
  } catch (err) {
    console.error('❌ خطأ أثناء تخزين البيانات:', err);
    res.status(500).json({ 
      success: false, 
      error: 'حدث خطأ داخلي في الخادم أثناء حفظ الرسالة.' 
    });
  }
});

// API لجلب كل الرسائل للوحة التحكم
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
    console.error('❌ خطأ أثناء جلب الرسائل:', err);
    res.status(500).json({ success: false, error: 'تعذر جلب الرسائل من قاعدة البيانات.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌐 السيرفر يعمل محلياً على الرابط: http://localhost:${PORT}`);
  });
}

module.exports = app;