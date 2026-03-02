// setting/setting.service.js
import api from '@/api/axios';
import { SETTING_ENDPOINTS } from './setting.endpoints';

export const settingService = {
  getListOrderHistory: (params) => api.get(SETTING_ENDPOINTS.LIST_ORDER_HISTORY, { params }),
};
