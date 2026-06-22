<template>
  <div v-if="useSinglePicker" class="fb-flex fb-items-center fb-gap-2">
    <FbDateSelect
      v-model="startDate"
      selectionMode="single"
      :manualInput="true"
      :showFooter="false"
      placeholder="Từ ngày"
      :size="size"
      @update:modelValue="onSingleDateChange"
    />
    <span class="fb-text-gray-500">-</span>
    <FbDateSelect
      v-model="endDate"
      selectionMode="single"
      :manualInput="true"
      :showFooter="false"
      placeholder="Đến ngày"
      :size="size"
      @update:modelValue="onSingleDateChange"
    />
  </div>
  <FbDateSelect v-else v-model="dates" :size="size" @update:modelValue="onDateChange" />
</template>

<script setup>
import { ref } from 'vue';
import { useFilterStore } from '@/stores/filter.store';
import moment from 'moment';
import FbDateSelect from './FbDateSelect.vue';

/**
 * FbDateFilter — Wrapper của FbDateSelect tích hợp filterStore.
 * Đọc giá trị khởi tạo từ store, và ghi lại store khi người dùng chọn ngày.
 */
const props = defineProps({
  module: {
    type: String,
    default: 'report', // 'report' | 'invoice'
  },
  useSinglePicker: {
    type: Boolean,
    default: false,
  },

  size: {
    type: String,
    default: 'small',
  },
});

const emit = defineEmits(['update:modelValue']);

const filterStore = useFilterStore();

const currentState = props.module === 'invoice' ? filterStore.invoice : filterStore.report;

const getDefaultStartDate = () => {
  return props.module === 'invoice'
    ? moment().subtract(6, 'days').startOf('day').valueOf()
    : moment().startOf('day').valueOf();
};
const getDefaultEndDate = () => moment().endOf('day').valueOf();

const dates = ref([
  currentState?.start_date ? new Date(currentState.start_date) : getDefaultStartDate(),
  currentState?.end_date ? new Date(currentState.end_date) : getDefaultEndDate(),
]);

const startDate = ref(dates.value[0]);
const endDate = ref(dates.value[1]);

watch(dates, (newVal) => {
  if (newVal) {
    startDate.value = newVal[0];
    endDate.value = newVal[1];
  }
});

const onDateChange = async (value) => {
  if (value && value[0] && value[1]) {
    await filterStore.updateFilter({
      [props.module]: {
        ...filterStore[props.module],
        start_date: moment(value[0]).startOf('day').valueOf(),
        end_date: moment(value[1]).endOf('day').valueOf(),
      },
    });
  }

  emit('update:modelValue', value);
};

const onSingleDateChange = async () => {
  const value = [startDate.value, endDate.value];
  if (value && value[0] && value[1]) {
    dates.value = value;
    await filterStore.updateFilter({
      [props.module]: {
        ...filterStore[props.module],
        start_date: moment(value[0]).startOf('day').valueOf(),
        end_date: moment(value[1]).endOf('day').valueOf(),
      },
    });
    emit('update:modelValue', value);
  }
};
</script>
