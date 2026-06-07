# 🎬 Remotion Master Template — Coolify Deployment

## نظرة عامة على المعمارية

```
[n8n Workflow]
     ↓  POST /render  (JSON)
[Remotion Server on Coolify]
     ↓  يرد بـ URL
[n8n] → يحفظ / يرسل الفيديو
```

---

## خطوات الـ Deployment على Coolify

### 1. ارفع الكود على GitHub

أنشئ repo جديد وارفع محتوى المجلد كاملاً (بما في Dockerfile).

### 2. أضف Service جديد في Coolify

- افتح Coolify → **New Resource** → **Docker**
- اختر **Dockerfile** من الـ repo
- اضبط الـ Port على **3030**

### 3. اضبط Environment Variables في Coolify

| المتغير | القيمة | الشرح |
|---------|--------|-------|
| `PORT` | `3030` | منفذ السيرفر |
| `BASE_URL` | `https://remotion.yourdomain.com` | الدومين الخاص بالسيرفر في Coolify |

### 4. في n8n — أضف Environment Variable

| المتغير | القيمة |
|---------|--------|
| `REMOTION_URL` | `https://remotion.yourdomain.com` |

هذا يُمكّن الـ workflow من معرفة عنوان السيرفر تلقائياً.

---

## Endpoints

| Method | Path | الوصف |
|--------|------|-------|
| `GET` | `/health` | للتحقق أن السيرفر يعمل |
| `POST` | `/render` | توليد فيديو |
| `GET` | `/videos/:file` | تنزيل الفيديو المُولَّد |

---

## مثال على الاستخدام من n8n

**HTTP Request Node:**
```
POST https://remotion.yourdomain.com/render
Content-Type: application/json

{
  "videoType": "fix",
  "title": "Cursor Indexing Stuck",
  "problem": "يتجمد Cursor عند الفهرسة",
  "cause": "ملف .cursorignore غير موجود",
  "solution": [
    { "title": "أنشئ .cursorignore", "code": "touch .cursorignore" },
    { "title": "أضف node_modules" }
  ],
  "cta": { "text": "تابعني!", "handle": "@handle", "emoji": "⚡" }
}
```

**الرد:**
```json
{
  "success": true,
  "url": "https://remotion.yourdomain.com/videos/FixVideo_1234567890.mp4",
  "file": "FixVideo_1234567890.mp4",
  "videoType": "fix"
}
```

---

## أنواع الفيديو

### fix
```json
{
  "videoType": "fix",
  "title": "...",
  "problem": "...",
  "cause": "...",
  "solution": [ { "title": "...", "detail": "...", "code": "..." } ],
  "cta": { "text": "...", "handle": "@...", "emoji": "⚡" }
}
```

### comparison
```json
{
  "videoType": "comparison",
  "toolA": "Cursor", "toolB": "Windsurf",
  "features": [ { "label": "السعر", "a": "$20", "b": "$15" } ],
  "pros": { "Cursor": ["ميزة 1"], "Windsurf": ["ميزة 1"] },
  "cons": { "Cursor": ["عيب 1"], "Windsurf": ["عيب 1"] },
  "winner": "Cursor", "winnerReason": "...",
  "cta": { "text": "...", "handle": "@...", "emoji": "🏆" }
}
```

### workflow
```json
{
  "videoType": "workflow",
  "workflowName": "AI Blog Workflow",
  "steps": [
    { "name": "Input", "icon": "💡", "detail": "...", "tool": "Notion",
      "inputs": ["..."], "outputs": ["..."] }
  ],
  "cta": { "text": "...", "handle": "@...", "emoji": "🤖" }
}
```
