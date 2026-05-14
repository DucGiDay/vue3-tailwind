<template>
  <TableView title="Bảng kê chi tiết hóa đơn" v-model:searchValue="searchField" :searchable="false">
    <template #header-actions>
      <Button
        size="small"
        severity="secondary"
        raised
        class="!fb-rounded-lg"
        @click="openExportHistory"
      >
        Lịch sử xuất báo cáo
      </Button>
      <Button
        :loading="isLoadingExport"
        size="small"
        outlined
        class="!fb-rounded-lg"
        @click="exportExcel"
      >
        <IconDownload v-if="!isLoadingExport" color="currentColor" />
        <FbLoading v-else show />
        Xuất excel
      </Button>
    </template>

    <template #filters>
      <!-- Filter by Date -->
      <FbDateFilter @update:modelValue="filter" size="small" />

      <!-- Lọc Store -->
      <FbSelectTaxStoreFilter isSingleGroup @update:modelValue="filter" />
    </template>

    <template #table>
      <FbTable
        :columns="DETAIL_INVOICE_LIST_COLUMNS"
        :items="dataList"
        enableScrollPagination
        reorderableColumns
        :hasMoreData="hasMoreData"
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        scrollHeight="flex"
        @page-change="loadMore"
      >
        <template #revenue="{ row }">
          {{ (row?.quantity || 0) * (row?.unit_price || 0) }}
        </template>
        <template #empty>Chưa có dữ liệu</template>
      </FbTable>
    </template>

    <template #extra>
      <!-- Export History Dialog -->
      <Dialog
        v-model:visible="showExportHistory"
        header="Lịch sử xuất báo cáo"
        modal
        :style="{ width: '60vw' }"
        :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
      >
        <FbTable :columns="exportHistoryColumns" :items="exportHistoryData" :stripedRows="false">
          <template #empty>Chưa có lịch sử xuất báo cáo</template>
        </FbTable>
      </Dialog>
    </template>
  </TableView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moment from 'moment';
import { useToast } from 'primevue/usetoast';
import { saveAs } from 'file-saver';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { DETAIL_INVOICE_LIST_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import IconDownload from '@/components/Common/Icon/IconDownload.vue';
import FbLoading from '@/components/Common/FbLoading.vue';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';

const filterStore = useFilterStore();
const globalStore = useGlobalStore();
const toast = useToast();

// State for filters
const searchField = ref('');

const statisticTypeField = ref(null);
const creatorField = ref(null);
const patternField = ref(null);
const serialField = ref(null);
const statusField = ref(null);

const statisticTypeOptions = ref([]); // Will be populated from API/Constants
const creatorOptions = ref([]);
const patternOptions = ref([]);
const serialOptions = ref([]);
const statusOptions = ref([]);

// State for Table
const dataList = ref([]);
const isLoading = ref(false);
const isLoadingExport = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);
const hasMoreData = ref(true);

// State for Export History
const showExportHistory = ref(false);
const exportHistoryColumns = [
  { field: 'time', header: 'Thời gian' },
  { field: 'user', header: 'Người xuất' },
  { field: 'status', header: 'Trạng thái' },
];
const exportHistoryData = ref([]);

// Methods
const getPayload = () => {
  return {
    company_uid: globalStore?.currentUser?.company_uid,
    report_type: 'invoices',
    start_date: filterStore.report.start_date,
    end_date: filterStore.report.end_date,
    list_store_uid: filterStore.report.stores_uid?.length
      ? filterStore.report.stores_uid.join(',')
      : (globalStore?.storesIdPermissionActive || []).join(','),
  };
};

const getData = async () => {
  const payload = getPayload();
  if (!payload.start_date || !payload.end_date) return;

  isLoading.value = true;
  try {
    const res = await invoiceService.previewReport({
      ...payload,
      page: currentPage.value,
      result_per_page: pageSize.value,
    });

    const fetchedData = res?.data || [];

    if (currentPage.value === 1) {
      dataList.value = fetchedData;
    } else {
      dataList.value = [...dataList.value, ...fetchedData];
    }

    // Check if we loaded all data
    hasMoreData.value = pageSize.value === fetchedData.length;
  } catch (error) {
    console.error('Error fetching data:', error);
    if (currentPage.value === 1) dataList.value = [];
    hasMoreData.value = false;
  } finally {
    isLoading.value = false;
  }
};

const loadMore = () => {
  if (isLoading.value || !hasMoreData.value) return;
  currentPage.value++;
  getData();
};

const filter = async () => {
  currentPage.value = 1;
  await getData();
};

let searchTimeout = null;
const onSearchChange = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filter();
  }, 500);
};

const openExportHistory = () => {
  showExportHistory.value = true;
  // TODO: Fetch export history data from API
};

const exportExcel = async () => {
  try {
    isLoadingExport.value = true;
    const payload = getPayload();
    const res = await invoiceService.exportReportInvoice(payload);
    const fileName = `BC_TONGHOP_BANHANG_${moment().format('YYYYMMDD_HHmm')}.xlsx`;
    saveAs(res, fileName);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đang tải tệp báo cáo',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Không thể xuất báo cáo',
      life: 5000,
    });
  } finally {
    isLoadingExport.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>

<style scoped></style>
