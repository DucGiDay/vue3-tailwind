<template>
  <TableView
    title="Gửi hóa đơn MTT"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm số hóa đơn"
    @search="onSearchChange"
  >
    <template #header-actions>
      <Button size="small" raised @click="directToCreate">Tạo MTT</Button>
      <Button size="small" outlined @click="directToConfig">Cấu hình thời gian gửi</Button>
      <Button size="small" severity="danger" outlined @click="onDeleteAll">Xóa tất cả MTT</Button>
      <Button
        size="small"
        severity="success"
        raised
        :disabled="!selectedItems.length"
        @click="onSendInvoice"
      >
        Gửi Hóa đơn MTT
      </Button>
    </template>

    <template #filters>
      <Select
        v-model="statusField"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Chọn trạng thái"
        class="fb-w-auto md:fb-w-48"
        showClear
        size="small"
        @change="filter"
      />
      <Select
        v-model="symbolField"
        :options="symbolOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Chọn ký hiệu"
        class="fb-w-auto md:fb-w-48"
        showClear
        size="small"
        @change="filter"
      />
      <FbDateFilter @update:modelValue="filter" size="small" />
    </template>

    <template #table>
      <FbTable
        v-model:selection="selectedItems"
        :columns="POS_INVOICE_TABLE_COLUMNS"
        :items="items"
        enablePagination
        enableCheckbox
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="posInvoiceList.total || 0"
        scrollHeight="flex"
        keyLoading="id"
        @page-change="getData"
      >
        <!-- Custom columns -->
        <template #status="{ record }">
          <span
            class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
            :class="{
              'fb-bg-green-100 fb-text-green-800': record.status === 'sent',
              'fb-bg-yellow-100 fb-text-yellow-800': record.status === 'draft',
              'fb-bg-red-100 fb-text-red-800': record.status === 'error'
            }"
          >
            {{
              record.status === 'sent' ? 'Đã gửi' : record.status === 'draft' ? 'Bản nháp' : 'Lỗi'
            }}
          </span>
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
      <Dialog
        v-model:visible="showDetailDialog"
        header="Chi tiết hóa đơn POS"
        modal
        :style="{ width: '450px' }"
      >
        <div v-if="itemDetail" class="fb-flex fb-flex-col fb-gap-3">
          <div class="fb-flex fb-justify-between">
            <span class="fb-font-medium">Số hóa đơn:</span>
            <span>{{ itemDetail.invoice_number }}</span>
          </div>
          <div class="fb-flex fb-justify-between">
            <span class="fb-font-medium">Ký hiệu:</span>
            <span>{{ itemDetail.symbol }}</span>
          </div>
          <div class="fb-flex fb-justify-between">
            <span class="fb-font-medium">Người tạo:</span>
            <span>{{ itemDetail.creator }}</span>
          </div>
          <div class="fb-flex fb-justify-between">
            <span class="fb-font-medium">Trạng thái:</span>
            <span>
              {{
                itemDetail.status === 'sent'
                  ? 'Đã gửi'
                  : itemDetail.status === 'draft'
                    ? 'Bản nháp'
                    : 'Lỗi'
              }}
            </span>
          </div>
        </div>
        <template #footer>
          <Button label="Đóng" @click="showDetailDialog = false" variant="text" size="small" />
        </template>
      </Dialog>
    </template>
  </TableView>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import IconEye from '@/components/Common/Icon/IconEye.vue';

const router = useRouter();
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();
const toast = useToast();

const POS_INVOICE_TABLE_COLUMNS = [
  { field: 'invoice_number', header: 'Số' },
  { field: 'creator', header: 'Người tạo' },
  { field: 'created_at', header: 'Ngày tạo', format: 'date' },
  { field: 'updater', header: 'Người cập nhật' },
  { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'action', header: 'Thao tác' }
];

const statusOptions = [
  { label: 'Bản nháp', value: 'draft' },
  { label: 'Đã gửi', value: 'sent' },
  { label: 'Lỗi', value: 'error' }
];

const symbolOptions = [
  { label: 'K126T', value: 'K126T' },
  { label: 'K226T', value: 'K226T' }
];

const searchField = ref('');
const statusField = ref(null);
const symbolField = ref(null);

const currentPage = ref(1);
const pageSize = ref(50);
const isLoading = ref(false);
const selectedItems = ref([]);

const posInvoiceList = computed(() => invoiceStore.posInvoiceList || {});
const items = computed(() => {
  return (posInvoiceList.value?.items || []).map((item, index) => ({
    ...item,
    no: (currentPage.value - 1) * pageSize.value + index + 1
  }));
});

const showDetailDialog = ref(false);
const itemDetail = ref(null);

const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    start_date: filterStore?.report?.start_date,
    end_date: filterStore?.report?.end_date,
    page: currentPage.value,
    results_per_page: pageSize.value,
    search: searchField.value,
    status: statusField.value,
    symbol: symbolField.value
  };

  isLoading.value = true;
  await invoiceStore.getListPosInvoice(payload);
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  selectedItems.value = [];
  await getData();
};

let searchTimeout = null;
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

const onDeleteAll = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả Máy tính tiền?')) {
    invoiceService.deletePosInvoice().then(() => {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã xóa tất cả MTT',
        life: 3000
      });
      filter();
    });
  }
};

const onSendInvoice = () => {
  if (selectedItems.value.length === 0) return;
  invoiceService.sendPosInvoice({ ids: selectedItems.value.map((i) => i.id) }).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã gửi hóa đơn MTT',
      life: 3000
    });
    selectedItems.value = [];
    filter();
  });
};

const onViewDetail = (row) => {
  itemDetail.value = row;
  showDetailDialog.value = true;
};

onMounted(async () => {
  await getData();
});
</script>
