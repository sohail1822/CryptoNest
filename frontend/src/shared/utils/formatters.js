const isFiniteNumber = (value) => value !== null && value !== '' && Number.isFinite(Number(value));

export const formatCurrency = (
  value,
  { currency = 'INR', compact = false, maximumFractionDigits = 2 } = {}
) => {
  if (!isFiniteNumber(value)) return '—';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits,
  }).format(Number(value));
};

export const formatNumber = (value, { compact = false, maximumFractionDigits = 2 } = {}) => {
  if (!isFiniteNumber(value)) return '—';

  return new Intl.NumberFormat('en-IN', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits,
  }).format(Number(value));
};

export const formatPercentage = (
  value,
  { showSign = false, maximumFractionDigits = 2 } = {}
) => {
  if (!isFiniteNumber(value)) return '—';
  const number = Number(value);
  const sign = showSign && number > 0 ? '+' : '';
  return `${sign}${number.toFixed(maximumFractionDigits)}%`;
};

export const formatCryptoQuantity = (value, { maximumFractionDigits = 6 } = {}) => {
  if (!isFiniteNumber(value)) return '—';

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits,
  }).format(Number(value));
};

export const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
