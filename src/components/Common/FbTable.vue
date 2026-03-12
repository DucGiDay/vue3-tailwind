<template>
  <DataTable
    :value="paginatedData"
    columnResizeMode="expand"
    stripedRows
    showGridlines
    :loading="isLoadmore"
    scrollable
    :scrollHeight="
      $attrs?.scrollable === false || props.enablePagination ? null : 'calc(100vh - 20rem)'
    "
    tableStyle="min-width: 50rem"
    tableClass="fb_table--t_table"
    class="fb_table--wrapper"
    v-bind="$attrs"
    @columnReorder="onColReorder"
  >
    <slot />
    <template #footer>
      <nav class="fb-flex fb-items-center">
        <slot name="footer" />
        <div class="fb-paginator fb-ml-auto" v-if="enablePagination && totalPageCount > 0">
          <!-- Rows per page -->
          <Select
            v-model="internalRows"
            :options="computedRowsPerPageOptions"
            size="small"
            @change="onRowsChange"
          />

          <!-- Page info -->
          <div class="fb-paginator__info">
            Hiển thị {{ rangeStart }} - {{ rangeEnd }} trên tổng số {{ totalRecordsCount }}
          </div>

          <!-- Page navigation -->
          <ButtonGroup>
            <Button
              size="small"
              severity="secondary"
              variant="outlined"
              :disabled="internalPage <= 1"
              @click="goToPage(1)"
              title="Trang đầu"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.727 12L7.773 8l3.954-4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.727 12L3.773 8l3.954-4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
            <Button
              size="small"
              severity="secondary"
              variant="outlined"
              :disabled="internalPage <= 1"
              @click="goToPage(internalPage - 1)"
              title="Trang trước"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8l4-4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
            <template v-for="page in visiblePages" :key="page">
              <Button
                v-if="page === '...'"
                size="small"
                class="fb-w-9 fb-flex fb-items-center fb-justify-center"
                severity="secondary"
                variant="outlined"
                disabled
              >
                …
              </Button>
              <Button
                v-else
                size="small"
                class="fb-w-9 fb-flex fb-items-center fb-justify-center"
                :severity="page !== internalPage ? 'secondary' : null"
                :variant="page !== internalPage ? 'outlined' : null"
                @click="goToPage(page)"
              >
                {{ page }}
              </Button>
            </template>
            <Button
              size="small"
              severity="secondary"
              variant="outlined"
              :disabled="internalPage >= totalPageCount"
              @click="goToPage(internalPage + 1)"
              title="Trang sau"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
            <Button
              size="small"
              severity="secondary"
              variant="outlined"
              :disabled="internalPage >= totalPageCount"
              @click="goToPage(totalPageCount)"
              title="Trang cuối"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4.273 4L8.227 8l-3.954 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.273 4L12.227 8l-3.954 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
          </ButtonGroup>
        </div>
      </nav>
    </template>

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
        '!fb-bg-gray-50 !fb-text-gray !fb-py-3 !fb-px-6' +
        (!props.enableCheckbox ? 'fb-rounded-ss-lg' : '')
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
      :bodyClass="'!fb-py-4 !fb-px-6' + (col?.classes || '')"
      :class="['!fb-border-l-0 not-last:!fb-border-r-0 fb-whitespace-nowrap']"
    >
      <template #body="{ data }">
        <Skeleton v-if="isFirstLoad && isLoading" />
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

    <Column
      v-if="deleteCallback"
      headerClass="!fb-bg-gray-50 fb-rounded-ss-lg !fb-text-gray !fb-py-3 !fb-px-4"
      bodyClass="!fb-py-4 !fb-px-4"
      class="!fb-border-l-0"
    >
      <template #body="{ data }">
        <Button
          class="fb-flex fb-items-center fb-justify-center"
          size="small"
          variant="text"
          severity="contrast"
          @click="toggleConfirmDialog(data)"
        >
          <img :src="trashIcon" alt="Trash icon" />
        </Button>
      </template>
    </Column>
    <template #empty>
      <slot name="empty">
        <div class="fb-text-center">No data found!</div>
      </slot>
    </template>
  </DataTable>

  <Dialog
    header="Xác nhận"
    v-model:visible="displayConfirmation"
    :style="{ width: '350px' }"
    :modal="true"
  >
    <div class="fb-flex fb-items-center fb-justify-center">
      <span>Bạn có muốn xóa phần tử này?</span>
    </div>
    <template #footer>
      <Button label="Đóng" @click="toggleConfirmDialog" text severity="secondary" />
      <Button label="Xác nhận" @click="onDelete" severity="danger" autofocus />
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import moment from 'moment';
import { formatCurrency, getAssetUrl } from '@/common/ulties';
import { useToast } from 'primevue/usetoast';

const trashIcon = getAssetUrl('/images/icon/trash.svg');
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
  },

  deleteCallback: {
    type: Function,
    default: null
  },

  // Pagination props
  enablePagination: {
    type: Boolean,
    default: false
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    default: 0
  },
  rows: {
    type: Number,
    default: 8
  },
  currentPage: {
    type: Number,
    default: 1
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [8, 10, 20, 50, 100, 200]
  }
});

// Emits
const emit = defineEmits(['page-change']);

// Internal pagination state
const internalPage = ref(props.currentPage);
const internalRows = ref(props.rows);

// tách riêng first load (skeleton) và loadmore (spinner overlay)
const isFirstLoad = ref(true);
const isLoadmore = computed(() => props.isLoading && !isFirstLoad.value);

const displayConfirmation = ref(false);
const selectedItem = ref({});

// Khi data load xong lần đầu -> tắt isFirstLoad
watch(
  () => props.isLoading,
  (loading, prevLoading) => {
    if (prevLoading && !loading && isFirstLoad.value) {
      isFirstLoad.value = false;
    }
  }
);

// Sync with parent props
watch(
  () => props.currentPage,
  (val) => {
    internalPage.value = val;
  }
);
watch(
  () => props.rows,
  (val) => {
    internalRows.value = val;
  }
);

// Computed: total records from API
const totalRecordsCount = computed(() => {
  return props.totalRecords || 0;
});

// Computed: rows per page options
const computedRowsPerPageOptions = computed(() => {
  return props.rowsPerPageOptions;
});

// Computed: total pages
const totalPageCount = computed(() => {
  return Math.ceil(totalRecordsCount.value / internalRows.value) || 1;
});

// Computed: range display
const rangeStart = computed(() => {
  return (internalPage.value - 1) * internalRows.value + 1;
});
const rangeEnd = computed(() => {
  return Math.min(internalPage.value * internalRows.value, totalRecordsCount.value);
});

// Computed: visible page buttons with ellipsis
const visiblePages = computed(() => {
  const total = totalPageCount.value;
  const current = internalPage.value;
  const delta = 1; // pages shown around current

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  pages.push(total);

  return pages;
});

// Data hiển thị
const paginatedData = computed(() => {
  // Lần đầu chưa có data -> fill skeleton placeholder
  if (isFirstLoad.value && props.isLoading) return Array(internalRows.value).fill({});
  return props.items;
});

// Methods
const goToPage = (page) => {
  if (page < 1 || page > totalPageCount.value) return;
  internalPage.value = page;
  emit('page-change', { page: internalPage.value, rows: internalRows.value });
};

const onRowsChange = (e) => {
  internalRows.value = Number(e.value);
  internalPage.value = 1; // reset to first page
  emit('page-change', { page: 1, rows: internalRows.value });
};

const onDelete = async () => {
  await props.deleteCallback(selectedItem.value);
};
const toggleConfirmDialog = (item) => {
  selectedItem.value = item || {};
  displayConfirmation.value = !displayConfirmation.value;
};

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

onMounted(() => {
  emit('page-change', { page: 1, rows: internalRows.value });
});
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

/* Custom Paginator */
.fb-paginator {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 0;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  flex-wrap: wrap;
}

.fb-paginator__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  user-select: none;
}
</style>
