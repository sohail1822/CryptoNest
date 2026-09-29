export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors
      .map((item) => item?.message || item?.msg)
      .filter(Boolean)
      .join(', ') || fallback;
  }

  if (typeof error?.message === 'string' && error.message.trim() && !error.response) {
    return error.message;
  }

  return fallback;
};

export const isUnauthorizedError = (error) => error?.response?.status === 401;
