export const handleReportResponse = (response) => {
  if (!response?.success) {
    throw new Error(response?.data?.message || response?.message || 'Có lỗi xảy ra');
  }

  return {
    data: response.data?.data ?? [],
    next_cursor: response.data?.next_cursor?.last_tran_date || response.data?.next_cursor || null,
    last_id: next_cursor?.last_id || null,
    last_tran_id: next_cursor?.last_tran_id || null,
    error: null,
    meta: response?.data ?? {}
  };
};

export const handleListResponse = (response) => {
  if (!response?.success) {
    throw new Error(response?.data?.message || response?.message || 'Có lỗi xảy ra');
  }

  return {
    data: response.data?.data ?? [],
    error: null,
    meta: response?.data ?? {}
  };
};

export const handleListHasTotalPageResponse = (response) => {
  const { data = [], ...meta } = response?.data || {};
  return {
    data,
    error: null,
    meta
  };
};

export const withRetry = async (fn, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay * attempt)); // delay tăng dần
    }
  }
};
