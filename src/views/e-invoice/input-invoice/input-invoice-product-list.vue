<template>
  <TableView title="Danh sách sản phẩm theo HDDV" :searchable="false">
    <template #header-actions>
      <!-- Có thể thêm nút Xuất Excel hoặc Thêm mới nếu cần -->
    </template>

    <template #filters>
      <FbDateFilter module="invoice" @update:modelValue="filter" size="small" />
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
      <Button size="small" @click.prevent="filter">
        <IconSearch color="currentColor" />
      </Button>
    </template>

    <template #table>
      <FbTable
        :columns="INPUT_INVOICE_PRODUCT_COLUMNS"
        :items="items"
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

        <template #empty>
          {{
            inputInvoiceProducts?.error
              ? 'Error: ' + inputInvoiceProducts?.error
              : 'Chưa có sản phẩm hóa đơn đầu vào'
          }}
        </template>
      </FbTable>
    </template>
  </TableView>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { INPUT_INVOICE_PRODUCT_COLUMNS } from '@/common/constant/e-invoice-column.constant';

// Store/Getter
const invoiceStore = useEInoiveStore();
const filterStore = useFilterStore();
const globalStore = useGlobalStore();

// State
const searchField = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);

const filterStatus = ref(null);
const filterPattern = ref('');
const filterSerial = ref('');
const filterNo = ref('');

const statusOptions = ref([
  { label: 'Hóa đơn mới', value: '1' },
  { label: 'Hóa đơn điều chỉnh', value: '2' },
  { label: 'Hóa đơn thay thế', value: '3' },
  { label: 'Hóa đơn đã bị thay thế', value: '4' },
  { label: 'Hóa đơn đã bị điều chỉnh', value: '5' },
  { label: 'Hóa đơn đã bị hủy', value: '6' },
]);

const inputInvoiceProducts = computed(() => invoiceStore.inputInvoiceProducts); // data from api
const items = ref([]); // data display in table

const isLoading = ref(false);

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || 1;
  pageSize.value = rows || 20;

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
  if (filterStatus.value) payload.tax_declared = filterStatus.value;
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
