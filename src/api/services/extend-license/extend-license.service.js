import api from '@/api/axios';
import { EXTEND_LICENSE_ENDPOINTS } from './extend-license.endpoints';

export const extendLicenseService = {
  getListOrderHistory: (params) => api.get(EXTEND_LICENSE_ENDPOINTS.LIST_ORDER_HISTORY, { params }),
  getQRPayment: (params) => api.get(EXTEND_LICENSE_ENDPOINTS.QR_PAYMENT, { params }),
  checkPayment: (params) => api.get(EXTEND_LICENSE_ENDPOINTS.CHECK_PAYMENT, { params }),

  updateStatusOrder: (payload) => api.post(EXTEND_LICENSE_ENDPOINTS.UPDATE_STATUS_ORDER, payload),
  cancelOrder: (payload) => api.post(EXTEND_LICENSE_ENDPOINTS.CANCEL_ORDER, payload)
};
