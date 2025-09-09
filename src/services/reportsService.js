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
    throw new Error(errorMessage);
  }

  return data;
};

// Get all reports
export const fetchReports = async () => {
  const res = await fetch('/api/reports', {
    credentials: 'include',
  });
  const data = await handleResponse(res);

  // Normalize response to always return an array
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.data)) {
    return data.data;
  } else if (data && Array.isArray(data.reports)) {
    return data.reports;
  } else {
    return [];
  }
};

// Delete report
export const deleteReport = async reportId => {
  const res = await fetch(`/api/reports/${reportId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  // For 204 No Content, return success without parsing JSON
  if (res.status === 204) {
    return { success: true };
  }

  // For other responses, handle errors properly
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.error || 'Failed to delete report');
    error.status = res.status;
    throw error;
  }

  return { success: true };
};
