<template>
  <div class="fb-p-4 fb-min-h-screen">
    <!-- Filters and Actions -->
    <div
      :class="[
        'fb-flex fb-justify-between fb-items-center fb-mb-4 fb-bg-white fb-p-3 fb-rounded-lg fb-shadow',
        actionBarClasses
      ]"
    >
      <div class="fb-flex fb-items-center fb-space-x-3">
        <slot v-if="showFilter" name="filter">
          <DatePicker v-model="dates" selectionMode="range" :manualInput="false" />
          <FbSelectCityStore
            :placeholder="$t('SELECT_CITIES_STORES_FILTER--INPUT_PLACEHOLDER_BLUR')"
          />
        </slot>
        <MultiSelect
          v-if="reorderableColumns"
          :modelValue="selectedColumns"
          :options="columns"
          filter
          optionLabel="header"
          @update:modelValue="onToggle"
          display="chip"
          placeholder="Chọn cột hiển thị"
          class="fb-w-full md:fb-w-80"
        />
      </div>

      <!-- Action bar -->
      <div class="fb-flex fb-items-center fb-space-x-2">
        <slot name="action-button" />
        <slot v-if="showExport" name="export-button">
          <Button @click="exportReport('FILTER')" variant="outlined">Xuất báo cáo</Button>
          <div v-if="isExportingReport" class="fb-flex fb-items-center fb-space-x-1">
            <div
              class="fb-w-6 fb-h-6 fb-border-4 fb-border-blue-500 fb-border-t-transparent fb-rounded-full fb-animate-spin"
            ></div>
            <span>{{ percentageOfExportedData }}%</span>
          </div>
        </slot>
      </div>
    </div>

    <!-- Guide Text -->
    <slot name="guide-text">
      <div class="fb-mb-4">
        <p class="fb-text-gray-500 fb-ml-3">
          Thời gian lấy báo cáo từ
          {{ dates ? formatDate(dates[0]) : '' }} đến
          {{ dates ? formatDate(dates[1]) : '' }}
        </p>
      </div>
    </slot>

    <!-- Table -->
    <div class="card fb-shadow">
      <FbTable
        :selectedColumns="selectedColumns"
        :items="items"
        :resizableColumns="resizableColumns"
        :reorderableColumns="reorderableColumns"
      />
    </div>
  </div>
</template>

<script setup>
import moment from 'moment';

// State
let dates = reactive([new Date(), new Date()]);
const selectedColumns = ref([]);
const isExportingReport = ref(false);
const percentageOfExportedData = ref(0);

// Props
const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every((col) => col.hasOwnProperty('field') && col.hasOwnProperty('header'));
    }
  },
  items: {
    type: Array,
    default: () => []
  },
  reorderableColumns: {
    type: Boolean,
    default: false
  },
  resizableColumns: {
    type: Boolean,
    default: false
  },
  showFilter: {
    type: Boolean,
    default: true
  },
  showExport: {
    type: Boolean,
    default: true
  },
  actionBarClasses: {
    type: String,
    default: ''
  }
});

// Initialize selected columns khi component mount hoặc khi columns prop thay đổi
watch(
  () => props.columns,
  (newColumns) => {
    if (newColumns.length > 0 && selectedColumns.value.length === 0) {
      selectedColumns.value = [...newColumns];
    }
  },
  { immediate: true }
);

// Methods
const onToggle = (val) => {
  selectedColumns.value = props.columns.filter((col) => val.includes(col));
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return moment(date).format('DD/MM/YYYY HH:mm');
};

const exportReport = async (exportType) => {};
</script>
