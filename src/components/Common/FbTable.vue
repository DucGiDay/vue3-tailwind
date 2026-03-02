<template>
  <DataTable
    :value="data"
    :reorderableColumns="reorderableColumns"
    :resizableColumns="resizableColumns"
    columnResizeMode="expand"
    stripedRows
    showGridlines
    :loading="isLoading"
    @columnReorder="onColReorder"
    tableStyle="min-width: 50rem"
    v-bind="$attrs"
  >
    <Column
      field="no"
      header="#"
      :reorderableColumn="false"
      headerClass="!fb-bg-gray-50 fb-rounded-ss-lg !fb-text-gray !fb-py-3 !fb-px-6"
      bodyClass="fb-rounded-es-lg !fb-py-4 !fb-px-6"
    >
      <template #body="{ index }">
        {{ `${index + 1}` }}
      </template>
    </Column>
    <Column
      v-for="(col, index) of selectedColumns"
      :field="col.field"
      :header="col.header"
      :key="col.field + '_' + index"
      headerClass="!fb-bg-gray-50 last:fb-rounded-se-lg !fb-text-gray !fb-py-3 !fb-px-6"
      bodyClass="last:fb-rounded-ee-lg !fb-py-4 !fb-px-6"
      :class="['!fb-border-l-0 fb-whitespace-nowrap', col?.classes || '']"
    >
      <template #body="{ data }">
        <Skeleton v-if="isLoading" />
        <span v-else-if="!$slots?.[col.field]">{{ data[col.field] }}</span>
        <slot
          :name="col.field"
          v-bind="{
            row: data,
            record: data[col.field]
          }"
        ></slot>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { onMounted } from 'vue';

const slots = useSlots();

// Props
const props = defineProps({
  selectedColumns: {
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

  resizableColumns: {
    type: Boolean,
    default: false
  }
});

const onColReorder = () => {
  toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 });
};

const data = computed(() => {
  if (props.isLoading && !props.items?.length) return Array(5).fill({});
  return props.items;
});

onMounted(() => {
  console.log(slots);
});
</script>
