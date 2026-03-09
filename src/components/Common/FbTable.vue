<template>
  <DataTable
    :value="data"
    columnResizeMode="expand"
    stripedRows
    showGridlines
    :loading="isLoading"
    scrollable
    scrollHeight="calc(100vh - 20rem)"
    tableStyle="min-width: 50rem"
    tableClass="fb_table--t_table"
    class="fb_table--wrapper"
    v-bind="$attrs"
    @columnReorder="onColReorder"
  >
    <slot />
    <Column
      v-if="enableCheckbox"
      selectionMode="multiple"
      headerStyle="width: 3rem"
      headerClass="!fb-bg-gray-50 fb-rounded-ss-lg !fb-text-gray !fb-py-3 !fb-px-4"
      :bodyClass="'!fb-py-4 !fb-px-4'"
    ></Column>

    <Column
      field="no"
      header="#"
      :reorderableColumn="false"
      :headerClass="
        [
          '!fb-bg-gray-50 !fb-text-gray !fb-py-3 !fb-px-6',
          !props.enableCheckbox ? 'fb-rounded-ss-lg' : ''
        ].join(' ')
      "
      :bodyClass="`!fb-py-4 !fb-px-6`"
      :class="[props.enableCheckbox && '!fb-border-l-0']"
    >
      <template #body="{ index }">
        {{ `${index + 1}` }}
      </template>
    </Column>
    <Column
      v-for="(col, index) of columns"
      :field="col.field"
      :header="col.header"
      :key="col.field + '_' + index"
      headerClass="!fb-bg-gray-50 last:fb-rounded-se-lg !fb-text-gray !fb-py-3 !fb-px-6"
      :bodyClass="['!fb-py-4 !fb-px-6', col?.classes || ''].join(' ')"
      :class="['!fb-border-l-0 fb-whitespace-nowrap']"
    >
      <template #body="{ data }">
        <Skeleton v-if="isLoading" />
        <span v-else-if="!$slots?.[col.field]">{{ formatData(data[col.field], col?.format) }}</span>
        <slot
          :name="col.field"
          v-bind="{
            row: data,
            record: data[col.field]
          }"
        ></slot>
      </template>
    </Column>
    <template #empty>
      <slot name="empty">
        <div class="fb-text-center">No customers found.</div>
      </slot>
    </template>
  </DataTable>
</template>

<script setup>
import { onMounted } from 'vue';

import moment from 'moment';
import { formatCurrency } from '@/common/ulties';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

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

  enableCheckbox: {
    type: Boolean,
    default: false
  }
});

// Methods
const onColReorder = () => {
  toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 });
};
const formatData = (value, format) => {
  if (format === 'date') {
    const date = new Date(value);
    return moment(date).format('DD/MM/YYYY');
  }
  if (format === 'datetime') {
    const date = new Date(value);
    return moment(date).format('DD/MM/YYYY HH:mm');
  }
  if (format === 'currency') {
    return formatCurrency(value);
  }
  if (typeof format === 'function') return format(value);

  return value;
};

// Computed
const data = computed(() => {
  if (props.isLoading && !props.items?.length) return Array(5).fill({});
  return props.items;
});

onMounted(() => {});
</script>

<style lang="scss">
.fb_table--t_table {
  tr:last-child {
    td:first-child {
      border-end-start-radius: 0.5rem;
    }
    td:last-child {
      border-end-end-radius: 0.5rem;
    }
  }
}
</style>
