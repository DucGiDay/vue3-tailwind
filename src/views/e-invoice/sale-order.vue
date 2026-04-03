<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-6']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Hóa đơn bán hàng</h4>
    </div>
    <div class="fb-flex fb-justify-end fb-gap-2">
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
    </div>
  </div>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-4']">
    <div class="fb-flex fb-items-center fb-space-x-3">
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
    </div>
    <div>
      <IconField>
        <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="fb-h-[1rem]"
          >
            <path
              d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
              stroke="#A4A7AE"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </InputIcon>
        <InputText
          v-model="searchField"
          placeholder="Tìm kiếm mã hóa đơn"
          class="fb-w-full md:fb-w-72"
          size="small"
          @input="onSearchChange"
        />
      </IconField>
    </div>
  </div>

  <FbTable
    v-model:selection="saleSelecteds"
    :columns="columns"
    :items="sales"
    enableCheckbox
    enableScrollPagination
    :stripedRows="false"
    :isLoading="isLoading"
    :currentPage="currentPage"
    :pageSize="pageSize"
    :totalRecords="saleNotSyncVat.data?.num_results || 0"
    :totalPages="saleNotSyncVat.data?.total_pages || 0"
    @page-change="getData"
  >
    <template #tran_info="{ row }">
      <div class="fb-text-sm">{{ `Ký hiệu: ${row.tran_info}` }}</div>
      <div class="fb-text-sm fb-text-muted-color">
        Mã tra cứu:
        <span class="fb-text-primary">{{ row.search_code }}</span>
      </div>
    </template>

    <template #inv_buyerLegalName="{ record, row }">
      <div>{{ `Tên: ${record}` }}</div>
      <div class="fb-text-muted-color">{{ `Mã/MST: ${row?.inv_buyerTaxCode}` }}</div>
    </template>

    <template #type="{ record, row }">
      <div>{{ record }}</div>
      <div v-if="row?.tran_id_origin" class="fb-text-primary">({{ row.tran_id_origin }})</div>
    </template>

    <template #empty>
      {{
        saleNotSyncVat?.error ||
        (!filterStore?.report?.store_uid ? 'Vui lòng chọn cửa hàng' : 'Chưa có hóa đơn')
      }}
    </template>
  </FbTable>

  <ModalExportVat
    v-model:visible="visibleExportVat"
    :saleData="currentSaleData"
    @success="filter"
  />
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { onMounted, ref, computed } from 'vue';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';

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
const pageSize = 50;

const visibleExportVat = ref(false);
const currentSaleData = ref({});

// Methods
const getData = async () => {
  if (!filterStore?.report?.store_uid) return;
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: filterStore?.report?.store_uid,
    start_date: new Date(filterStore?.report?.start_date).getTime(),
    end_date: new Date(filterStore?.report?.end_date).getTime(),
    page: currentPage.value,
    results_per_page: pageSize,
    search: searchField.value
  };

  isLoading.value = true;
  await invoiceStore.getSaleNotSyncVat(payload);
  sales.value = [...sales.value, ...(saleNotSyncVat.value?.data?.data || [])];
  currentPage.value++;
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

onMounted(() => {
  getData();
});
</script>
