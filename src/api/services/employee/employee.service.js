import api from '@/api/axios';
import { EMPLOYEE_ENDPOINTS } from './employee.endpoints.js';

export const employeeService = {
  getListProduct: (params) => api.get(EMPLOYEE_ENDPOINTS.LIST_PRODUCT, { params }),
  getRequest: (params) => api.get(EMPLOYEE_ENDPOINTS.LIST_REQUEST_ACCESS, { params }),
  updateProductAccess: (params) => {
    return api.put(EMPLOYEE_ENDPOINTS.REQUEST_ACCESS, params);
  },
  getUsers: (params) => api.get(EMPLOYEE_ENDPOINTS.LIST_USERS, { params }),
};
