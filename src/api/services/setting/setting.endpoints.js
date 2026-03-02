// setting/setting.endpoints.js
export const SETTING_ENDPOINTS = {
  LIST_ORDER_HISTORY: '/forward/billing/pos-cms/api/v3/order-online',
  DETAIL_ORDER_HISTORY: (id) => `/forward/billing/pos-cms/api/v3/order-online/${id}`,
};