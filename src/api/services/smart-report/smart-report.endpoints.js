export const SMART_REPORT_ENDPOINTS = {
  // ── AI endpoints (dùng axios-ai) ───────────────────────────────────────────
  GENERATE_REPORT: '/api/v1/report_analyzer',
  SESSIONS: '/api/v1/chat/sessions',
  SESSION_DETAIL: (sessionId) => `/api/v1/chat/session/${sessionId}`,
  WEEK_SESSIONS: '/api/v1/reports/weekly',
  WEEK_SESSION_DETAIL: '/api/v1/reports/weekly-details',
  FAVORITE_REPORTS: '/api/v1/reports/weekly/favorites',
  FAVORITE_REPORT: '/api/v1/reports/weekly/favorite',
  FEEDBACK: '/api/v1/chat/feedback',
  STORE_RATING: '/api/v1/reports/store-rating',
  LOG_EVENT: '/api/v1/log-follow-time/report-ai',

  // ── Regular API endpoints (dùng axios) ─────────────────────────────────────
  CHECK_STORE: '/api/mdata/v1/store'
};
