<template>
  <FbTableView
    title="Hóa đơn bán hàng"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm mã hóa đơn"
    @search="onSearchChange"
  >
    <template #header-actions>
      <Button
        v-if="saleSelecteds.length > 1"
        size="small"
        severity="help"
        @click="handleExportVat(true)"
      >
        Xuất ngay
      </Button>
      <Button v-if="saleSelecteds.length" size="small" @click="handleExportVat(false)">
        Xuất chi tiết
      </Button>
    </template>

    <template #filters>
      <FbDateFilter @update:modelValue="filter" size="small" />
      <!-- <FbSelectCityStoreFilter
        :placeholder="$t('SELECT_CITIES_STORES_FILTER--INPUT_PLACEHOLDER_BLUR')"
        size="normal"
        @update:modelValue="filter"
      /> -->
      <!-- <FbSelectTaxStoreFilter
        placeholder="Chọn theo mã số thuế"
        size="normal"
        @update:modelValue="filter"
      /> -->
      <FbSelectSingleTaxStoreFilter
        placeholder="Chọn theo cửa hàng"
        size="small"
        @update:modelValue="filter"
      />
    </template>

    <template #table>
      <FbTable
        v-model:selection="saleSelecteds"
        :columns="columns"
        :items="sales"
        enableCheckbox
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="saleNotSyncVat.data?.num_results || 0"
        :totalPages="saleNotSyncVat.data?.total_pages || 0"
        @page-change="getData"
      >
        <template #tran_id="{ record, row }">
          <span v-tooltip.top="record ? { value: record } : null">
            {{ truncate(record) }}
          </span>
          <span v-if="row?.extra_sale?.error_vat" v-tooltip="{ value: row?.extra_sale?.error_vat }">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="!fb-inline fb-ml-1"
            >
              <g clip-path="url(#clip0_2505_55752)">
                <path
                  d="M7.99999 10.6666V7.99998M7.99999 5.33331H8.00666M14.6667 7.99998C14.6667 11.6819 11.6819 14.6666 7.99999 14.6666C4.3181 14.6666 1.33333 11.6819 1.33333 7.99998C1.33333 4.31808 4.3181 1.33331 7.99999 1.33331C11.6819 1.33331 14.6667 4.31808 14.6667 7.99998Z"
                  stroke="#D92D20"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2505_55752">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </template>
        <template #empty>
          {{
            saleNotSyncVat?.error ||
            (!filterStore?.report?.store_uid ? 'Vui lòng chọn cửa hàng' : 'Chưa có hóa đơn')
          }}
        </template>
      </FbTable>
    </template>

    <template #extra>
      <ModalExportVat
        v-model:visible="visibleExportVat"
        :saleData="currentSaleData"
        @success="filter"
      />
    </template>
  </FbTableView>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { onMounted, ref, computed } from 'vue';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';
import FbTableView from '@/components/Common/FbTableView.vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

// Constants
const columns = [
  {
    field: 'tran_id',
    header: 'Mã hóa đơn',
    format: 'truncate',
    frozen: true,
    alignFrozen: 'left'
  },
  { field: 'vat_invoice_number', header: 'Số hóa đơn điện tử' },
  { field: 'vat_amount', header: 'Giá trị VAT', sortable: true },
  { field: 'shift_id', header: 'Mã ca', format: 'truncate' },
  { field: 'staff', header: 'Nhân viên' },
  { field: 'table_name', header: 'Bàn' },
  { field: 'area_name', header: 'Khu vực' },
  { field: 'total_amount', header: 'Tổng tiền', format: 'currency' },
  {
    field: 'start_date',
    header: 'Thời gian vào',
    format: 'datetime'
  },
  {
    field: 'end_date',
    header: 'Thời gian ra'
  }
];

// State
const searchField = ref(null);

const saleSelecteds = ref([]);
const saleNotSyncVat = computed(() => invoiceStore.saleNotSyncVat);
const sales = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);

const visibleExportVat = ref(false);
const currentSaleData = ref({});

// Methods
const getData = async ({ page, rows } = {}) => {
  if (!filterStore?.report?.store_uid) return;

  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: filterStore?.report?.store_uid,
    start_date: new Date(filterStore?.report?.start_date).getTime(),
    end_date: new Date(filterStore?.report?.end_date).getTime(),
    page: currentPage.value,
    results_per_page: pageSize.value,
    search: searchField.value
  };

  isLoading.value = true;
  await invoiceStore.getSaleNotSyncVat(payload);
  sales.value = saleNotSyncVat.value?.data?.data || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  sales.value = [];
  await getData();
};

const handleExportVat = (isImmediate = false) => {
  if (!saleSelecteds.value.length) return;
  // Chuẩn bị dữ liệu truyền vào Modal
  // Nếu là nhiều sales, API thường nhận object chứa array list_sale
  currentSaleData.value = {
    sales: saleSelecteds.value,
    is_immediate: isImmediate // Flag để modal biết là xuất ngay (nếu cần xử lý riêng)
  };

  visibleExportVat.value = true;
};

let searchTimeout = null;
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

const truncate = (value) => {
  return value ? `#${value.toString().slice(-5)}` : '';
};

onMounted(() => {
  getData();
});
</script>
