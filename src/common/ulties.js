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

export const wait = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
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

/**
 * Fix asset URL cho micro-frontend (qiankun).
 * Vite dev mode trả về path tương đối (vd: /src/assets/img/icon.svg)
 * mà browser sẽ resolve theo origin của main app → 404.
 * Helper này prepend BASE_URL (vd: http://localhost:5173/) để trỏ đúng sub-app.
 *
 * Cách dùng:
 *   const imgUrl = getAssetUrl('@/assets/img/photo.png')
 *   <img :src="imgUrl" />
 */
export const getAssetUrl = (importedUrl) => {
  const base = import.meta.env.VITE_SUB_APP_URL
  if (base && base.startsWith('http') && importedUrl.startsWith('/')) {
    return base.replace(/\/$/, '') + importedUrl
  }
  return importedUrl
}

export const setCookie = (name, value, minutes) => {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

export const getCookie = (name) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
