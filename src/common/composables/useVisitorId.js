// composables/useVisitorId.js
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { setCookie } from '@/common/utils/common';

const STORAGE_KEY = 'visitor_id';
const STABLE_STORAGE_KEY = 'stable_visitor_id';

let fpPromise = null;
let cachedId = null;
let cachedStableId = null;

const getSharedDomain = () => {
  const host = window.location.hostname;
  if (host.includes('ipos.vn')) return '.ipos.vn';
  return '.ipos.vn';
};

// Safe localStorage access helpers
const safeGetItem = (key) => {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
  } catch (e) {
    console.warn(`[Storage] Failed to read key "${key}" from localStorage:`, e);
    return null;
  }
};

const safeSetItem = (key, value) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`[Storage] Failed to write key "${key}" to localStorage:`, e);
  }
};

// Helper for wrapping promise in timeout
const withTimeout = (promise, ms, fallbackValue) => {
  let timer = null;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      console.warn(`[Timeout] Promise timed out after ${ms}ms.`);
      resolve(fallbackValue);
    }, ms);
  });

  return Promise.race([
    promise.then((res) => {
      if (timer) clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
};

// Fallback UUID generator
const generateUUID = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (e) {}

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Pure JS SHA-256 implementation
function sha256_js(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;

  let result = '';
  const words = [];
  const asciiLength = ascii[lengthProperty] * 8;

  let hash = sha256_js.h = sha256_js.h || [];
  const k = sha256_js.k = sha256_js.k || [];
  let primeCounter = k[lengthProperty];

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = 1;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return ''; // ASCII only fallback check
    words[i >> 2] |= j << (24 - (i % 4) * 8);
  }
  words[words[lengthProperty]] = ((asciiLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiLength | 0);

  let H0 = hash[0], H1 = hash[1], H2 = hash[2], H3 = hash[3], H4 = hash[4], H5 = hash[5], H6 = hash[6], H7 = hash[7];
  for (i = 0; i < words[lengthProperty]; i += 16) {
    const w = words.slice(i, i + 16);
    let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;
    for (j = 0; j < 64; j++) {
      if (j >= 16) {
        const w15 = w[j - 15], w2 = w[j - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = s0 + maj;
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = h + s1 + ch + k[j] + (w[j] || 0);
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
    H5 = (H5 + f) | 0;
    H6 = (H6 + g) | 0;
    H7 = (H7 + h) | 0;
  }

  const hashWords = [H0, H1, H2, H3, H4, H5, H6, H7];
  for (i = 0; i < 8; i++) {
    const hex = (hashWords[i] >>> 0).toString(16);
    result += hex.padStart(8, '0');
  }
  return result;
}

export async function buildStableId(components) {
  const payload = {
    platform: components?.platform?.value,
    timezone: components?.timezone?.value,
    languages: components?.languages?.value,
    screen: components?.screenResolution?.value,
    hardwareConcurrency: components?.hardwareConcurrency?.value,
    deviceMemory: components?.deviceMemory?.value
  };

  const json = JSON.stringify(payload);

  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(json));
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch (e) {
    console.warn('[StableId] Web Crypto SHA-256 failed, using fallback JS SHA-256.', e);
  }

  return sha256_js(json);
}

async function getVisitorId() {
  if (cachedId) return cachedId;

  const stored = safeGetItem(STORAGE_KEY);
  if (stored) {
    cachedId = stored;
    setCookie('g-x', cachedId, 365 * 24 * 60, getSharedDomain());
    return cachedId;
  }

  let visitorId = '';
  try {
    if (!fpPromise) fpPromise = FingerprintJS.load();
    const fp = await withTimeout(fpPromise, 1500, null);
    if (fp) {
      const result = await withTimeout(fp.get(), 1500, null);
      if (result && result.visitorId) {
        visitorId = result.visitorId;
      }
    }
  } catch (e) {
    console.error('[VisitorId] Failed to load/get FingerprintJS:', e);
  }

  if (!visitorId) {
    console.warn('[VisitorId] FingerprintJS failed or timed out. Falling back to generated UUID.');
    visitorId = generateUUID();
  }

  cachedId = visitorId;
  safeSetItem(STORAGE_KEY, cachedId);
  setCookie('g-x', cachedId, 365 * 24 * 60, getSharedDomain());
  return cachedId;
}

async function getStableVisitorId() {
  if (cachedStableId) return cachedStableId;

  const stored = safeGetItem(STABLE_STORAGE_KEY);
  if (stored) {
    cachedStableId = stored;
    setCookie('g-x', cachedStableId, 365 * 24 * 60, getSharedDomain());
    return cachedStableId;
  }

  let stableId = '';
  try {
    if (!fpPromise) fpPromise = FingerprintJS.load();
    const fp = await withTimeout(fpPromise, 1500, null);
    if (fp) {
      const result = await withTimeout(fp.get(), 1500, null);
      if (result && result.components) {
        stableId = await buildStableId(result.components);
      }
    }
  } catch (e) {
    console.error('[StableId] Failed to generate stable ID via FingerprintJS:', e);
  }

  if (!stableId) {
    console.warn('[StableId] FingerprintJS failed or timed out. Generating random fallback stable ID.');
    stableId = sha256_js(generateUUID());
  }

  cachedStableId = stableId;
  safeSetItem(STABLE_STORAGE_KEY, cachedStableId);
  setCookie('g-x', cachedStableId, 365 * 24 * 60, getSharedDomain());

  return cachedStableId;
}

async function resetVisitorId() {
  cachedId = null;
  cachedStableId = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(STABLE_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('[Storage] Failed to remove items from localStorage:', e);
  }
  setCookie('g-x', '', -1, getSharedDomain());
}

export const useVisitorId = () => ({
  getVisitorId,
  resetVisitorId,
  buildStableId,
  getStableVisitorId
});
