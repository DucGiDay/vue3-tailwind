<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-8']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Quản lý hóa đơn</h4>
    </div>
  </div>
  <div :class="['fb-flex fb-flex-wrap fb-gap-3 fb-justify-between fb-items-center fb-mb-4']">
    <div class="fb-flex fb-flex-wrap fb-gap-3 fb-items-center">
      <Select
        v-model="statusField"
        :options="statusOptions"
        optionLabel="name"
        placeholder="Chọn trạng thái"
        class="fb-w-full md:fb-w-48"
      />
      <DatePicker
        ref="datePicker"
        v-model="dates"
        selectionMode="range"
        :manualInput="false"
        dateFormat="dd/mm/yy"
        @update:modelValue="onDateChange"
      />
      <FbSelectCityStore
        :placeholder="$t('SELECT_CITIES_STORES_FILTER--INPUT_PLACEHOLDER_BLUR')"
        size="normal"
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
          placeholder="Tìm kiếm mã hóa đơn hoặc tên khách hàng"
          class="fb-w-full md:fb-w-80"
          @input="onSearchChange"
        />
      </IconField>
    </div>
  </div>

  <div class="!fb-p-0 invoice_manage--table">
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
      :totalRecords="vatInvoice.data?.num_results || 0"
      :totalPages="vatInvoice.data?.total_pages || 0"
      @page-change="getData"
    >
      <!-- <SelectButton v-model="selectButtonValue" :options="selectButtonValues" optionLabel="name" /> -->
      <!-- <Tabs value="0" class="">
        <TabList class="fb-rounded-t-xl">
          <Tab value="0" class="fb-text-sm">Hóa đơn đã xuất VAT</Tab>
          <Tab value="1" class="fb-text-sm">Hóa đơn chưa xuất VAT</Tab>
        </TabList>
      </Tabs> -->

      <template #tran_info="{ row }">
        <div class="fb-text-sm">{{ `Ký hiệu: ${row?.inv_series}` }}</div>
        <div class="fb-text-sm fb-text-muted-color">
          Mã tra cứu:
          <span class="fb-text-primary">{{ row.id }}</span>
        </div>
      </template>

      <template #inv_buyerLegalName="{ record, row }">
        <div>{{ `Tên: ${record}` }}</div>
        <div class="fb-text-muted-color">{{ `Mã/MST: ${row?.info_customer}` }}</div>
      </template>
      <template #invoice_type="{ record, row }">
        <div>{{ record }}</div>
        <div v-if="row?.tran_id" class="fb-text-primary">({{ row.tran_id }})</div>
      </template>

      <template #vat_publish_status="{ record }">
        <span
          :class="statusMap(record)?.class"
          class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
        >
          {{ statusMap(record)?.label }}
        </span>
      </template>

      <template #empty>
        {{ vatInvoice?.error || 'Chưa có hóa đơn' }}
      </template>
    </FbTable>
  </div>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { VAT_PUBLISH_STATUS_COLOR } from '@/common/constant/e-invoice.constant';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

// constants
const columns = [
  { field: 'tran_info', header: 'Thông tin hóa đơn' },
  { field: 'list_tran_no', header: 'Số hóa đơn', classes: 'fb-text-muted-color' },
  { field: 'inv_buyerDisplayName', header: 'Người mua', classes: 'fb-text-muted-color' },
  { field: 'inv_buyerLegalName', header: 'Thông tin khách hàng' },
  {
    field: 'vat_invoice_date',
    header: 'Ngày hóa đơn',
    classes: 'fb-text-muted-color',
    format: 'date'
  },
  { field: 'total_amount', header: 'Tổng tiền', format: 'currency' },
  { field: 'invoice_type', header: 'Loại hóa đơn', classes: 'fb-text-muted-color' },
  { field: 'vat_publish_status', header: 'Trạng thái' },
  { field: 'action', header: '' }
];

// State
const datePicker = ref();
let dates = reactive([
  new Date(filterStore.report.start_date),
  new Date(filterStore.report.end_date)
]);
const searchField = ref(null);
const statusField = ref(null);
const statusOptions = ref([{ name: 'Tất cả trạng thái', code: null }]);

const statusMap = (status) => {
  return VAT_PUBLISH_STATUS_COLOR[status] || VAT_PUBLISH_STATUS_COLOR[null];
};

const saleSelecteds = ref([]);
const vatInvoice = computed(() => invoiceStore.vatInvoice);
const sales = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = 10;

// Methods
const getData = async () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: filterStore?.report?.stores_uid?.length
      ? filterStore?.report?.stores_uid.join(',')
      : (globalStore?.storesIdAccessibleInCurrentBrand || []).join(','),
    start_date: new Date(dates[0]).getTime(),
    end_date: new Date(dates[1]).getTime(),
    page: currentPage.value,
    results_per_page: pageSize,
    search: searchField.value
  };

  isLoading.value = true;
  await invoiceStore.getVatInvoice(payload);
  sales.value = [...sales.value, ...(vatInvoice.value?.data?.data || [])];
  currentPage.value++;
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  sales.value = [];
  await getData();
};

const onDateChange = async (value) => {
  if (value && value[0] && value[1]) {
    datePicker.value.overlayVisible = false;
    await filter();
  }
};
let searchTimeout = null;
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

// life cycle
onMounted(() => {
  getData();
});
</script>

<style lang="scss">
// .invoice_manage--table {
//   th {
//     border-top-color: transparent !important;
//     border-radius: 0 !important;
//   }
// }
</style>
