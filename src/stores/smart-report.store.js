import { defineStore } from 'pinia';
import { smartReportService } from '@/api/services/smart-report/smart-report.service';
import { useGlobalStore } from '@/stores/global.store';

// ─── Helpers: Timestamp ────────────────────────────────────────────────────────
export const toTimestampFrom = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const toTimestampTo = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

// ─── Helper: Parse AI response (port từ Vue2 agent.module.js) ─────────────────
function parseErrorData(data) {
  if (!data) return null;
  try {
    if (typeof data === 'object') return null;
    if (typeof data === 'string') {
      let cleaned = data.trim();

      // Strip markdown code fence
      if (cleaned.startsWith('```json') || cleaned.startsWith('```')) {
        cleaned = cleaned
          .replace(/^```json\s*\n?/i, '')
          .replace(/^```\s*\n?/, '')
          .replace(/\n?```\s*$/, '');
      }

      // Protect existing escape sequences
      cleaned = cleaned
        .replace(/\\\\/g, '<<<BACKSLASH>>>')
        .replace(/\\"/g, '<<<QUOTE>>>')
        .replace(/\\n/g, '<<<NEWLINE>>>')
        .replace(/\\t/g, '<<<TAB>>>')
        .replace(/\\r/g, '<<<RETURN>>>');

      // Escape real control characters
      cleaned = cleaned.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');

      // Restore placeholders
      cleaned = cleaned
        .replace(/<<<NEWLINE>>>/g, '\\n')
        .replace(/<<<TAB>>>/g, '\\t')
        .replace(/<<<RETURN>>>/g, '\\r')
        .replace(/<<<QUOTE>>>/g, '\\"')
        .replace(/<<<BACKSLASH>>>/g, '\\\\');

      // Remove trailing commas
      cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'string') {
        try {
          return JSON.parse(parsed);
        } catch {
          return parsed;
        }
      }
      return parsed;
    }
    return null;
  } catch {
    return extractManually(data);
  }
}

function extractManually(str) {
  try {
    if (typeof str === 'object') return str;
    const result = {};
    const cleaned = str
      .replace(/```json/gi, '')
      .replace(/```javascript/gi, '')
      .replace(/```/g, '');

    const unescape = (s) =>
      s
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');

    for (const key of ['overview', 'analysis_details', 'conclude', 'text']) {
      const match = cleaned.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'));
      if (match) result[key] = unescape(match[1]);
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useSmartReportStore = defineStore('smartReport', {
  state: () => ({
    dataAgentReport: {},
    detailSession: {},
    listSession: [],
    listSessionWeek: [],
    detailSessionWeek: {},
    listFavoriteReports: [],
    listQuestionAgent: []
  }),

  getters: {
    firstMessageOfDetailSession: (state) => (state.detailSession?.messages || []).at(0),

    listSessionMap: (state) =>
      state.listSession.reduce((acc, item) => {
        acc[item.session_id] = item;
        return acc;
      }, {})
  },

  actions: {
    // ── Generate Report ──────────────────────────────────────────────────────
    async generateReport(payload) {
      const response = await smartReportService.generateReport(payload);
      console.log(response);

      const result = response?.data || {};
      const parseData = parseErrorData(result?.analysis_details) || result;

      this.dataAgentReport = parseData;

      this.detailSession = {
        store_uid: payload?.store_uid || null,
        brand_uid: payload?.brand_uid || null,
        session_id: result?.session_id || null,
        message_id: result?.cached ? null : result?.message_id || null,
        messages: result?.cached
          ? parseErrorData(result?.history) || result?.history || []
          : [parseData]
      };

      // Sync list session
      this.listSession = this.listSession.map((item) => {
        if (item.session_id === result?.session_id) {
          return {
            ...item,
            messages: result?.cached ? result?.history : [parseData]
          };
        }
        return item;
      });

      this.listQuestionAgent = parseData?.question || [];

      return response;
    },

    // ── Daily Sessions ───────────────────────────────────────────────────────
    async getSessions(params) {
      const response = await smartReportService.getSessions(params);
      this.listSession = response?.data || [];
    },

    async getSessionDetail(sessionId) {
      const response = await smartReportService.getSessionDetail(sessionId);
      const detail = response?.data || {};

      const parsedMessages = (detail.messages || []).map((item) => ({
        ...item,
        content: parseErrorData(item.content) || item.content
      }));

      // Sync list session
      this.listSession = this.listSession.map((item) =>
        item.session_id === detail.session_id ? { ...item, messages: parsedMessages } : item
      );

      this.detailSession = detail;
      this.listQuestionAgent = detail?.question || [];
      this.detailSessionWeek = {}; // reset khi xem daily
    },

    // ── Weekly Sessions ──────────────────────────────────────────────────────
    async getWeekSessions(params) {
      const response = await smartReportService.getWeekSessions(params);
      this.listSessionWeek = response?.data || [];
    },

    async getWeekSessionDetail(params) {
      const response = await smartReportService.getWeekSessionDetail(params);
      const detail = response?.data || {};
      this.detailSessionWeek = detail;
      this.detailSession = {}; // reset khi xem weekly
    },

    // ── Favorite Reports ─────────────────────────────────────────────────────
    async getFavoriteReports(params) {
      const response = await smartReportService.getFavoriteReports(params);
      this.listFavoriteReports = response?.data || [];
    },

    async setFavoriteReport(payload) {
      return smartReportService.setFavoriteReport(payload);
    },

    async delFavoriteReport(payload) {
      return smartReportService.delFavoriteReport(payload);
    },

    // ── Feedback ─────────────────────────────────────────────────────────────
    async sendFeedback(payload) {
      return smartReportService.sendFeedback(payload);
    },

    // ── Store Check ──────────────────────────────────────────────────────────
    async checkStore(params) {
      return smartReportService.checkStore(params);
    },

    // ── Logging ──────────────────────────────────────────────────────────────
    async loggingEventAI(payload) {
      try {
        await smartReportService.loggingEventAI(payload);
      } catch (error) {
        console.error('[SmartReport] Logging failed:', error?.message);
      }
    },

    // ── Setters (sync) ───────────────────────────────────────────────────────
    setDetailSession(payload) {
      this.detailSession = payload;
    },

    setWeekSessionDetail(payload) {
      this.detailSessionWeek = payload;
    }
  }
});
