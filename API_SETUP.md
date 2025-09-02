# API Configuration Guide

## ⚠️ Важливо: Безпечна конфігурація

**API URL більше не світиться в коді!** Система працює тільки з налаштованими environment variables.

## Environment Variables

**Обов'язково** створіть файл `.env.local` в корені проекту:

```bash
# API Configuration (ОБОВ'ЯЗКОВО)
NEXT_PUBLIC_API_BASE_URL=YOUR_API_BASE_URL_HERE

# Fallback API (опціонально)
NEXT_PUBLIC_API_FALLBACK_URL=YOUR_FALLBACK_API_URL_HERE

# API Timeout (в мілісекундах)
NEXT_PUBLIC_API_TIMEOUT=10000
```

### Як створити .env.local

1. Скопіюйте приклад вище в файл `.env.local` в корені проекту
2. Замініть `YOUR_API_BASE_URL_HERE` на реальний API URL
3. Замініть `YOUR_FALLBACK_API_URL_HERE` на fallback API URL (опціонально)

## Що станеться без .env.local?

Без правильно налаштованого `.env.local` файлу:
- ❌ API клієнт не запуститься
- ❌ Покаже помилку: "API конфігурація не налаштована!"
- ❌ Система не буде працювати

## Поточні API Endpoints

### Collections API
- **Base URL:** налаштовується через `NEXT_PUBLIC_API_BASE_URL`
- **Endpoint:** `GET /collections/{locale}`
- **Підтримувані локалізації:** `ua`, `en`
- **Пагінація:** 6 зборів на сторінку за замовчуванням

### Приклад використання
```javascript
import { collectionsApi } from '../lib/api';

// Отримання списку зборів
const collections = await collectionsApi.getCollections('ua', 1, 6);

// Отримання деталей збору
const collection = await collectionsApi.getCollection('ua', 'collection_id');
```

## Fallback механізм

Якщо API недоступний або не налаштований, система автоматично переключається на мокові дані з `src/lib/mockData.js`.

**Причини fallback:**
- API не налаштований (відсутній .env.local)
- API недоступний (помилка мережі)
- API повертає помилку

## Безпека

✅ **API URL винесено в environment variables**
✅ **Не комітьте `.env.local` файл в git**
✅ **Код не містить реальних API endpoints**
✅ **Система не запуститься без правильної конфігурації**
✅ **Документація не містить реальних API endpoints**

## Перевірка конфігурації

При запуску додатку в консолі браузера ви побачите:
- ✅ "API конфігурація налаштована правильно" - якщо все OK
- ❌ "API конфігурація не налаштована!" - якщо потрібно створити .env.local

## Примітка для розробників

Для отримання реальних API endpoints зверніться до команди розробки або документації API.
