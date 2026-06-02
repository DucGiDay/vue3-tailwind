<template>
  <DataTable
    ref="dataTableRef"
    :value="paginatedData"
    columnResizeMode="expand"
    stripedRows
    :showGridlines="false"
    scrollable
    :scrollHeight="$attrs?.scrollable === false ? null : props.scrollHeight || 'flex'"
    tableStyle="min-width: 50rem;"
    tableClass="fb_table--t_table fb-text-[0.8125rem]"
    class="fb_table--wrapper"
    v-bind="$attrs"
    @columnReorder="onColReorder"
    @rowClick="emit('row-click', $event)"
    @rowDblclick="emit('row-dblclick', $event)"
  >
    <slot />

    <template #header v-if="reorderableColumns || $slots.header">
      <div class="fb-flex fb-justify-between fb-items-center">
        <div class="fb-flex-1">
          <slot name="header" />
        </div>

        <Button
          v-tooltip.top="'Cấu hình cột'"
          v-if="reorderableColumns"
          text
          raised
          size="small"
          @click.stop="showColumnConfig = true"
        >
          <IconSetting />
        </Button>
      </div>
    </template>
    <!-- Checkbox column-->
    <Column
      v-if="enableCheckbox"
      selectionMode="multiple"
      headerStyle="width: 3rem"
      headerClass="fb-font-medium"
      bodyClass="fb-font-normal fb-text-gray-700"
      class="!fb-px-4"
      alignFrozen="left"
      frozen
    ></Column>

    <!-- Index column -->
    <Column
      v-if="!$attrs?.hideIndexRow"
      field="no"
      header="#"
      :reorderableColumn="false"
      headerClass="fb-font-medium"
      bodyClass="fb-font-normal fb-text-gray-700"
      class=""
      :alignFrozen="'left'"
      :frozen="true"
    >
      <template #body="{ index }">
        {{ `${index + 1}` }}
      </template>
    </Column>

    <Column
      v-for="(col, index) of activeColumns"
      :field="col.field"
      :header="col.header"
      :key="col.field + '_' + index"
      :sortable="col?.sortable"
      headerClass="fb-font-medium"
      :bodyClass="['fb-font-normal', 'fb-text-gray-700', col?.classes || ''].join(' ')"
      :class="[
        'fb-whitespace-nowrap',
        {
          'p-datatable-column-frozen-left-last':
            col?.frozen && (col?.alignFrozen === 'left' || !col?.alignFrozen),
          'p-datatable-column-frozen-right-first': col?.frozen && col?.alignFrozen === 'right',
        },
      ]"
      :alignFrozen="col?.alignFrozen || 'left'"
      :frozen="col?.frozen"
      :style="col?.style || {}"
    >
      <template #body="{ data, index: i }">
        <Skeleton v-if="props.isLoading && !isLoadmore" />
        <span v-else-if="!$slots?.[col.field]">
          {{ formatData(data[col.field], data, col?.format) }}
        </span>
        <slot
          v-else
          :name="col.field"
          v-bind="{
            row: data,
            record: data[col.field],
            index: i,
          }"
        ></slot>
      </template>
    </Column>

    <!-- Delete column -->
    <Column
      v-if="deleteCallback"
      headerClass="fb-font-medium"
      bodyClass="fb-font-normal fb-text-gray-700"
      class="fb-whitespace-nowrap !fb-px-2"
      alignFrozen="right"
      frozen
      style="width: 4rem; min-width: 4rem"
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
      headerClass="fb-font-medium"
      bodyClass="fb-font-normal fb-text-gray-700"
      class="fb-whitespace-nowrap !fb-px-1"
      alignFrozen="right"
      frozen
    >
      <template #body="{ data }">
        <Button
          type="button"
          @click.stop="toggleActionMenu($event, data)"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          size="small"
          text
          :loading="
            (props.keyLoading && props.loadingActionRowCustom === data[props.keyLoading]) ||
            loadingActionRow === data
          "
          :disabled="isLoading && !isLoadmore"
        >
          <div
            v-if="
              (props.keyLoading && props.loadingActionRowCustom === data[props.keyLoading]) ||
              loadingActionRow === data
            "
            class="fb-flex fb-items-center fb-justify-center"
          >
            <ProgressSpinner class="!fb-m-0" strokeWidth="6" style="width: 1rem; height: 1rem" />
          </div>
          <IconOption v-else />
        </Button>
      </template>
    </Column>

    <!-- Empty slot -->
    <template #empty>
      <div
        class="fb-h-full fb-w-full fb-flex fb-flex-col fb-items-center fb-justify-center fb-text-muted-color fb-font-medium"
      >
        <div>
          <img :src="emptyIcon" alt="Empty image" loading="lazy" />
        </div>
        <slot name="empty">No data found!</slot>
      </div>
    </template>

    <!-- Loadmore -->
    <div v-if="isLoadmore" class="fb-scroll-loading">
      <ProgressSpinner class="!fb-m-0 !fb-inline" style="width: 2rem; height: 2rem" />
      <span class="fb-ml-2">Loading...</span>
    </div>

    <!-- Footer -->
    <template #footer v-if="$slots.footer || (enablePagination && !enableScrollPagination)">
      <nav class="fb-flex fb-items-center fb-pr-10">
        <div
          class="fb-paginator fb-mr-auto"
          v-if="enablePagination && !enableScrollPagination && totalPageCount > 0"
        >
          <Select
            v-model="internalRows"
            :options="computedRowsPerPageOptions"
            size="small"
            @change="onRowsChange"
          />

          <div class="fb-paginator__info">
            Hiển thị {{ rangeStart }} - {{ rangeEnd }} trên tổng số {{ totalRecordsCount }}
          </div>

          <ButtonGroup>
            <Button
              size="small"
              severity="secondary"
              variant="outlined"
              :disabled="internalPage <= 1"
              @click="goToPage(1)"
              title="Trang đầu"
            >
              <IconChevronLeftDouble />
            </Button>
            <Button
              size="small"
              severity="secondary"
              variant="outlined"
              :disabled="internalPage <= 1"
              @click="goToPage(internalPage - 1)"
              title="Trang trước"
            >
              <IconChevronLeft />
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
              <IconChevronRight />
            </Button>
            <Button
              size="small"
              severity="secondary"
              variant="outlined"
              :disabled="internalPage >= totalPageCount"
              @click="goToPage(totalPageCount)"
              title="Trang cuối"
            >
              <IconChevronRightDouble />
            </Button>
          </ButtonGroup>
        </div>
        <slot name="footer" />
      </nav>
    </template>
  </DataTable>

  <Menu
    ref="menu"
    id="overlay_menu"
    :model="resolvedMenuItems"
    :popup="true"
    @hide="selectedItem = {}"
  >
    <template #item="{ item, props }">
      <a
        v-ripple
        v-bind="props.action"
        v-tooltip="item.tooltipText ? { value: item.tooltipText, showDelay: 300 } : null"
        :class="[
          'fb-flex fb-items-center',
          {
            'fb-opacity-50 !fb-cursor-default': item?.notAllowClick,
          },
        ]"
      >
        <component v-if="item.icon" :is="item.icon" class="!fb-h-4 !fb-w-4" color="#A4A7AE"/>
        <span :class="item?.class || ''">{{ item.label }}</span>
        <Badge v-if="item.badge" class="fb-ml-auto" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="fb-ml-auto fb-bg-emphasis fb-text-muted-color fb-text-xs fb-p-1"
        >
          {{ item.shortcut }}
        </span>
      </a>
    </template>
  </Menu>

  <Dialog
    header="Xác nhận"
    v-model:visible="displayConfirmation"
    :style="{ width: '21.875rem' }"
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

  <!-- Column Config Dialog -->
  <Dialog
    v-model:visible="showColumnConfig"
    header="Cấu hình cột hiển thị"
    dismissableMask
    modal
    contentClass="!fb-flex !fb-flex-col !fb-overflow-hidden"
    :style="{ width: '45rem', height: '100%' }"
    :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
  >
    <DataTable
      :value="internalColumns"
      :reorderableRows="true"
      scrollable
      scrollHeight="flex"
      @rowReorder="onColumnRowReorder"
      dataKey="field"
      size="small"
    >
      <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
      <Column header="Hiển thị" bodyStyle="text-align:center" headerStyle="width: 5rem">
        <template #body="{ data }">
          <Checkbox v-model="data.visible" :binary="true" />
        </template>
      </Column>
      <Column field="header" header="Tên cột" />
      <Column header="Cố định (Freeze)">
        <template #body="{ data }">
          <SelectButton
            v-model="data.frozenState"
            :options="frozenOptions"
            optionLabel="label"
            optionValue="value"
            :allowEmpty="false"
          />
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <!-- <Button
        label="Đóng"
        severity="secondary"
        outlined
        @click="showColumnConfig = false"
        autofocus
      /> -->
      <Button label="Khôi phục mặc định" outlined @click="resetColumns" />
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue';
import moment from 'moment';
import { formatCurrency } from '@/common/utils/common';
import { useToast } from 'primevue/usetoast';
import { getAssetUrl } from '@/common/utils/common';
import IconChevronRight from '@/components/Common/Icon/IconChevronRight.vue';
import IconChevronLeft from '@/components/Common/Icon/IconChevronLeft.vue';
import IconChevronRightDouble from '@/components/Common/Icon/IconChevronRightDouble.vue';
import IconChevronLeftDouble from '@/components/Common/Icon/IconChevronLeftDouble.vue';
const toast = useToast();

// Image
import empryIconPath from '@/assets/img/dashboard/empty-invoice.png';
const emptyIcon = getAssetUrl(empryIconPath);

// Props
const props = defineProps({
  /** Danh sách cấu hình các cột của bảng */
  columns: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every((col) => col.hasOwnProperty('field') && col.hasOwnProperty('header'));
    },
  },

  /** Danh sách dữ liệu hiển thị trong bảng */
  items: {
    type: Array,
    default: () => [],
  },

  /** Trạng thái đang tải dữ liệu */
  isLoading: {
    type: Boolean,
    default: false,
  },

  /** Hiển thị cột checkbox để chọn nhiều dòng */
  enableCheckbox: {
    type: Boolean,
    default: false,
  },

  /** Hàm callback xử lý khi nhấn xóa dòng */
  deleteCallback: {
    type: Function,
    default: null,
  },

  /** Danh sách các hành động trong menu của mỗi dòng */
  menuItems: {
    type: Function,
    default: null,
  },

  /** Hàm callback khi mở menu hành động (thường dùng để gọi API cập nhật trạng thái menu) */
  onToggleMenu: {
    type: Function,
    default: null,
  },

  /** Xử lý loading custom của menuItems */
  loadingActionRowCustom: {
    type: [String, Number],
    default: null,
  },

  /** Tên trường (key) dùng để so sánh trạng thái loading action */
  keyLoading: {
    type: [String, Number],
    default: null,
  },

  // Pagination props
  /** Bật chế độ phân trang (bao gồm cả phân trang nút và cuộn) */
  enablePagination: {
    // Cho phép phân trang (Cả 2 loại: nút bấm | cuộn chuột)
    type: Boolean,
    default: false,
  },
  /** Bật chế độ phân trang bằng cách cuộn chuột (infinite scroll) */
  enableScrollPagination: {
    // Phân trang bằng cuộn chuột
    type: Boolean,
    default: false,
  },
  /** Chiều cao vùng cuộn của bảng */
  scrollHeight: {
    type: String,
    default: '',
  },
  /** Khoảng cách (px) từ đáy bảng để kích hoạt tải thêm dữ liệu khi cuộn */
  scrollThreshold: {
    type: Number,
    default: 100, // px từ đáy để trigger load thêm
  },
  /** Còn dữ liệu để tải thêm khi cuộn (dùng cho scroll pagination, do component cha quản lý) */
  hasMoreData: {
    type: Boolean,
    default: true,
  },

  /** Tổng số bản ghi */
  totalRecords: {
    type: Number,
    default: 0,
  },
  /** Tổng số trang */
  // totalPages: {
  //   type: Number,
  //   default: 0,
  // },
  /** Số bản ghi hiển thị trên mỗi trang */
  pageSize: {
    type: Number,
    default: 8,
  },
  /** Trang hiện tại */
  currentPage: {
    type: Number,
    default: 1,
  },
  /** Danh sách các tùy chọn số dòng hiển thị trên một trang */
  rowsPerPageOptions: {
    type: Array,
    default: () => [8, 10, 20, 50, 100, 200],
  },
  /** Hiển thị nút cấu hình cột */
  reorderableColumns: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits([
  'page-change',
  'row-click',
  'row-dblclick',
  'selection-change',
  'row-reorder',
]);

// ==========================================
// 3. Reactive State
// ==========================================
// --- Column Config ---
const showColumnConfig = ref(false);
const internalColumns = ref([]);
const frozenOptions = [
  { label: 'Không', value: 'none' },
  { label: 'Trái', value: 'left' },
  { label: 'Phải', value: 'right' },
];

// --- Pagination ---
const internalPage = ref(props.currentPage);
const internalRows = ref(props.pageSize);
const dataTableRef = ref();
let scrollContainer = null;

// --- Action Menu ---
const displayConfirmation = ref(false);
const selectedItem = ref({});
const loadingActionRow = ref(null);
const menu = ref();
const resolvedMenuItems = ref([]);

// ==========================================
// 4. Computed Properties
// ==========================================
const activeColumns = computed(() => {
  return internalColumns.value
    .filter((c) => c.visible)
    .map((c) => {
      const isFrozen = c.frozenState !== 'none';
      const alignFrozen = c.frozenState === 'right' ? 'right' : 'left';
      return {
        ...c,
        frozen: isFrozen,
        alignFrozen: alignFrozen,
      };
    });
});

const isLoadmore = computed(
  () => props.enableScrollPagination && props.isLoading && props.currentPage > 1,
);

const totalRecordsCount = computed(() => {
  return props.totalRecords || 0;
});

const computedRowsPerPageOptions = computed(() => {
  return props.rowsPerPageOptions;
});

const totalPageCount = computed(() => {
  return Math.ceil(totalRecordsCount.value / internalRows.value) || 1;
});

const rangeStart = computed(() => {
  return (internalPage.value - 1) * internalRows.value + 1;
});

const rangeEnd = computed(() => {
  return Math.min(internalPage.value * internalRows.value, totalRecordsCount.value);
});

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
  if (props.isLoading && !isLoadmore.value) return Array(8).fill({});
  return props.items;
});

// ==========================================
// 5. Methods
// ==========================================
// --- Formatting ---
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

// --- Column Config ---
const initInternalColumns = (cols) => {
  const currentMap = new Map(internalColumns.value.map((c) => [c.field, c]));
  internalColumns.value = cols.map((c) => {
    const existing = currentMap.get(c.field);
    if (existing) {
      return { ...c, visible: existing.visible, frozenState: existing.frozenState };
    }
    return {
      ...c,
      visible: c.visible !== false,
      frozenState: c.frozen ? (c.alignFrozen === 'right' ? 'right' : 'left') : 'none',
    };
  });
};

const resetColumns = () => {
  internalColumns.value = props.columns.map((c) => ({
    ...c,
    visible: c.visible !== false,
    frozenState: c.frozen ? (c.alignFrozen === 'right' ? 'right' : 'left') : 'none',
  }));
};

const onColumnRowReorder = (event) => {
  internalColumns.value = event.value;
};

const onColReorder = (data) => {
  toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 });
};

// --- Pagination ---
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

let lastScrollTop = 0;
const onScrollLoadMore = () => {
  if (!props.enableScrollPagination) return;
  if (!scrollContainer) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
  // Chỉ xử lý khi cuộn dọc (scrollTop thay đổi)
  if (scrollTop === lastScrollTop) return;
  lastScrollTop = scrollTop;

  if (props.isLoading) return;
  if (!props.hasMoreData) return;

  if (scrollTop + clientHeight >= scrollHeight - props.scrollThreshold) {
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

// --- Action Menu ---
const toggleActionMenu = async (event, data) => {
  const target = event.currentTarget;
  selectedItem.value = data;
  let items = [];
  if (typeof props.onToggleMenu === 'function') {
    try {
      loadingActionRow.value = data;
      await props.onToggleMenu(event, data);
    } catch (error) {
      toast.add({ severity: 'error', summary: error?.message, life: 3000 });
    } finally {
      loadingActionRow.value = null;
    }
  }

  if (typeof props.menuItems === 'function') {
    items = props.menuItems(data);
  } else {
    items = props.menuItems || [];
  }

  // Bọc lại các hàm command để bắt trạng thái loading (nếu là async function)
  resolvedMenuItems.value = items.map((item) => ({
    ...item,
    command: (cmdEvent) => {
      if (typeof item.command === 'function') {
        const result = item.command(cmdEvent);

        // Nếu command trả về một Promise (thường là API call)
        if (result instanceof Promise) {
          loadingActionRow.value = data;
          result.finally(() => {
            loadingActionRow.value = null;
          });
        }
      }
    },
  }));

  menu.value.toggle({ currentTarget: target });
};

const onDelete = async () => {
  await props.deleteCallback(selectedItem.value);
};

const toggleConfirmDialog = (item) => {
  selectedItem.value = item || {};
  displayConfirmation.value = !displayConfirmation.value;
};

// ==========================================
// 6. Watchers
// ==========================================
watch(
  () => props.columns,
  (newCols) => {
    initInternalColumns(newCols);
  },
  { immediate: true, deep: true },
);

watch(
  () => props.currentPage,
  (val) => {
    internalPage.value = val;
  },
);

watch(
  () => props.rows,
  (val) => {
    internalRows.value = val;
  },
);

// Tự động load trang tiếp theo nếu dữ liệu hiển thị chưa đủ chiều cao của bảng
watch(
  () => props.items,
  () => {
    if (props.enableScrollPagination && props.hasMoreData) {
      nextTick(() => {
        onScrollLoadMore();
      });
    }
  },
  { deep: true },
);

// ==========================================
// 7. Lifecycle Hooks
// ==========================================
onMounted(() => {
  setupScrollListener();
  // Kích hoạt check lần đầu phòng trường hợp bản ghi ban đầu quá ít chưa tạo ra scrollbar
  nextTick(() => {
    onScrollLoadMore();
  });
});

onBeforeUnmount(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', onScrollLoadMore);
    scrollContainer = null;
  }
});
</script>

<style lang="scss">
.fb_table--wrapper {
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: 0.75rem;
  overflow: hidden;

  .p-datatable-header {
    border: none;
    border-bottom: 1px solid var(--surface-border, #e5e7eb);
  }

  .p-datatable-table-container,
  .p-datatable-wrapper {
    border: none !important;
    border-radius: 0 !important;

    /* Custom scrollbar to avoid clipping with outer border-radius */
    // &::-webkit-scrollbar {
    //   width: 8px;
    //   height: 8px;
    // }
    // &::-webkit-scrollbar-track {
    //   background: transparent;
    // }
    // &::-webkit-scrollbar-thumb {
    //   border-radius: 4px;
    //   background: rgba(156, 163, 175, 0.5); /* gray-400 */
    // }
    // &::-webkit-scrollbar-thumb:hover {
    //   background: rgba(107, 114, 128, 0.8); /* gray-500 */
    // }
  }

  table:has(.p-datatable-empty-message) {
    height: 100%;
  }

  .fb_table--t_table {
    // Shadow for frozen columns
    .p-datatable-column-frozen-left-last {
      box-shadow: 4px 0 4px -4px rgba(0, 0, 0, 0.2) !important;
    }

    .p-datatable-column-frozen-right-first {
      box-shadow: -4px 0 4px -4px rgba(0, 0, 0, 0.2) !important;
    }

    thead.p-datatable-thead > tr > th {
      padding: 0.5rem 1.5rem;
      background-color: #fafafa;
      color: #85888e;
      font-weight: 500;
    }
    tbody.p-datatable-tbody > tr > td {
      padding: 0.5rem 1.5rem;
      &.action-cell {
        text-align: center;
        padding: 0.5rem 0.5rem;
      }
    }
  }
}

/*
 Custom Paginator 
*/
.fb-paginator {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
