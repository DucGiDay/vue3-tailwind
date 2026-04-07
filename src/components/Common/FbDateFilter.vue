<template>
  <DatePicker
    ref="datePicker"
    v-model="dates"
    selectionMode="range"
    :manualInput="false"
    dateFormat="dd/mm/yy"
    inputClass="!fb-font-medium"
    selectOtherMonths
    panelClass="fb-custom-date-panel"
    :responsiveOptions="responsiveOptions"
    @update:modelValue="onDateChange"
  >
    <template #weekheaderlabel>W</template>
    <template #footer>
      <div class="fb-p-4 fb-border-t fb-border-gray-200">
        <div class="fb-flex fb-flex-wrap fb-justify-around fb-gap-2">
          <Button
            v-for="item in PRESET_OPTIONS"
            :key="item.label"
            :label="item.label"
            size="small"
            :severity="currentPreset === item.label ? 'primary' : 'secondary'"
            :outlined="currentPreset === item.label"
            class="!fb-text-xs !fb-py-1 !fb-px-2"
            @click="selectPreset(item)"
          />
        </div>
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';
import { useFilterStore } from '@/stores/filter.store';
import { storeToRefs } from 'pinia';
import moment from 'moment';

const filterStore = useFilterStore();
const { report } = storeToRefs(filterStore);
const datePicker = ref();

const responsiveOptions = ref([
  {
    breakpoint: '769px',
    numMonths: 2
  },
  {
    breakpoint: '0',
    numMonths: 1
  }
]);

const PRESET_OPTIONS = [
  {
    label: 'Hôm nay',
    getValue: () => [moment().startOf('day').toDate(), moment().endOf('day').toDate()]
  },
  {
    label: 'Hôm qua',
    getValue: () => [
      moment().subtract(1, 'days').startOf('day').toDate(),
      moment().subtract(1, 'days').endOf('day').toDate()
    ]
  },
  {
    label: '7 ngày trước',
    getValue: () => [
      moment().subtract(6, 'days').startOf('day').toDate(),
      moment().endOf('day').toDate()
    ]
  },
  {
    label: 'Tháng này',
    getValue: () => [moment().startOf('month').toDate(), moment().endOf('month').toDate()]
  },
  {
    label: 'Tháng trước',
    getValue: () => [
      moment().subtract(1, 'month').startOf('month').toDate(),
      moment().subtract(1, 'month').endOf('month').toDate()
    ]
  }
];

const currentPreset = ref('');

const dates = ref([
  report.value.start_date ? new Date(report.value.start_date) : moment().startOf('day').toDate(),
  report.value.end_date ? new Date(report.value.end_date) : moment().endOf('day').toDate()
]);

const selectPreset = (item) => {
  currentPreset.value = item.label;
  const newDates = item.getValue();
  dates.value = newDates;
  onDateChange(newDates);
};

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

<style lang="scss">
.fb-custom-date-panel .p-datepicker-other-month .p-datepicker-day {
  &:not(.p-datepicker-day-selected):not(.p-datepicker-day-selected-range) {
    color: #A4A7AE !important;
    opacity: 0.7;
  }
}
</style>
