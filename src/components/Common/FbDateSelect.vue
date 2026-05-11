<template>
  <DatePicker
    ref="datePicker"
    v-model="dates"
    selectionMode="range"
    :manualInput="false"
    dateFormat="dd/mm/yy"
    placeholder="Chọn thời gian"
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
import { ref, watch } from 'vue';
import moment from 'moment';

/**
 * FbDateSelect — Pure UI component.
 * Quản lý DatePicker range với preset options.
 * Luôn dùng v-model để nhận/trả giá trị [Date, Date].
 */
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => null
  }
});

const emit = defineEmits(['update:modelValue', 'clear-click']);

const datePicker = ref();

const responsiveOptions = ref([
  { breakpoint: '769px', numMonths: 2 },
  { breakpoint: '0', numMonths: 1 }
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
      moment().subtract(7, 'days').startOf('day').toDate(),
      moment().subtract(1, 'days').endOf('day').toDate()
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
const dates = ref(props.modelValue ? [...props.modelValue] : null);

// Sync nếu modelValue thay đổi từ bên ngoài
watch(
  () => props.modelValue,
  (val) => {
    dates.value = val ? [...val] : null;
  }
);

const selectPreset = (item) => {
  currentPreset.value = item.label;
  const newDates = item.getValue();
  dates.value = newDates;
  onDateChange(newDates);
};

const onDateChange = (value) => {
  if (value && value[0] && value[1]) {
    datePicker.value.overlayVisible = false;
    emit('update:modelValue', value);
  } else if (!value) {
    datePicker.value.overlayVisible = false;
    emit('update:modelValue', value);
  }
};
</script>

<style lang="scss">
.fb-custom-date-panel .p-datepicker-other-month .p-datepicker-day {
  &:not(.p-datepicker-day-selected):not(.p-datepicker-day-selected-range) {
    color: #a4a7ae !important;
    opacity: 0.7;
  }
}
</style>
