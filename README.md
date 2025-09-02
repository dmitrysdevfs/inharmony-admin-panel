# InHarmony Admin Panel

Стартовий шаблон на основі Next.js 15.4.3.

## Призначення

Цей шаблон надає чисту та мінімальну основу для frontend проектів з використанням Next.js та React.  
Включає інтеграцію ESLint та Prettier для забезпечення якості коду та форматування в команді.  
Розроблений для спільної розробки, допомагає командам швидко почати з уніфікованою структурою та стилем.

## Технології

- Next.js 15.4.3
- React 19
- ESLint 9
- Prettier

## 🚀 Швидкий старт

### 1. Встановлення залежностей
```bash
npm install
```

### 2. Налаштування API (ОБОВ'ЯЗКОВО!)
Створіть файл `.env.local` в корені проекту:

```bash
# ОБОВ'ЯЗКОВО: Основний API URL
NEXT_PUBLIC_API_BASE_URL=YOUR_API_BASE_URL_HERE

# ОПЦІОНАЛЬНО: Fallback API URL
# NEXT_PUBLIC_API_FALLBACK_URL=https://backup-api.example.com

# ОПЦІОНАЛЬНО: API Timeout (в мілісекундах)
# NEXT_PUBLIC_API_TIMEOUT=10000
```

### 3. Запуск додатку
```bash
npm run dev
```

## ⚠️ Важливо!

- **Без `.env.local` файлу додаток не запуститься!**
- **NEXT_PUBLIC_API_BASE_URL** - обов'язковий параметр
- Всі інші параметри мають значення за замовчуванням
- **Для отримання API URL зверніться до команди розробки**

## Можливості

- Flat ESLint конфігурація (eslint.config.mjs) з сумісністю Prettier
- Налаштування Prettier (.prettierrc) для послідовного форматування коду
- Мінімальна настройка без TypeScript або Tailwind (можна додати пізніше)
- Готовність до масштабування зі структурою директорії src/
- Інтеграція API з InHarmony backend
- Система управління колекціями
- Fallback на мокові дані коли API недоступний

## 📚 Документація

- 📚 [API Setup Guide](./docs/API_SETUP.md) - Детальне налаштування API та environment variables
- `src/lib/api.js` - API клієнт для роботи з колекціями
- `src/lib/config.js` - Конфігурація API параметрів

## 🔧 API Endpoints

- **Collections:** `/api/collections/[locale]` - отримання списку зборів
- **Auth:** `/api/auth/login` та `/api/auth/logout` - аутентифікація

## 🆘 Вирішення проблем

Якщо додаток не запускається:
1. Перевірте наявність `.env.local` файлу
2. Переконайтеся, що `NEXT_PUBLIC_API_BASE_URL` налаштований правильно
3. Перезапустіть dev сервер після зміни `.env.local`
4. Для отримання API URL зверніться до команди розробки
