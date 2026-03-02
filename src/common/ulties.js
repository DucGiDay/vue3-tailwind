// Lấy time trong ngày dạng ISO
export const setTimeISO = (hour, minute = 0) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

// Convert từ PascalCase sang kebab-case
export const pascalToKebab = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Convert từ PascalCase sang camelCase
export const pascalToCamel = (str) => {
  if (!str) return str;
  return str[0].toLowerCase() + str.slice(1);
};

export const formatCurrency = (value) => {
  if (!value) return '';
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
