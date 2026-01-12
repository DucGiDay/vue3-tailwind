// src/i18n/index.js

let _i18n = null;

/**
 * Setup i18n (gọi 1 lần trong main.js)
 */
export function setupI18n(i18nInstance) {
  _i18n = i18nInstance;
}

/**
 * Get i18n instance
 */
export function getI18n() {
  return _i18n;
}

/**
 * Translate function - Dùng ở mọi nơi
 */
export function $t(key, params) {
  if (!_i18n) {
    console.warn('[i18n] Not initialized');
    return key;
  }
  return _i18n.t(key, params);
}

/**
 * Translate choice (pluralization)
 */
export function tc(key, choice, params) {
  if (!_i18n) {
    console.warn('[i18n] Not initialized');
    return key;
  }
  return _i18n.tc(key, choice, params);
}

/**
 * Check if key exists
 */
export function te(key) {
  if (!_i18n) return false;
  return _i18n.te(key);
}

/**
 * Get current locale
 */
export function getLocale() {
  if (!_i18n) return 'en';
  return _i18n.locale;
}

/**
 * Set locale
 */
export function setLocale(locale) {
  if (!_i18n) return;
  _i18n.locale = locale;
  localStorage.setItem('currentLanguage', locale);
}

/**
 * Composable để dùng trong <script setup>
 */
export function useI18n() {
  return {
    t:  $t,
    tc,
    te,
    getLocale,
    setLocale,
    i18n: _i18n
  };
}
