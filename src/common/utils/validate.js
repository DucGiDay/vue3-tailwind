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
    return (!isNaN(parseFloat(val)) && isFinite(val)) || 'Vui lòng nhập định dạng số';
  }
};

/**
 * @description Hàm lõi thực hiện validate dữ liệu của 1 trường dựa trên danh sách quy tắc
 * @private
 */
const runValidation = (value, fieldRules) => {
  const rulesArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules];

  for (const rule of rulesArray) {
    const ruleFn = typeof rule === 'string' ? rules[rule] : rule;
    if (typeof ruleFn !== 'function') continue;

    const result = ruleFn(value);
    if (result !== true) return result;
  }
  return true;
};

/**
 * @description Hàm tiện ích để validate một object data dựa trên schema rules
 * @param {Object} data - Dữ liệu cần validate
 * @param {Object} schema - Cấu hình rules (vd: { email: [rules.required, rules.email] })
 * @returns {Object} - Object chứa message lỗi { fieldName: 'Error Message' }
 */
export const validateForm = (data, schema) => {
  return Object.keys(schema).reduce((errors, field) => {
    const result = runValidation(data[field], schema[field]);
    if (result !== true) errors[field] = result;
    return errors;
  }, {});
};

/**
 * @description Helper to get nested value from object via path string (e.g. 'extra_data.cus_email')
 * @private
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * @description Validate một object data dựa trên danh sách fields chứa thuộc tính rules
 * @param {Object} data - Dữ liệu cần validate
 * @param {Array} fields - Danh sách các field (vd: [{ id: 'email', rules: ['required', 'email' }])
 * @returns {Object} - Object chứa message lỗi
 */
export const validateByFields = (data, fields) => {
  return fields.reduce((errors, field) => {
    if (field.rules) {
      const value = getNestedValue(data, field.id);
      const result = runValidation(value, field.rules);
      if (result !== true) errors[field.id] = result;
    }
    return errors;
  }, {});
};
