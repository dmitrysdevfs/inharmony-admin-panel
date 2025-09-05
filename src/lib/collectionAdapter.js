// Адаптер для конвертації даних збору з API в формат форми

export const adaptCollectionForForm = collectionData => {
  if (!collectionData) return null;

  return {
    title: collectionData.title || '',
    desc: collectionData.desc || '',
    target: collectionData.target || 0,
    collected: collectionData.collected || 0,
    alt: collectionData.alt || '',
    peopleDonate: collectionData.peopleDonate || 0,
    peopleDonate_title: collectionData.peopleDonate_title || 'донорів',
    days: collectionData.days || '',
    period: collectionData.period || 'днів',
    quantity: collectionData.quantity || 0,
    status: collectionData.status || 'active',
    value: collectionData.value || '',
    importance: collectionData.importance || 'important',
    language: collectionData.language || 'ua',
    long_desc: {
      section1: collectionData.long_desc?.section1 || '',
      section2: collectionData.long_desc?.section2 || '',
      section3: collectionData.long_desc?.section3 || '',
    },
    image: collectionData.image?.[0]?.url || null, // Беремо перше зображення
  };
};

// Адаптер для конвертації даних форми в формат API
export const adaptFormForAPI = formData => {
  return {
    title: formData.title,
    desc: formData.desc,
    target: Number(formData.target),
    collected: Number(formData.collected),
    alt: formData.alt,
    peopleDonate: Number(formData.peopleDonate),
    peopleDonate_title: formData.peopleDonate_title,
    days: formData.days ? Number(formData.days) : 0,
    period: formData.period,
    quantity: Number(formData.quantity),
    status: formData.status,
    value: formData.value,
    importance: formData.importance,
    language: formData.language,
    long_desc: {
      section1: formData.long_desc.section1,
      section2: formData.long_desc.section2 || '',
      section3: formData.long_desc.section3 || '',
    },
    image: formData.image, // base64 або файл
  };
};
