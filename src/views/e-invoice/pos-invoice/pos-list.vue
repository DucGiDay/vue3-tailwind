<template>
  <TableView title="Gửi hóa đơn MTT" v-model:searchValue="searchField" searchPlaceholder="Tìm kiếm số hóa đơn"
    @search="onSearchChange">
    <template #header-actions>
      <Button size="small" raised severity="secondary" @click="directToConfig">
        <IconSetting />
        Cấu hình thời gian gửi
      </Button>
      <Button size="small" raised @click="directToCreate">
        <IconPlus />
        Tạo MTT
      </Button>
      <!-- <Button size="small" severity="danger" outlined @click="onDeleteAll">Xóa tất cả MTT</Button> -->
      <!-- <Button
        size="small"
        severity="success"
        raised
        :disabled="!selectedItems.length"
        @click="onSendInvoice"
      >
        Gửi Hóa đơn MTT
      </Button> -->
      <ButtonExtendInvoice />
    </template>

    <template #filters>
      <Select v-model="statusField" :options="statusOptions" optionLabel="label" optionValue="value"
        placeholder="Chọn trạng thái" class="fb-w-auto md:fb-w-48" showClear size="small" @change="filter" />

      <FbDateFilter module="invoice" @update:modelValue="filter" size="small" />
    </template>

    <template #table>
      <FbTable v-model:selection="selectedItems" :columns="POS_INVOICE_TABLE_COLUMNS" :items="items"
        enableScrollPagination enableCheckbox :stripedRows="false" :isLoading="isLoading" :currentPage="currentPage"
        :pageSize="pageSize" scrollHeight="flex" :hasMoreData="hasMoreData" @page-change="loadMore">
        <template #status="{ row }">
          <Tag :severity="statusMap(row.status).severity" :value="statusMap(row.status).label"
            class="!fb-text-xs !fb-font-medium" />
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-justify-center">
            <Button size="small" variant="text" @click="onViewDetail(row)">
              <IconEye class="!fb-text-primary" color="currentColor" />
            </Button>
          </div>
        </template>

        <template #empty>
          {{ posInvoiceList?.error ? 'Error: ' + posInvoiceList?.error : 'Chưa có dữ liệu' }}
        </template>
      </FbTable>
    </template>

    <template #extra>
      <!-- Dialog Chi tiết -->
      <Dialog v-model:visible="showDetailDialog" header="Chi tiết hóa đơn MTT" modal :style="{ width: '65vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="fb-w-full fb-h-full">
          <FbTable :columns="POS_INVOICE_DETAIL_COLUMNS" :items="itemDetailList" :isLoading="isLoadingDetail"
            :showGridlines="true" :hideIndexRow="true" :scrollHeight="'flex'">
            <template #['extra_data.IPTemplateID']="{ row }">
              {{ row.extra_data?.IPTemplateID || '' }}
            </template>
            <template #no="{ index }">
              {{ index + 1 }}
            </template>
            <template #status="{ row }">
              <Tag :severity="statusMap(row.status).severity" :value="statusMap(row.status).label"
                class="!fb-text-xs !fb-font-medium" />
            </template>
          </FbTable>
        </div>
      </Dialog>
    </template>
  </TableView>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import FbTable from '@/components/Common/FbTable.vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import IconEye from '@/components/Common/Icon/IconEye.vue';
import ButtonExtendInvoice from '@/components/SharedComponent/ButtonExtendInvoice.vue';

// --- Initialization ---
const router = useRouter();
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();
const toast = useToast();

// --- State ---
const searchField = ref('');
const statusField = ref(null);
const currentPage = ref(1);
const pageSize = ref(50);
const isLoading = ref(false);
const selectedItems = ref([]);
const showDetailDialog = ref(false);
const itemDetailList = ref([]);
const isLoadingDetail = ref(false);
let searchTimeout = null;
const hasMoreData = ref(true);
const items = ref([]);

// --- Constants & Options ---
const POS_INVOICE_TABLE_COLUMNS = [
  { field: 'total', header: 'Tổng số hóa đơn' },
  { field: 'created_by', header: 'Người tạo' },
  { field: 'created_at', header: 'Ngày tạo', format: 'date' },
  { field: 'created_by', header: 'Người cập nhật' },
  { field: 'finished_at', header: 'Ngày cập nhật', format: 'date' },
  { field: 'status', header: 'Trạng thái' },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '3rem', minWidth: '3rem', padding: '0 0 0 0.25rem !important' },
  },
];

const POS_INVOICE_DETAIL_COLUMNS = [
  { field: 'no', header: 'STT' },
  { field: 'extra_data.IPTemplateID', header: 'Mẫu số' },
  { field: 'vat_invoice_series', header: 'Ký hiệu' },
  { field: 'vat_invoice_number', header: 'Số' },
  { field: 'merged_tran_id', header: 'Mã tra cứu' },
  { field: 'vat_invoice_code', header: 'Mã cơ quan thuế' },
  { field: 'vat_invoice_date', header: 'Ngày hóa đơn', format: 'date' },
  { field: 'status', header: 'Trạng thái' },
];

const statusOptions = [
  { label: 'Thất bại', value: 'failed' },
  { label: 'Thành công', value: 'done' },
  { label: 'Đang đồng bộ', value: 'pending' },
];

// --- Computed ---
const posInvoiceList = computed(() => invoiceStore.posInvoiceList || {});
// const items = computed(() => posInvoiceList.value?.batches || []);

// --- Methods ---
const getData = async () => {
  const payload = {
    company_uid: globalStore?.currentUser?.company_uid,
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
    offset: (currentPage.value - 1) * pageSize.value,
    limit: pageSize.value,
    status: statusField.value,
  };

  isLoading.value = true;
  await invoiceStore.getListBatchInvoice(payload);
  if (currentPage.value === 1) {
    items.value = posInvoiceList.value?.batches || [];
  } else {
    items.value = [...items.value, ...(posInvoiceList.value?.batches || [])];
  }
  hasMoreData.value = (posInvoiceList.value?.batches || []).length === pageSize.value;
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  selectedItems.value = [];
  await getData();
};

const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

const directToCreate = () => {
  router.push('/e-invoice/pos-invoice/create');
};

const directToConfig = () => {
  router.push('/e-invoice/pos-invoice/config-time');
};

const statusMap = (status) => {
  const map = {
    done: { severity: 'success', label: 'Thành công' },
    pending: { severity: 'warn', label: 'Đang đồng bộ' },
    failed: { severity: 'danger', label: 'Thất bại' },
  };
  return map[status] || { severity: 'secondary', label: status };
};

const onViewDetail = async (row) => {
  itemDetailList.value = [];
  showDetailDialog.value = true;

  if (!row.list_merged_tran_id || !row.list_merged_tran_id.length) return;

  isLoadingDetail.value = true;
  try {
    const list_merged_tran_id = Array.isArray(row.list_merged_tran_id)
      ? row.list_merged_tran_id.join(',')
      : row.list_merged_tran_id;

    const res = await invoiceService.getInvoiceByTranIds({ list_merged_tran_id });
    itemDetailList.value = (res?.data?.invoices || []).map((item) => {
      return {
        ...item,
        status: row.status,
      };
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết hóa đơn POS:', error);
  } finally {
    isLoadingDetail.value = false;
  }
};

const loadMore = async () => {
  if (isLoading.value || !hasMoreData.value) return;
  currentPage.value += 1;
  getData();
};

// --- Lifecycle hooks ---
onMounted(() => {
  getData();
});
</script>
