// Приклад JSON-запиту для створення нового збору коштів
// POST /api/collections/ua/new

export const exampleCollectionPayload = {
  title: 'Підтримка дітей-сиріт',
  desc: 'Збір коштів на освіту та життєзабезпечення дітей-сиріт',
  target: 50000,
  collected: 15000,
  alt: 'Фото дітей',
  peopleDonate: 156,
  peopleDonate_title: 'донорів',
  days: 30,
  period: 'днів',
  quantity: 12,
  status: 'active',
  value: 'help-for-children',
  importance: 'important',
  language: 'ua',
  long_desc: {
    section1: 'Збір коштів на освіту та життєзабезпечення дітей-сиріт.',
    section2: 'Допоможіть зібрати кошти на навчання та їжу.',
    section3: 'Кожна копійка дорога та необхідна.',
  },
  image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...', // base64 encoded image
};

// Схема валідації для React Hook Form
export const collectionValidationSchema = {
  title: {
    required: "Назва обов'язкова",
    maxLength: { value: 48, message: 'Максимум 48 символів' },
  },
  desc: {
    required: "Короткий опис обов'язковий",
    maxLength: { value: 144, message: 'Максимум 144 символи' },
  },
  target: {
    required: "Цільова сума обов'язкова",
    min: { value: 0, message: 'Сума не може бути відʼємною' },
  },
  collected: {
    required: "Зібрана сума обов'язкова",
    min: { value: 0, message: 'Сума не може бути відʼємною' },
  },
  alt: {
    required: "Опис зображення обов'язковий",
    maxLength: { value: 24, message: 'Максимум 24 символи' },
  },
  peopleDonate: {
    required: "Кількість донорів обов'язкова",
    min: { value: 0, message: 'Кількість не може бути відʼємною' },
  },
  peopleDonate_title: {
    required: "Текст для донорів обов'язковий",
  },
  value: {
    required: "Унікальний тег обов'язковий",
    maxLength: { value: 48, message: 'Максимум 48 символів' },
  },
  importance: {
    required: "Важливість збору обов'язкова",
  },
  period: {
    required: "Період обов'язковий",
  },
  long_desc: {
    section1: {
      required: "Перша секція обов'язкова",
    },
  },
};

// Типи полів для TypeScript (якщо використовується)
// export const CollectionFormData = {
//   title: string; // max 48 chars
//   desc: string; // max 144 chars
//   target: number; // min 0
//   collected: number; // min 0
//   alt: string; // max 24 chars
//   peopleDonate: number; // min 0
//   peopleDonate_title: 'донорів' | 'донори' | 'донор' | 'donor' | 'donors';
//   days: number; // min 0, optional
//   period: 'day' | 'days' | 'день' | 'дні' | 'днів';
//   quantity: number; // min 0, optional
//   status: 'active' | 'closed';
//   value: string; // max 48 chars, unique
//   importance: 'urgent' | 'important' | 'non-urgent' | 'permanent';
//   language: 'ua' | 'en';
//   long_desc: {
//     section1: string; // required
//     section2?: string; // optional
//     section3?: string; // optional
//   };
//   image: string; // base64 або URL
// };

// Опис структури даних для JavaScript
export const COLLECTION_FORM_STRUCTURE = {
  title: 'string (max 48 chars)',
  desc: 'string (max 144 chars)',
  target: 'number (min 0)',
  collected: 'number (min 0)',
  alt: 'string (max 24 chars)',
  peopleDonate: 'number (min 0)',
  peopleDonate_title: 'string (донорів | донори | донор | donor | donors)',
  days: 'number (min 0, optional)',
  period: 'string (day | days | день | дні | днів)',
  quantity: 'number (min 0, optional)',
  status: 'string (active | closed)',
  value: 'string (max 48 chars, unique)',
  importance: 'string (urgent | important | non-urgent | permanent)',
  language: 'string (ua | en)',
  long_desc: {
    section1: 'string (required)',
    section2: 'string (optional)',
    section3: 'string (optional)',
  },
  image: 'string (base64 або URL)',
};

// Додаткові константи
export const SUPPORTED_LOCALES = ['ua', 'en'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
