# إتقان - منصة تعليم القرآن الكريم

منصة متكاملة لتعليم القرآن الكريم، تربط بين الطلاب والمعلمات لتسهيل الحفظ والتجويد والتفسير.

## 🚀 المميزات

- ✅ تسجيل الدخول وإنشاء الحسابات
- ✅ اختيار الأهداف (حفظ / تجويد / تفسير)
- ✅ لوحة تحكم للطالب
- ✅ حجز الجلسات مع المعلمات
- ✅ نظام الواجبات
- ✅ الرسائل المباشرة
- ✅ تتبع التقدم في الحفظ

## 🛠️ التقنيات المستخدمة

- **Frontend**: React + TypeScript + Vite
- **Styling**: Vanilla CSS with Design Tokens
- **Backend**: Supabase (Authentication + Database + Real-time)
- **Icons**: Lucide React

## 📦 التثبيت

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/itqan-quran-platform.git

# Navigate to the project directory
cd itqan-quran-platform

# Install dependencies
npm install

# Create .env.local file with your Supabase credentials
echo "VITE_SUPABASE_URL=your_supabase_url" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env.local

# Start the development server
npm run dev
```

## 🗄️ إعداد قاعدة البيانات

1. أنشئ مشروع جديد على [Supabase](https://supabase.com)
2. شغّل ملف `supabase/schema.sql` في SQL Editor
3. عطّل Email Confirmation من Authentication → Providers → Email

## 📁 هيكل المشروع

```
src/
├── components/     # المكونات المشتركة
├── contexts/       # React Contexts (Auth, Toast)
├── hooks/          # Custom Hooks
├── lib/            # Supabase client
├── pages/          # صفحات التطبيق
├── styles/         # ملفات CSS
└── types/          # TypeScript types
```

## 📄 الترخيص

هذا المشروع خاص ومملوك لـ Cortex Studio.

---

**صنع بـ ❤️ لخدمة القرآن الكريم**
