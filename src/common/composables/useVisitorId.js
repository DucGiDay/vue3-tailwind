// composables/useVisitorId.js
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { setCookie } from '@/common/utils/common';

const STORAGE_KEY = 'visitor_id';

let fpPromise = null;
let cachedId = null;
let cachedStableId = null;
const STABLE_STORAGE_KEY = 'stable_visitor_id';

const getSharedDomain = () => {
  const host = window.location.hostname;
  if (host.includes('ipos.vn')) return '.ipos.vn';
  return '.ipos.vn';
};

async function getVisitorId() {
  // Ưu tiên cache trong memory
  if (cachedId) return cachedId;

  // Fallback localStorage là nguồn chính
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    cachedId = stored;
    // Đồng bộ sang Cookie g-x để hỗ trợ API (Shared Domain)
    setCookie('g-x', cachedId, 365 * 24 * 60, getSharedDomain());
    return cachedId;
  }

  // Sinh mới từ FingerprintJS
  if (!fpPromise) fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();

  cachedId = result.visitorId;
  localStorage.setItem(STORAGE_KEY, cachedId);
  // Đồng bộ sang Cookie g-x để hỗ trợ API (Shared Domain)
  setCookie('g-x', cachedId, 365 * 24 * 60, getSharedDomain());
  return cachedId;
}

async function resetVisitorId() {
  cachedId = null;
  cachedStableId = null;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STABLE_STORAGE_KEY);
  setCookie('g-x', '', -1, getSharedDomain());
  // Lần gọi getVisitorId() tiếp theo sẽ sinh ID mới từ FP
}

export async function buildStableId(components) {
  const payload = {
    platform: components.platform?.value,
    timezone: components.timezone?.value,
    languages: components.languages?.value,
    screen: components.screenResolution?.value,
    hardwareConcurrency: components.hardwareConcurrency?.value,
    deviceMemory: components.deviceMemory?.value
  };

  const json = JSON.stringify(payload);

  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(json));

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getStableVisitorId() {
  // Ưu tiên cache trong memory
  if (cachedStableId) return cachedStableId;

  // Fallback localStorage
  const stored = localStorage.getItem(STABLE_STORAGE_KEY);
  if (stored) {
    cachedStableId = stored;
    // Đồng bộ sang Cookie g-x
    await setCookie('g-x', cachedStableId, 365 * 24 * 60, getSharedDomain());
    return cachedStableId;
  }

  // Sinh mới nếu chưa có
  if (!fpPromise) fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  const stableId = await buildStableId(result.components);

  cachedStableId = stableId;
  localStorage.setItem(STABLE_STORAGE_KEY, cachedStableId);
  await setCookie('g-x', cachedStableId, 365 * 24 * 60, getSharedDomain());

  return cachedStableId;
}

export const useVisitorId = () => ({
  getVisitorId,
  resetVisitorId,
  buildStableId,
  getStableVisitorId
});
