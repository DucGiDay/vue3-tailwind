<script setup>
import { computed, ref, watch } from 'vue';
import { roundNumber } from '@/common/utils/common';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import moment from 'moment';
import BillContent from './BillContent.vue';
import {
  SALE_CHANGE_LOG_TYPE,
  LOG_TYPES_DISPLAY_MESSAGE,
  LOG_TYPES_NOT_DISPLAY_SEE_DETAIL
} from '@/common/constant/sale-change-log.constant';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  tranId: {
    type: String,
    default: ''
  },
  tranDate: {
    type: [String, Number],
    default: ''
  },
  storeUid: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:visible']);

const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

const logs = ref([]);
const isLoading = ref(false);
const expandedDetails = ref({});

const show = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// Logic Helpers
const logTypeNotDisplayed = [
  SALE_CHANGE_LOG_TYPE.SALE_CHANGE,
  SALE_CHANGE_LOG_TYPE.SALE_MERGE_ORDER,
  SALE_CHANGE_LOG_TYPE.SALE_SPLIT_ORDER,
  'SWITCH_TABLE'
];

const logTypeDisplayedMsgModifyTable = [
  SALE_CHANGE_LOG_TYPE.RE_PRINT_ORDER,
  SALE_CHANGE_LOG_TYPE.RE_PRINT_BILL,
  SALE_CHANGE_LOG_TYPE.LOG_USE_PIN,
  SALE_CHANGE_LOG_TYPE.LOG_ITEM_TIME_SERVICE,
  SALE_CHANGE_LOG_TYPE.LOG_REMOVE_INCLOUD
];

const logTypeDisplayedSeeDetail = [
  SALE_CHANGE_LOG_TYPE.RE_PRINT_ORDER,
  SALE_CHANGE_LOG_TYPE.RE_PRINT_BILL
];

const isSplitTwoVat = (logType) => logType === 'SPLIT_TWO_VAT';
const isLogItemTimeService = (logType) => logType === SALE_CHANGE_LOG_TYPE.LOG_ITEM_TIME_SERVICE;
const isShowLogType = (logType) => !logTypeNotDisplayed.includes(logType);

const getLogTypeName = (value) => {
  if (value === 'PRINT_CHECK_LIST') return 'In checklist';
  if (value === 'CANCEL_ORDER_ONLINE') return 'Hủy đơn Online';
  return 'In tạm tính';
};

const formatTimeSecond = (value) => {
  if (!value) return '';
  return moment(+value).format('DD/MM/YYYY HH:mm:ss');
};

const truncateString = (str) => {
  if (!str) return '';
  return str.length > 8 ? '...' + str.slice(-5) : str;
};

const toppingText = (value) => {
  if (!value || !value.length) return '';
  return value
    .map((topping) => {
      const toppingStr = `${topping.item_name} (x${topping.quantity})`;
      if (topping.sub_topping?.length) {
        const subToppingStr = topping.sub_topping
          .map((sub) => `${sub.item_name} (x${sub.quantity})`)
          .join(', ');
        return `${toppingStr} {${subToppingStr}}`;
      }
      return toppingStr;
    })
    .join(', ');
};

const toggleDetail = (id) => {
  expandedDetails.value[id] = !expandedDetails.value[id];
};

const getData = async () => {
  if (!props.tranId || !props.storeUid) return;

  isLoading.value = true;
  const payload = {
    company_uid: globalStore.currentUser?.company_uid,
    brand_uid: globalStore.brandUid,
    store_uid: props.storeUid,
    tran_id: props.tranId,
    start_date: moment(props.tranDate).startOf('month').valueOf(),
    end_date: moment(props.tranDate).endOf('month').valueOf()
  };
  const res = await invoiceStore.getSaleChangeLog(payload);
  logs.value = res?.data || [];

  if (res?.error) {
    console.error('Lỗi khi lấy nhật ký order:', res?.error?.message);
  }

  isLoading.value = false;
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      getData();
    } else {
      logs.value = [];
      expandedDetails.value = {};
    }
  }
);
</script>

<template>
  <Dialog
    v-model:visible="show"
    class="fb-w-[60vw]"
    position="top"
    modal
    :breakpoints="{ '1199px': '80vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="fb-w-full fb-text-center fb-font-bold fb-text-xl fb-text-gray-700">
        Nhật ký order
      </div>
    </template>

    <div class="fb-flex fb-flex-col fb-gap-4 fb-py-2">
      <template v-if="isLoading">
        <div v-for="n in 3" :key="n" class="fb-border fb-border-gray-200 fb-rounded-lg fb-p-4">
          <Skeleton width="40%" height="1rem" class="mb-2" />
          <Skeleton width="100%" height="2rem" />
        </div>
      </template>

      <template v-else-if="logs.length > 0">
        <div v-for="log in logs" :key="log.sale_change_id" class="fb-flex fb-flex-col fb-gap-2">
          <!-- Tran ID header if useful -->
          <div
            class="fb-border fb-border-gray-200 fb-rounded-lg fb-overflow-hidden fb-shadow-sm fb-bg-white"
          >
            <!-- Header: Thông tin chung của log -->
            <div class="fb-bg-gray-50 fb-p-3 fb-border-b fb-border-gray-200">
              <div class="fb-flex fb-justify-between fb-items-start">
                <div class="fb-flex fb-flex-col fb-gap-1">
                  <div
                    class="fb-font-bold fb-text-[0.9375rem] fb-text-gray-800 fb-flex fb-flex-wrap fb-gap-1.5"
                  >
                    <span>#{{ truncateString(log.tran_id) }}</span>
                    <span>-</span>
                    <span>{{ log.change_data?.tran_no }}</span>
                    <template v-if="log.change_data?.table_name">
                      <span>-</span>
                      <span>{{ log.change_data.table_name }}</span>
                      <span
                        v-if="log.change_data.sale_type === 'FOODBOOK'"
                        class="fb-text-blue-600"
                      >
                        (#{{ log.change_data.foodbook_order_id }})
                      </span>
                    </template>
                    <span>-</span>
                    <span>TN: {{ log.change_data?.employee_name }}</span>
                    <span v-if="log.device_code">- {{ log.device_code }}</span>
                    <span v-if="log.log_type === SALE_CHANGE_LOG_TYPE.SALE_CHANGE">
                      - STT: {{ log.change_data?.order_no }}
                    </span>
                  </div>

                  <!-- Thông báo từ extra_data -->
                  <div
                    v-if="LOG_TYPES_DISPLAY_MESSAGE.includes(log.log_type)"
                    class="fb-text-sm fb-text-blue-600 fb-italic fb-mt-1"
                  >
                    {{ log.change_data?.extra_data?.message_modify_table }}
                  </div>

                  <!-- Note -->
                  <div v-if="log.change_data?.sale_note" class="fb-text-sm fb-text-gray-500 fb-mt-1">
                    <span class="fb-font-semibold">Ghi chú:</span>
                    {{ log.change_data.sale_note }}
                  </div>
                </div>

                <div class="fb-text-sm fb-text-gray-600 fb-shrink-0 fb-font-medium">
                  {{ formatTimeSecond(log.change_data?.start_date) }}
                </div>
              </div>

              <!-- Dòng trạng thái log & Tổng tiền -->
              <div
                v-if="isShowLogType(log.log_type)"
                class="fb-flex fb-justify-between fb-items-center fb-mt-3 fb-pt-2 fb-border-t fb-border-gray-100"
              >
                <div class="fb-text-sm fb-font-bold fb-text-amber-600 uppercase fb-tracking-wider">
                  <span v-if="isSplitTwoVat(log.log_type)">Thông tin HĐ trước khi tách</span>
                  <span v-else-if="log.log_type === 'CANCEL_ORDER_ONLINE'">
                    {{ getLogTypeName(log.log_type) }}. Lý do:
                    {{ log.change_data?.extra_data?.message_modify_table?.split('.')[1]?.trim() }}
                  </span>
                  <span v-else>
                    {{ getLogTypeName(log.log_type) }}
                    <template v-if="log.change_data?.extra_data?.number_print_check_list">
                      ({{ log.change_data.extra_data.number_print_check_list }} lần in)
                    </template>
                  </span>
                </div>
                <div
                  v-if="!logTypeDisplayedMsgModifyTable.includes(log.log_type)"
                  class="fb-text-base fb-font-bold fb-text-gray-800"
                >
                  {{ $formatCurrency(log.change_data?.total_amount) }}
                </div>
              </div>
            </div>

            <!-- Body: Chi tiết món ăn -->
            <div
              v-if="!LOG_TYPES_NOT_DISPLAY_SEE_DETAIL.includes(log.log_type)"
              class="fb-p-2 fb-bg-white"
            >
              <!-- Trường hợp hiển thị BillContent đầy đủ -->
              <template v-if="isShowLogType(log.log_type) && !isLogItemTimeService(log.log_type)">
                <div
                  v-if="expandedDetails[log.sale_change_id]"
                  class="fb-mb-2 fb-border fb-rounded"
                >
                  <BillContent
                    :sale="
                      logTypeDisplayedSeeDetail.includes(log.log_type)
                        ? log.sale_current
                        : log.change_data
                    "
                  />
                </div>
                <div
                  class="fb-text-center fb-py-2 fb-text-blue-600 fb-text-base fb-font-medium fb-cursor-pointer hover:fb-underline"
                  @click="toggleDetail(log.sale_change_id)"
                >
                  {{ expandedDetails[log.sale_change_id] ? 'Thu gọn' : 'Xem chi tiết' }}
                </div>
              </template>

              <!-- Trường hợp chỉ hiện danh sách món -->
              <template v-else>
                <div class="fb-flex fb-flex-col fb-divide-y fb-divide-gray-50">
                  <div
                    v-for="(detail, dIdx) in isLogItemTimeService(log.log_type)
                      ? log.sale_current?.sale_detail
                      : log.change_data?.sale_detail"
                    :key="dIdx"
                    class="fb-py-2 fb-px-1 fb-flex fb-justify-between fb-items-start"
                  >
                    <div class="fb-flex fb-flex-col fb-gap-1">
                      <div class="fb-flex fb-items-center fb-gap-3">
                        <span
                          class="fb-text-base fb-text-gray-800 fb-font-medium"
                          :class="{ 'fb-line-through fb-text-gray-400': detail.quantity < 0 }"
                        >
                          {{ detail.item_name }}
                        </span>
                        <span
                          class="fb-text-xs fb-text-gray-400 fb-flex fb-items-center fb-gap-1"
                        >
                          <i class="far fa-clock"></i>
                          {{ detail.hour }}:{{ detail.minute }}
                        </span>
                      </div>
                      <div class="fb-text-sm fb-text-gray-500">
                        {{ toppingText(detail.toppings) }}
                      </div>
                      <div v-if="detail.note" class="fb-text-sm fb-text-red-500 fb-italic">
                        Lý do: {{ detail.note }}
                      </div>
                    </div>
                    <div class="fb-font-bold fb-text-gray-700 fb-text-base">
                      x{{ roundNumber(detail.quantity) }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="fb-text-center fb-py-8 fb-text-gray-400">Chưa có nhật ký order</div>
    </div>
  </Dialog>
</template>
