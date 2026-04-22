import { CURRENTCY_OPTIONS, CURRENCY_ALLOW_FLOAT } from '@/common/constant/common.constant';
import moment from 'moment';

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

export const formatCurrency = (value, payload) => {
  if (value === undefined || value === null || value === '') return '';
  if (!/^-?[\d.]+(?:e-?\d+)?$/.test(value)) return value;

  const currentBrand = JSON.parse(localStorage.getItem('current_brand') || '{}');
  const currency = currentBrand?.currency || 'VND';

  const label = CURRENTCY_OPTIONS[currency] || '₫';
  const allowFloat = CURRENCY_ALLOW_FLOAT.includes(currency);

  const fractionCount =
    payload?.fractionCount !== undefined ? payload.fractionCount : allowFloat ? 2 : 0;
  const options = {
    minimumFractionDigits: fractionCount,
    maximumFractionDigits: fractionCount
  };

  const numberValue = +value.toString().replaceAll(',', '');

  if (label === '₫') {
    return numberValue.toLocaleString('en-US', options) + ' ' + label;
  }
  return label + ' ' + numberValue.toLocaleString('en-US', options);
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const numberValue = typeof value === 'string' ? +value.replaceAll(',', '') : +value;
  if (Number.isNaN(numberValue)) return '';
  return numberValue.toLocaleString('en-US');
};

/**
 * Làm tròn số với độ chính xác cao tránh sai số dấu phẩy động
 * @param {number|string} val Giá trị cần làm tròn
 * @param {number} decimals Số chữ số thập phân (mặc định 2)
 * @returns {number}
 */
export const roundNumber = (val, decimals = 4) => {
  if (val === null || val === undefined || val === '') return 0;
  const num = +val;
  if (isNaN(num)) return 0;
  const multiplier = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
};

export const formatDate = (value, format = 'DD/MM/YYYY') => {
  if (value === null || value === undefined || value === '') return '';
  return moment(value).format(format);
};

export const wait = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
};

/**
 * Fix asset URL cho micro-frontend (qiankun).
 * Vite dev mode trả về path tương đối (vd: /src/assets/img/icon.svg)
 * mà browser sẽ resolve theo origin của main app → 404.
 * Helper này prepend BASE_URL (vd: http://localhost:5173/) để trỏ đúng sub-app.
 *
 * Cách dùng:
 *   import imgPath from '@/assets/img/photo.png'
 *   const imgUrl = getAssetUrl(imgPath)
 *   <img :src="imgUrl" />
 */
export const getAssetUrl = (importedUrl) => {
  const base = import.meta.env.VITE_SUB_APP_URL;
  if (base && base.startsWith('http') && importedUrl.startsWith('/')) {
    return base.replace(/\/$/, '') + importedUrl;
  }
  return importedUrl;
};

export const setCookie = (name, value, minutes, domain = '') => {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();

  let cookieString = name + '=' + (value || '') + expires + '; path=/; SameSite=None; Secure';

  if (domain) cookieString += '; domain=' + domain;

  document.cookie = cookieString;
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
