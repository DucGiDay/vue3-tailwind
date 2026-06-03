<template>
  <FbDateSelect v-model="dates" @update:modelValue="onDateChange" />
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
</script>
