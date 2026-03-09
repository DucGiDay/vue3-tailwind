import api from '@/api/axios';
import { EXTEND_LICENSE_ENDPOINTS } from './extend-license.endpoints';

export const extendLicenseService = {
  getListOrderHistory: (params) => api.get(EXTEND_LICENSE_ENDPOINTS.LIST_ORDER_HISTORY, { params }),
};
