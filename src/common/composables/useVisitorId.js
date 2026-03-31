// composables/useVisitorId.js
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { setCookie } from '@/common/ulties';

const STORAGE_KEY = 'visitor_id';

let fpPromise = null;
let cachedId = null;

async function getVisitorId() {
  // Ưu tiên cache trong memory
  if (cachedId) return cachedId;

  // Fallback localStorage là nguồn chính
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    cachedId = stored;
    // Đồng bộ sang Cookie g-x để hỗ trợ API (Shared Domain)
    setCookie('g-x', cachedId, 365 * 24 * 60);
    return cachedId;
  }

  // Sinh mới từ FingerprintJS
  if (!fpPromise) fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();

  cachedId = result.visitorId;
  localStorage.setItem(STORAGE_KEY, cachedId);
  // Đồng bộ sang Cookie g-x để hỗ trợ API (Shared Domain)
  setCookie('g-x', cachedId, 365 * 24 * 60);
  return cachedId;
}

function resetVisitorId() {
  cachedId = null;
  localStorage.removeItem(STORAGE_KEY);
  setCookie('g-x', '', -1);
  // Lần gọi getVisitorId() tiếp theo sẽ sinh ID mới từ FP
}

export const useVisitorId = () => ({
  getVisitorId,
  resetVisitorId
});
