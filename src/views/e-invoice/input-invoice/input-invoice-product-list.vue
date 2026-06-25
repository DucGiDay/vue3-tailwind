<template>
  <TableView :searchable="false">
    <template #toolbar>
      <div class="fb-bg-white fb-px-4 fb-py-3 fb-rounded-lg fb-border fb-border-surface-200">
        <div class="fb-flex fb-gap-2 fb-items-center fb-flex-wrap">
          <p class="fb-font-semibold fb-text-base">Danh sách sản phẩm theo HDDV</p>
          <FbDateFilter module="invoice" useSinglePicker @update:modelValue="filter" size="small" />

          <Button
            size="small"
            @click.prevent="filter"
            v-tooltip.top="{
              value: 'Tra cứu',
              showDelay: 500,
              hideDelay: 100,
            }"
          >
            <IconSearch color="currentColor" />
          </Button>
          <div class="fb-ml-auto fb-flex fb-gap-2">
            <Button
              v-tooltip.bottom="showAdvancedFilter ? 'Ẩn bộ lọc' : 'Lọc nâng cao'"
              :severity="showAdvancedFilter ? 'primary' : 'secondary'"
              outlined
              size="small"
              @click="showAdvancedFilter = !showAdvancedFilter"
            >
              <IconFilter color="currentColor" class="fb-h-5 fb-w-5" />
            </Button>
            <Button
              :loading="isLoadingExport"
              size="small"
              outlined
              class="!fb-rounded-lg"
              @click="handleExportExcel"
            >
              <IconDownload v-if="!isLoadingExport" color="currentColor" />
              <FbLoading v-else show />
              Xuất excel
            </Button>
          </div>
        </div>
        <transition name="filter-slide">
          <div
            v-show="showAdvancedFilter"
            class="fb-flex fb-flex-wrap fb-gap-4 fb-w-full fb-mt-2 fb-pt-2 fb-border-t"
          >
            <Select
              v-model="filterStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Trạng thái"
              class="fb-flex-1"
              size="small"
              showClear
              @change="filter"
            />
            <InputText
              v-model="filterPattern"
              placeholder="Mẫu số"
              class="fb-flex-1"
              size="small"
              @keyup.enter="filter"
            />
            <InputText
              v-model="filterSerial"
              placeholder="Ký hiệu"
              class="fb-flex-1"
              size="small"
              @keyup.enter="filter"
            />
            <InputText
              v-model="filterNo"
              placeholder="Số hóa đơn"
              class="fb-flex-1"
              type="number"
              size="small"
              @keyup.enter="filter"
            />
          </div>
        </transition>
      </div>
    </template>

    <template #table>
      <!--
      <FbTable
        :columns="INPUT_INVOICE_PRODUCT_COLUMNS"
        :items="items"
        :hideIndexRow="true"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="inputInvoiceProducts.data?.total || 0"
        scrollHeight="flex"
        keyLoading="id"
        @page-change="getData"
      >
        <template #pattern_serial="{ row }">{{ row.pattern }} - {{ row.serial }}</template>
        <template #no="{ index }">
          {{ index + 1 }}
        </template>
        <template #empty>
          {{
            inputInvoiceProducts?.error
              ? 'Error: ' + inputInvoiceProducts?.error
              : 'Chưa có sản phẩm hóa đơn đầu vào'
          }}
        </template>
      </FbTable>
      -->

      <div class="product-table">
        <div class="product-table__scroll">
          <table>
            <thead>
              <tr>
                <th v-for="col in INPUT_INVOICE_PRODUCT_COLUMNS" :key="col.field">
                  {{ col.header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="isLoading">
                <tr v-for="i in pageSize" :key="i" class="product-table__skeleton-row">
                  <td v-for="col in INPUT_INVOICE_PRODUCT_COLUMNS" :key="col.field">
                    <Skeleton height="1rem" />
                  </td>
                </tr>
              </template>

              <tr v-else-if="!items.length">
                <td :colspan="INPUT_INVOICE_PRODUCT_COLUMNS.length" class="product-table__empty">
                  {{
                    inputInvoiceProducts?.error
                      ? 'Error: ' + inputInvoiceProducts?.error
                      : 'Chưa có sản phẩm hóa đơn đầu vào'
                  }}
                </td>
              </tr>

              <template v-else>
                <tr v-for="(row, index) in processedItems" :key="row.id || index">
                  <template v-for="col in INPUT_INVOICE_PRODUCT_COLUMNS" :key="col.field">
                    <td v-if="!row.mergeFlags[col.field]" :rowspan="row.rowSpans[col.field] || 1">
                      <template v-if="col.field === 'no'">{{ row.displayIndex }}</template>
                      <template v-else-if="col.field === 'pattern_serial'">
                        {{ row.pattern }} - {{ row.serial }}
                      </template>
                      <template v-else-if="col.format === 'date'">
                        {{ formatDate(row[col.field]) }}
                      </template>
                      <template v-else-if="col.format === 'currency'">
                        {{ formatCurrency(row[col.field]) }}
                      </template>
                      <template v-else>{{ row[col.field] }}</template>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="product-table__footer">
          <div class="product-table__paginator">
            <Select
              v-model="internalRows"
              :options="[10, 20, 50, 100, 200]"
              size="small"
              @change="onRowsChange"
            />
            <span class="product-table__range-info">
              Hiển thị {{ rangeStart }} - {{ rangeEnd }} trên tổng số {{ totalRecords }}
            </span>
            <div class="product-table__page-btns">
              <Button
                size="small"
                severity="secondary"
                variant="outlined"
                :disabled="currentPage <= 1"
                @click="goToPage(1)"
                title="Trang đầu"
              >
                <IconChevronLeftDouble />
              </Button>
              <Button
                size="small"
                severity="secondary"
                variant="outlined"
                :disabled="currentPage <= 1"
                @click="goToPage(currentPage - 1)"
                title="Trang trước"
              >
                <IconChevronLeft />
              </Button>
              <template v-for="page in visiblePages" :key="page">
                <Button
                  v-if="page === '...'"
                  size="small"
                  class="product-table__page-ellipsis"
                  severity="secondary"
                  variant="outlined"
                  disabled
                >
                  …
                </Button>
                <Button
                  v-else
                  size="small"
                  class="product-table__page-num"
                  :severity="page !== currentPage ? 'secondary' : null"
                  :variant="page !== currentPage ? 'outlined' : null"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </Button>
              </template>
              <Button
                size="small"
                severity="secondary"
                variant="outlined"
                :disabled="currentPage >= totalPageCount"
                @click="goToPage(currentPage + 1)"
                title="Trang sau"
              >
                <IconChevronRight />
              </Button>
              <Button
                size="small"
                severity="secondary"
                variant="outlined"
                :disabled="currentPage >= totalPageCount"
                @click="goToPage(totalPageCount)"
                title="Trang cuối"
              >
                <IconChevronRightDouble />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </TableView>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { INPUT_INVOICE_PRODUCT_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import { formatCurrency, formatDate } from '@/common/utils/common';
import IconChevronRight from '@/components/Common/Icon/IconChevronRight.vue';
import IconChevronLeft from '@/components/Common/Icon/IconChevronLeft.vue';
import IconChevronRightDouble from '@/components/Common/Icon/IconChevronRightDouble.vue';
import IconChevronLeftDouble from '@/components/Common/Icon/IconChevronLeftDouble.vue';
import { useInputInvoiceProductExport } from '@/composables/export/useInputInvoiceProductExport';

const { isLoadingExport, executeExport } = useInputInvoiceProductExport();

// Store/Getter
const invoiceStore = useEInoiveStore();
const filterStore = useFilterStore();
const globalStore = useGlobalStore();

// State
const searchField = ref(null);
const showAdvancedFilter = ref(true);
const currentPage = ref(1);
const pageSize = ref(50);

const filterStatus = ref(null);
const filterPattern = ref('');
const filterSerial = ref('');
const filterNo = ref('');

const internalRows = ref(50);

const statusOptions = ref([
  { label: 'Hóa đơn mới', value: '1' },
  { label: 'Hóa đơn điều chỉnh', value: '2' },
  { label: 'Hóa đơn thay thế', value: '3' },
  { label: 'Hóa đơn đã bị thay thế', value: '4' },
  { label: 'Hóa đơn đã bị điều chỉnh', value: '5' },
  { label: 'Hóa đơn đã bị hủy', value: '6' },
]);

const inputInvoiceProducts = computed(() => invoiceStore.inputInvoiceProducts);
const items = ref([]);
const totalRecords = computed(() => inputInvoiceProducts.value?.data?.total || 0);

const isLoading = ref(false);

// Xử lý gộp dòng (merge cells) cho các sản phẩm cùng hóa đơn
const processedItems = computed(() => {
  const result = [];
  const rawItems = items.value;
  if (!rawItems.length) return [];

  // Các cột cần gộp nếu trùng invoice_no
  const fieldsToMerge = ['no', 'invoice_no', 'invoice_date', 'pattern_serial', 'seller_name'];

  let currentInvoiceNo = null;
  let currentGroupStartIndex = -1;
  let displayIndex = 1; // Đánh số thứ tự (1 STT cho 1 hóa đơn)

  for (let i = 0; i < rawItems.length; i++) {
    const item = { ...rawItems[i], rowSpans: {}, mergeFlags: {} };

    // Khởi tạo mặc định cho tất cả các cột không gộp
    INPUT_INVOICE_PRODUCT_COLUMNS.forEach((col) => {
      if (!fieldsToMerge.includes(col.field)) {
        item.rowSpans[col.field] = 1;
        item.mergeFlags[col.field] = false;
      }
    });

    if (item.invoice_no !== currentInvoiceNo) {
      currentInvoiceNo = item.invoice_no;
      currentGroupStartIndex = i;
      item.displayIndex = displayIndex++;

      fieldsToMerge.forEach((field) => {
        item.rowSpans[field] = 1;
        item.mergeFlags[field] = false; // Render bình thường
      });
    } else {
      item.displayIndex = ''; // Không hiển thị STT ở các dòng bị gộp
      fieldsToMerge.forEach((field) => {
        result[currentGroupStartIndex].rowSpans[field] += 1;
        item.rowSpans[field] = 1;
        item.mergeFlags[field] = true; // Ẩn thẻ td
      });
    }
    result.push(item);
  }

  return result;
});

// Pagination computed
const totalPageCount = computed(() => Math.ceil(totalRecords.value / internalRows.value) || 1);

const rangeStart = computed(() => (currentPage.value - 1) * internalRows.value + 1);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * internalRows.value, totalRecords.value),
);

const visiblePages = computed(() => {
  const total = totalPageCount.value;
  const current = currentPage.value;

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  pages.push(total);

  return pages;
});

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || 1;
  pageSize.value = rows || internalRows.value;

  const payload = {
    company_tax_code: invoiceStore?.currentTaxCode,
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: invoiceStore.listStoreUidInCurrentTaxCode.join(','),
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
    page: currentPage.value,
    page_size: pageSize.value,
  };

  if (searchField.value) payload.search = searchField.value;
  if (filterStatus.value) payload.invoice_status = filterStatus.value;
  if (filterPattern.value) payload.pattern = filterPattern.value;
  if (filterSerial.value) payload.serial = filterSerial.value;
  if (filterNo.value) payload.no = filterNo.value;

  isLoading.value = true;
  await invoiceStore.getInputInvoiceProducts(payload);
  items.value = inputInvoiceProducts.value?.data?.data || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  items.value = [];
  await getData();
};

const handleExportExcel = async () => {
  await executeExport({
    searchField: searchField.value,
    filterStatus: filterStatus.value,
    filterPattern: filterPattern.value,
    filterSerial: filterSerial.value,
    filterNo: filterNo.value,
  });
};

const goToPage = (page) => {
  if (isLoading.value) return;
  if (page < 1 || page > totalPageCount.value) return;
  getData({ page, rows: internalRows.value });
};

const onRowsChange = (e) => {
  internalRows.value = Number(e.value);
  getData({ page: 1, rows: internalRows.value });
};

let searchTimeout = null;
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

// life cycle
onMounted(async () => {
  await getData();
});
</script>

<style lang="scss" scoped>
.product-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--surface-card, #fff);

  &__scroll {
    flex: 1;
    overflow: auto;

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
      white-space: nowrap;

      thead tr th {
        position: sticky;
        top: 0;
        z-index: 1;
        padding: 0.5rem 1.5rem;
        background-color: #fafafa;
        color: #85888e;
        font-weight: 500;
        text-align: left;
        border: 1px solid var(--surface-border, #e5e7eb);
      }

      tbody tr {
        &:hover td {
          background-color: var(--surface-hover, #f9fafb);
        }

        td {
          padding: 0.5rem 1.5rem;
          color: var(--text-color, #374151);
          border: 1px solid var(--surface-border, #e5e7eb);
        }
      }
    }
  }

  &__skeleton-row td {
    padding: 0.625rem 1.5rem !important;
  }

  &__empty {
    padding: 3rem 1.5rem !important;
    text-align: center;
    color: var(--text-color-secondary, #6b7280);
  }

  &__footer {
    flex-shrink: 0;
    border-top: 1px solid var(--surface-border, #e5e7eb);
    padding: 0.5rem 1rem;
    background: var(--surface-card, #fff);
  }

  &__paginator {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.875rem;
    color: var(--text-color-secondary, #6b7280);
  }

  &__range-info {
    white-space: nowrap;
  }

  &__page-btns {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    // margin-left: auto;
  }

  &__page-num,
  &__page-ellipsis {
    min-width: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
