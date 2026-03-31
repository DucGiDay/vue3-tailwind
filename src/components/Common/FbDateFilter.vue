<template>
  <DatePicker
    ref="datePicker"
    v-model="dates"
    selectionMode="range"
    :manualInput="false"
    dateFormat="dd/mm/yy"
    inputClass="!fb-font-medium"
    @update:modelValue="onDateChange"
  />
</template>

<script setup>
import { useFilterStore } from '@/stores/filter.store';
import { storeToRefs } from 'pinia';

const filterStore = useFilterStore();

const { report } = storeToRefs(filterStore);
const dates = ref([
  report.value.start_date ? new Date(report.value.start_date) : new Date().setHours(0, 0, 0, 0),
  report.value.end_date ? new Date(report.value.end_date) : new Date().setHours(23, 59, 59, 999)
]);
const datePicker = ref();

const emit = defineEmits(['update:modelValue']);

const onDateChange = async (value) => {
  if (value && value[0] && value[1]) {
    datePicker.value.overlayVisible = false;

    await filterStore.updateFilter({
      report: {
        ...filterStore.report,
        start_date: new Date(value[0]).setHours(0, 0, 0, 0),
        end_date: new Date(value[1]).setHours(23, 59, 59, 999)
      }
    });

    emit('update:modelValue', value);
  }
};
</script>

<style scoped lang="scss">
:deep(.fb-date-filter-input) {
  font-weight: 600;
  font-size: 14px;
}
</style>
