const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسار فحص الحالة (API)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    developer: 'Tarek Khorshed',
    message: 'سيرفر منصة Tarek.Dev يعمل بانتظام وبكفاءة عالية مع MongoDB 🚀'
  });
});

// API استقبال وحفظ الرسائل
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'جميع الحقول إجبارية!' });
  }

  try {
    const database = await connectDB();
    const collection = database.collection('messages');
    const result = await collection.insertOne({ name, email, message, created_at: new Date() });

    res.status(201).json({
      success: true,
      message: 'تم حفظ الرسالة بنجاح 🎯',
      insertedId: result.insertedId
    });
  } catch (err) {
    console.error('❌ خطأ:', err);
    res.status(500).json({ success: false, error: 'حدث خطأ داخلي في الخادم.' });
  }
});

// API جلب الرسائل للوحة التحكم
app.get('/api/messages', async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection('messages');
    const results = await collection.find({}).sort({ created_at: -1 }).toArray();
    
    res.status(200).json({ success: true, count: results.length, messages: results });
  } catch (err) {
    console.error('❌ خطأ:', err);
    res.status(500).json({ success: false, error: 'تعذر جلب الرسائل.' });
  }
});

// ==========================================
// 🚀 مسارات التعليقات والتقييمات للمقالات (بدون قيود أو شروط)
// ==========================================

app.post('/api/comments', async (req, res) => {
  const { articleId, name, rating, text } = req.body;

  try {
    const database = await connectDB();
    const collection = database.collection('comments');
    
    const newComment = {
      articleId: articleId || 'clean-code',
      name: (name && name.trim()) ? name.trim() : '',
      rating: rating ? Number(rating) : 5,
      text: (text && text.trim()) ? text.trim() : '',
      created_at: new Date()
    };

    const result = await collection.insertOne(newComment);

    res.status(201).json({
      success: true,
      message: 'تم الحفظ بنجاح 🎯',
      comment: { ...newComment, _id: result.insertedId }
    });
  } catch (err) {
    console.error('❌ خطأ في حفظ التعليق:', err);
    res.status(500).json({ success: false, error: 'حدث خطأ داخلي في الخادم.' });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection('comments');
    const articleId = req.query.article || 'clean-code';
    
    const results = await collection.find({ articleId }).sort({ created_at: -1 }).toArray();
    
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ خطأ في جلب التعليقات:', err);
    res.status(500).json({ success: false, error: 'تعذر جلب التعليقات.' });
  }
});

// ==========================================
// ❤️ مسارات الإعجابات (Likes) للمقالات
// ==========================================

app.get('/api/likes', async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection('likes');
    const articleId = req.query.article || 'clean-code';
    
    let likeDoc = await collection.findOne({ articleId });
    const count = likeDoc ? likeDoc.count : 18;
    res.status(200).json({ success: true, count });
  } catch (err) {
    console.error('❌ خطأ في جلب الإعجابات:', err);
    res.status(500).json({ success: false, error: 'تعذر جلب الإعجابات' });
  }
});

app.post('/api/likes', async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection('likes');
    const { articleId, action } = req.body;
    const targetArticle = articleId || 'clean-code';
    const increment = action === 'unlike' ? -1 : 1;

    let likeDoc = await collection.findOne({ articleId: targetArticle });
    if (!likeDoc) {
      let initialCount = 18 + increment;
      await collection.insertOne({ articleId: targetArticle, count: initialCount });
      return res.status(200).json({ success: true, count: initialCount });
    }

    let newCount = likeDoc.count + increment;
    if (newCount < 0) newCount = 0;

    await collection.updateOne(
      { articleId: targetArticle },
      { $set: { count: newCount } }
    );

    res.status(200).json({ success: true, count: newCount });
  } catch (err) {
    console.error('❌ خطأ في تحديث الإعجاب:', err);
    res.status(500).json({ success: false, error: 'تعذر تحديث الإعجاب' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌐 السيرفر يعمل محلياً على المنفذ: ${PORT}`);
  });
}

module.exports = app;