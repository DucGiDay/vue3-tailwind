import apiAI from '@/api/axios-ai';
import api from '@/api/axios';
import { SMART_REPORT_ENDPOINTS } from './smart-report.endpoints';

export const smartReportService = {
  // ── Core report ────────────────────────────────────────────────────────────
  generateReport: (payload) =>
    apiAI.post(SMART_REPORT_ENDPOINTS.GENERATE_REPORT, payload),

  // ── Daily sessions ─────────────────────────────────────────────────────────
  getSessions: (params) =>
    apiAI.get(SMART_REPORT_ENDPOINTS.SESSIONS, { params }),

  getSessionDetail: (sessionId) =>
    apiAI.get(SMART_REPORT_ENDPOINTS.SESSION_DETAIL(sessionId)),

  // ── Weekly sessions ────────────────────────────────────────────────────────
  getWeekSessions: (params) =>
    apiAI.get(SMART_REPORT_ENDPOINTS.WEEK_SESSIONS, { params }),

  getWeekSessionDetail: (params) =>
    apiAI.get(SMART_REPORT_ENDPOINTS.WEEK_SESSION_DETAIL, { params }),

  // ── Favorite (Knowledge) ───────────────────────────────────────────────────
  getFavoriteReports: (params) =>
    apiAI.get(SMART_REPORT_ENDPOINTS.FAVORITE_REPORTS, { params }),

  setFavoriteReport: (payload) =>
    apiAI.post(SMART_REPORT_ENDPOINTS.FAVORITE_REPORT, payload),

  delFavoriteReport: (payload) =>
    apiAI.delete(SMART_REPORT_ENDPOINTS.FAVORITE_REPORT, { data: payload }),

  // ── Feedback & rating ──────────────────────────────────────────────────────
  sendFeedback: (payload) =>
    apiAI.post(SMART_REPORT_ENDPOINTS.FEEDBACK, payload),

  sendStoreRating: (payload) =>
    apiAI.post(SMART_REPORT_ENDPOINTS.STORE_RATING, payload),

  // ── Logging ────────────────────────────────────────────────────────────────
  loggingEventAI: (payload) =>
    apiAI.post(SMART_REPORT_ENDPOINTS.LOG_EVENT, payload),

  // ── Store info (regular API) ───────────────────────────────────────────────
  checkStore: (params) =>
    api.get(SMART_REPORT_ENDPOINTS.CHECK_STORE, { params })
};
