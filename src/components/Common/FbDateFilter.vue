<template>
  <FbDateSelect v-model="dates" v-bind="$attrs" @update:modelValue="onDateChange" />
</template>

<script setup>
import { ref } from 'vue';
import { useFilterStore } from '@/stores/filter.store';
import { storeToRefs } from 'pinia';
import moment from 'moment';
import FbDateSelect from './FbDateSelect.vue';

/**
 * FbDateFilter — Wrapper của FbDateSelect tích hợp filterStore.
 * Đọc giá trị khởi tạo từ store, và ghi lại store khi người dùng chọn ngày.
 */
const emit = defineEmits(['update:modelValue']);

const filterStore = useFilterStore();
const { report } = storeToRefs(filterStore);

const dates = ref([
  report.value.start_date ? new Date(report.value.start_date) : moment().startOf('day').toDate(),
  report.value.end_date ? new Date(report.value.end_date) : moment().endOf('day').toDate()
]);

const onDateChange = async (value) => {
  await filterStore.updateFilter({
    report: {
      ...filterStore.report,
      start_date: new Date(value[0]).setHours(0, 0, 0, 0),
      end_date: new Date(value[1]).setHours(23, 59, 59, 999)
    }
  });

  emit('update:modelValue', value);
};
</script>
