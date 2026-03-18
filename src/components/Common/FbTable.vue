<template>
  <div class="fb_table--relative">
    <DataTable
      ref="dataTableRef"
      :value="paginatedData"
      columnResizeMode="expand"
      stripedRows
      showGridlines
      :loading="props.isLoading && !isLoadmore"
      scrollable
      :scrollHeight="
        $attrs?.scrollable === false || (props.enablePagination && !props.enableScrollPagination)
          ? null
          : props.scrollHeight || 'calc(100vh - 20rem)'
      "
      tableStyle="min-width: 50rem"
      tableClass="fb_table--t_table"
      class="fb_table--wrapper"
      v-bind="$attrs"
      @columnReorder="onColReorder"
    >
      <slot />
      <template #footer v-if="$slots.footer || (enablePagination && !enableScrollPagination)">
        <nav class="fb-flex fb-items-center">
          <slot name="footer" />
          <div
            class="fb-paginator fb-ml-auto"
            v-if="enablePagination && !enableScrollPagination && totalPageCount > 0"
          >
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
        alignFrozen="lefft"
        frozen
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
        alignFrozen="lefft"
        frozen
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
        :sortable="col?.sortable"
        headerClass="!fb-bg-gray-50 last:fb-rounded-se-lg !fb-text-gray !fb-py-3 !fb-px-6"
        :bodyClass="'!fb-py-4 !fb-px-6' + (col?.classes || '')"
        :class="['!fb-border-l-0 not-last:!fb-border-r-0 fb-whitespace-nowrap']"
      >
        <template #body="{ data }">
          <Skeleton v-if="props.isLoading && !isLoadmore" />
          <span v-else-if="!$slots?.[col.field]">
            {{ formatData(data[col.field], data, col?.format) }}
          </span>
          <slot
            v-else
            :name="col.field"
            v-bind="{
              row: data,
              record: data[col.field]
            }"
          ></slot>
        </template>
      </Column>

      <!-- Delete column -->
      <Column
        v-if="deleteCallback"
        headerClass="!fb-bg-gray-50 last:fb-rounded-se-lg !fb-text-gray !fb-py-3 !fb-px-4"
        bodyClass="!fb-py-4 !fb-px-4"
        class="!fb-border-l-0 not-last:!fb-border-r-0 fb-whitespace-nowrap"
        alignFrozen="right"
        frozen
      >
        <template #body="{ data }">
          <Button
            class="fb-flex fb-items-center fb-justify-center"
            size="small"
            variant="text"
            severity="contrast"
            @click="toggleConfirmDialog(data)"
          >
            <IconTrash />
          </Button>
        </template>
      </Column>

      <!-- Action Column -->
      <Column
        v-if="menuItems"
        headerClass="!fb-bg-gray-50 last:fb-rounded-se-lg !fb-text-gray !fb-py-3 !fb-px-4"
        bodyClass="!fb-py-4 !fb-px-2"
        class="!fb-border-l-0 not-last:!fb-border-r-0 fb-whitespace-nowrap"
        alignFrozen="right"
        frozen
      >
        <template #body="{ data }">
          <Button
            type="button"
            @click="toggleActionMenu($event, data)"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            size="small"
            text
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66669 8C6.66669 7.26362 7.26364 6.66667 8.00002 6.66667C8.7364 6.66667 9.33335 7.26362 9.33335 8C9.33335 8.73638 8.7364 9.33333 8.00002 9.33333C7.26364 9.33333 6.66669 8.73638 6.66669 8Z"
                fill="#A4A7AE"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66669 3.33333C6.66669 2.59695 7.26364 2 8.00002 2C8.7364 2 9.33335 2.59695 9.33335 3.33333C9.33335 4.06971 8.7364 4.66667 8.00002 4.66667C7.26364 4.66667 6.66669 4.06971 6.66669 3.33333Z"
                fill="#A4A7AE"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66669 12.6667C6.66669 11.9303 7.26364 11.3333 8.00002 11.3333C8.7364 11.3333 9.33335 11.9303 9.33335 12.6667C9.33335 13.403 8.7364 14 8.00002 14C7.26364 14 6.66669 13.403 6.66669 12.6667Z"
                fill="#A4A7AE"
              />
            </svg>
          </Button>
          <Menu
            ref="menu"
            id="overlay_menu"
            :model="resolvedMenuItems"
            :popup="true"
            @hide="selectedItem = {}"
          />
        </template>
      </Column>

      <!-- Empty slot -->
      <template #empty>
        <div
          class="fb-w-full fb-flex fb-flex-col fb-items-center fb-justify-center fb-text-muted-color"
        >
          <div>
            <img :src="emptyIcon" alt="Empty image" loading="lazy" />
          </div>
          <slot name="empty">No data found!</slot>
        </div>
      </template>
    </DataTable>

    <!-- Scroll pagination loading indicator (absolute) -->
    <div v-if="isLoadmore" class="fb-scroll-loading">
      <ProgressSpinner class="!fb-m-0 !fb-inline" style="width: 2rem; height: 2rem" />
      <span class="fb-ml-2">Loading...</span>
    </div>
  </div>

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
      <Button label="Đóng" @click="toggleConfirmDialog()" text severity="secondary" />
      <Button label="Xác nhận" @click="onDelete" severity="danger" autofocus />
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue';
import moment from 'moment';
import { formatCurrency } from '@/common/ulties';
import { useToast } from 'primevue/usetoast';
import { getAssetUrl } from '@/common/ulties';
const toast = useToast();

// Image
import empryIconPath from '@/assets/img/dashboard/empty-invoice.png';
const emptyIcon = getAssetUrl(empryIconPath);

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
  menuItems: {
    type: Function,
    default: null
  },

  // Pagination props
  enablePagination: {
    type: Boolean,
    default: false
  },
  enableScrollPagination: {
    type: Boolean,
    default: false
  },
  scrollHeight: {
    type: String,
    default: ''
  },
  scrollThreshold: {
    type: Number,
    default: 100 // px từ đáy để trigger load thêm
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    default: 0
  },
  pageSize: {
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
const internalRows = ref(props.pageSize);
const dataTableRef = ref();
let scrollContainer = null;

// tách riêng first load (skeleton) và loadmore (spinner overlay)
const isLoadmore = computed(
  () => props.enableScrollPagination && props.isLoading && props.currentPage > 1
);

// Scroll pagination: còn data để load không?
const hasMoreData = computed(() => {
  if (!props.enableScrollPagination) return false;
  return internalPage.value <= totalPageCount.value;
});

const displayConfirmation = ref(false);
const selectedItem = ref({});
const menu = ref();
const resolvedMenuItems = ref([]);

// Khi data load xong lần đầu -> tắt isFirstLoad, setup scroll listener
// watch(
//   () => props.isLoading,
//   (loading, prevLoading) => {
//     if (prevLoading && !loading && isFirstLoad.value && internalPage.value === 1) {
//       isFirstLoad.value = false;
//     }
//   }
// );

// Sync khi props thay đổi
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
  // if (isFirstLoad.value && props.isLoading) return Array(internalRows.value).fill({});
  if (props.isLoading && !isLoadmore.value) return Array(8).fill({});
  return props.items;
});

// Methods
const goToPage = (page) => {
  if (props.isLoading) return;
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

const toggleActionMenu = (event, data) => {
  selectedItem.value = data;
  if (typeof props.menuItems === 'function') {
    resolvedMenuItems.value = props.menuItems(data);
  }
  menu.value.toggle(event);
};

const formatData = (node, row, format) => {
  if (typeof format === 'function') return format(node, row);
  if (!format || node === null || node === undefined) return node;

  switch (format) {
    case 'date':
      return moment(node).format('DD/MM/YYYY');
    case 'datetime':
      return moment(node).format('DD/MM/YYYY HH:mm');
    case 'currency':
      return formatCurrency(node);
    case 'truncate':
      return node ? `#${node.toString().slice(-5)}` : '';
    default:
      return node;
  }
};

// Scroll pagination handler
const onScrollLoadMore = () => {
  if (!props.enableScrollPagination) return;
  if (!scrollContainer) return;
  if (props.isLoading) return;
  if (!hasMoreData.value) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
  if (scrollTop + clientHeight >= scrollHeight - props.scrollThreshold) {
    // internalPage.value++;
    emit('page-change');
  }
};

const setupScrollListener = () => {
  if (!props.enableScrollPagination) return;
  // Cleanup old listener
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', onScrollLoadMore);
    scrollContainer = null;
  }
  nextTick(() => {
    const el = dataTableRef.value?.$el;
    if (el) {
      // PrimeVue 4: .p-datatable-table-container, PrimeVue 3: .p-datatable-wrapper
      scrollContainer =
        el.querySelector('.p-datatable-table-container') ||
        el.querySelector('.p-datatable-wrapper');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', onScrollLoadMore);
      }
    }
  });
};

onMounted(() => {
  setupScrollListener();
  // emit('page-change', { page: 1, rows: internalRows.value });
});

onBeforeUnmount(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', onScrollLoadMore);
    scrollContainer = null;
  }
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

/* Scroll pagination loading */
.fb_table--relative {
  position: relative;
}

.fb-scroll-loading {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
  z-index: 1;
}
</style>
