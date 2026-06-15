<template>
  <TableView title="Danh sách hóa đơn đầu vào" :searchable="false">
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
        :columns="INPUT_INVOICE_TABLE_COLUMNS"
        :items="items"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="inputInvoiceList.data?.total || 0"
        scrollHeight="flex"
        keyLoading="id"
        @page-change="getData"
      >
        <template #pattern_serial="{ row }">{{ row.pattern }} - {{ row.serial }}</template>

        <template #invoice_status="{ row }">
          <Tag
            :severity="INVOICE_STATUS_SEVERITY[row.invoice_status] || 'secondary'"
            :value="INVOICE_STATUS_LABEL[row.invoice_status] || '-'"
            class="!fb-text-xs !fb-font-medium"
          />
        </template>

        <template #status_tax_code_name="{ row }">
          <Tag
            severity="success"
            :value="row.status_tax_code_name || 'NNT đang hoạt động'"
            class="!fb-text-xs !fb-font-medium"
          />
        </template>

        <template #payment_status="{ row }">
          <Tag
            :severity="row.payment_status ? 'success' : 'warning'"
            :value="row.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán'"
            class="!fb-text-xs !fb-font-medium"
          />
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-justify-center">
            <Button size="small" variant="text" @click="onViewDetail(row)">
              <IconEye class="!fb-text-primary" color="currentColor" />
            </Button>
          </div>
        </template> -->

        <template #empty>
          {{
            inputInvoiceList?.error
              ? 'Error: ' + inputInvoiceList?.error
              : 'Chưa có hóa đơn đầu vào'
          }}
        </template>
      </FbTable>
    </template>
  </TableView>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { INPUT_INVOICE_TABLE_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const INVOICE_STATUS_LABEL = {
  '1': 'Hóa đơn mới',
  '2': 'Hóa đơn điều chỉnh',
  '3': 'Hóa đơn thay thế',
  '4': 'Hóa đơn đã bị thay thế',
  '5': 'Hóa đơn đã bị điều chỉnh',
  '6': 'Hóa đơn đã bị hủy',
};

const INVOICE_STATUS_SEVERITY = {
  '1': 'success',
  '2': 'info',
  '3': 'info',
  '4': 'secondary',
  '5': 'secondary',
  '6': 'danger',
};

const router = useRouter();

// Store/Getter
const invoiceStore = useEInoiveStore();
const filterStore = useFilterStore();
const globalStore = useGlobalStore();

const toast = useToast();

// State
const searchField = ref(null);
const currentPage = ref(1);
const pageSize = ref(50);

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

const inputInvoiceList = computed(() => invoiceStore.inputInvoiceList); // data from api
const items = ref([]); // data display in table

const isLoading = ref(false);

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || 1;
  pageSize.value = rows || 50;

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
  await invoiceStore.getInputInvoiceList(payload);
  items.value = inputInvoiceList.value?.data?.data || [];
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

const onAddNew = () => {
  toast.add({ severity: 'info', summary: 'Tính năng đang được phát triển', life: 3000 });
};

const onViewDetail = (row) => {
  toast.add({
    severity: 'info',
    summary: `Xem chi tiết hóa đơn: ${row.invoice_number}`,
    life: 3000,
  });
};

// life cycle
onMounted(async () => {
  await getData();
});
</script>
