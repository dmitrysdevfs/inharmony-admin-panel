# 🔧 API Setup Guide — InHarmony Admin Panel

Цей файл пояснює, як налаштувати API для роботи адмін-панелі.

---

## 📦 Що потрібно

Створіть файл `.env.local` у корені проєкту з такими параметрами:

```bash
# Основний API URL (обов'язково)
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api

# Таймаут запитів (опціонально)
NEXT_PUBLIC_API_TIMEOUT=10000
```

⚠️ Без NEXT_PUBLIC_API_BASE_URL додаток не зможе отримувати дані.

---

## 🧠 Як це працює

```
UI Components → src/lib/api.js → /api/collections/[locale] → InHarmony API
```

- Всі запити йдуть через локальні API routes (/api/...)
- Конфігурація зберігається в src/lib/config.js
- Якщо API недоступний — використовуються мокові дані

---

## 🆘 Якщо щось не працює

- Перевірте, чи створено .env.local
- Переконайтесь, що NEXT_PUBLIC_API_BASE_URL вказано правильно
- Перезапустіть dev-сервер: `npm run dev`
- Перевірте консоль на помилки

---

## 📚 Додатково

- `src/lib/api.js` — клієнт для запитів
- `src/lib/config.js` — конфігурація API
- `src/lib/mockData.js` — мокові дані для fallback

---

## 🚀 Тестовий запит

```bash
curl http://localhost:3000/api/collections/ua
```

---

## ✅ Готово!

Після цього адмін-панель має працювати з реальними або тестовими даними.
