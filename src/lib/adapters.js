export const adaptCollection = collection => ({
  id: collection._id,
  title: collection.title,
  description: collection.desc || '',
  goal: collection.target || 0,
  raised: collection.collected || 0,
  status: collection.status,
  createdAt: collection.createdAt,
  updatedAt: collection.updatedAt || collection.createdAt,
  peopleDonate: collection.peopleDonate || 0,
  importance: collection.importance || 'normal',
  image: collection.image?.[0]?.url || null,
  long_desc: collection.long_desc || {},
});
