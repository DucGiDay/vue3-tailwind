// composables/useValidator.js
import { useField } from 'vee-validate';
import * as globalRules from '../ulties/validate-rules';

export function useValidator(fieldName, rulesArray = [], initialValue = '') {
  const { value, errorMessage, validate, handleBlur, meta } = useField(
    fieldName,
    (val) => {
      for (const rule of rulesArray) {
        const result = typeof rule === 'string' ? globalRules[rule](val) : rule(val);
        if (result !== true) return result;
      }
      return true;
    },
    { initialValue }
  );

  return {
    value,
    // Chỉ hiện lỗi nếu field đã bị "chạm" (dirty) hoặc đã blur
    error: errorMessage,
    displayError: () => (meta.touched ? errorMessage.value : null),
    validate,
    handleBlur
  };
}
