<template>
  <div class="fb-p-4 fb-min-h-[calc(100dvh-60px)]">
    <!-- START Toolbar -->
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
    </div>
    <!-- END Toolbar -->

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
        :columns="selectedColumns"
        :items="items"
        :is-loading="isLoading"
        :reorderableColumns="reorderableColumns"
        v-bind="$attrs"
      >
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps ?? {}" />
        </template>
      </FbTable>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment';

// State
let dates = reactive([new Date(), new Date()]);
const selectedColumns = ref([]);

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
  isLoading: {
    type: Boolean,
    default: false
  },
  reorderableColumns: {
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
</script>
