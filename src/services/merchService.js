const handleResponse = async response => {
  let data;

  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = {
      error: 'Invalid JSON response',
      details: `Server returned non-JSON response: ${response.statusText}`,
    };
  }

  if (!response.ok) {
    const errorMessage =
      data?.error || data?.details || data?.message || `Request failed: ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return data;
};

// Get merch settings for all locales
export const fetchMerchSettings = async () => {
  const res = await fetch('/api/merch', {
    credentials: 'include',
  });
  const data = await handleResponse(res);

  // Normalize response to always return an array
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.data)) {
    return data.data;
  } else {
    return [];
  }
};

// Update merch settings for specific locale
export const updateMerchSettings = async (locale, settings) => {
  const res = await fetch(`/api/merch/${locale}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  const data = await handleResponse(res);
  return { data: data.data || data || null };
};

// Helper function to organize merch data by locale
export const organizeMerchByLocale = merchData => {
  const organized = {
    ua: { status: 'off', content: '', link: '', _id: null },
    en: { status: 'off', content: '', link: '', _id: null },
  };

  if (Array.isArray(merchData)) {
    merchData.forEach(item => {
      if (item.locale === 'ua' || item.locale === 'en') {
        organized[item.locale] = {
          _id: item._id,
          status: item.status,
          content: item.content,
          link: item.link,
          locale: item.locale,
        };
      }
    });
  }

  return organized;
};

