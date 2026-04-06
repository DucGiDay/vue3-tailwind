/**
 * @description Các hàm validate cơ bản cho FABI CMS
 */
export const rules = {
  required: (val) => {
    if (val === null || val === undefined) return 'Trường này không được để trống';
    if (typeof val === 'string' && val.trim() === '') return 'Trường này không được để trống';
    if (Array.isArray(val) && val.length === 0) return 'Vui lòng chọn ít nhất một mục';
    return true;
  },

  email: (val) => {
    if (!val) return true;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(val) || 'Email không hợp lệ';
  },

  phone: (val) => {
    if (!val) return true;
    const pattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return pattern.test(val) || 'Số điện thoại không hợp lệ';
  },

  taxCode: (val) => {
    if (!val) return true;
    // Mã số thuế thường có 10 hoặc 13-14 chữ số (có thể có dấu gạch ngang)
    const pattern = /^[0-9-]{10,14}$/;
    return pattern.test(val) || 'Mã số thuế không hợp lệ (10-14 ký số)';
  },

  minLength: (min) => (val) => {
    if (!val) return true;
    return val.length >= min || `Tối thiểu ${min} ký tự`;
  },

  maxLength: (max) => (val) => {
    if (!val) return true;
    return val.length <= max || `Tối đa ${max} ký tự`;
  },

  url: (val) => {
    if (!val) return true;
    try {
      new URL(val);
      return true;
    } catch (_) {
      return 'Đường dẫn (URL) không hợp lệ';
    }
  },

  number: (val) => {
    if (!val && val !== 0) return true;
    return !isNaN(parseFloat(val)) && isFinite(val) || 'Vui lòng nhập định dạng số';
  }
};

/**
 * @description Hàm tiện ích để validate một object data dựa trên schema rules
 * @param {Object} data - Dữ liệu cần validate
 * @param {Object} schema - Cấu hình rules (vd: { email: [rules.required, rules.email] })
 * @returns {Object} - Object chứa message lỗi { fieldName: 'Error Message' }
 */
export const validateForm = (data, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const fieldRules = Array.isArray(schema[field]) ? schema[field] : [schema[field]];

    for (const rule of fieldRules) {
      if (typeof rule !== 'function') continue;
      
      const result = rule(data[field]);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  });

  return errors;
};
