export const ORDER_STATUS = {
  PENDING: 'PENDING', //chờ thanh toán
  PAYING: 'PAYING',
  RECEIVED: 'RECEIVED',
  PROCESSED: 'PROCESSED',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED',
  WAIT_QUALIFY: 'WAIT_QUALIFY',
  CANCELED: 'CANCELED'
};

export const ORDER_STATUS_COLOR = {
  PAYING: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PAID'),
    class: 'fb-text-success-700 fb-bg-success-100'
  },
  PENDING: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--WAIT_TO_PAID'),
    // class: 'fb-text-[#6B7280] fb-bg-[#F3F4F6]' // xám
    class: 'fb-text-warning-700 fb-bg-warning-100'
  },
  RECEIVED: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PAID'),
    // class: 'fb-text-[#2563EB] fb-bg-[#DBEAFE]' // xanh dương

    class: 'fb-text-success-700 fb-bg-success-100'
  },
  PROCESSED: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PAID'),
    // class: 'fb-text-[#7C3AED] fb-bg-[#EDE9FE]' // tím
    class: 'fb-text-success-700 fb-bg-success-100'
  },
  SHIPPING: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PAID'),
    // class: 'fb-text-[#D97706] fb-bg-[#FEF3C7]' // cam
    class: 'fb-text-success-700 fb-bg-success-100'
  },
  COMPLETED: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PAID'),
    class: 'fb-text-success-700 fb-bg-success-100'
  },
  CANCELED: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--CANCELED'),
    class: 'fb-text-[#DC2626] fb-bg-[#FEE2E2]' // đỏ
  },
  WAIT_QUALIFY: {
    label: $t('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PAID'),
    // class: 'fb-text-warning-700 fb-bg-warning-100'
    class: 'fb-text-success-700 fb-bg-success-100'
  }
};

export const ORDER_STATUS_FILTER_LIST = [
  {
    name: $t?.('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PAYING'),
    code: ORDER_STATUS.PAYING
  },
  {
    name: $t?.('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PENDING'),
    code: ORDER_STATUS.PENDING
  },
  {
    name: $t?.('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--RECEIVED'),
    code: ORDER_STATUS.RECEIVED
  },
  {
    name: $t?.('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--PROCESSED'),
    code: ORDER_STATUS.PROCESSED
  },
  {
    name: $t?.('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--SHIPPING'),
    code: ORDER_STATUS.SHIPPING
  },
  {
    name: $t?.('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--COMPLETED'),
    code: ORDER_STATUS.COMPLETED
  },
  {
    name: $t?.('MARKETPLACE_CONSTANT--ORDER_STATUS_FILTER_LIST--WAIT_QUALIFY'),
    code: ORDER_STATUS.WAIT_QUALIFY
  }
];
