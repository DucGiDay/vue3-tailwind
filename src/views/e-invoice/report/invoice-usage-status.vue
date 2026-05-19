<template>
  <TableView
    title="Tình hình sử dụng hóa đơn"
    :searchable="false"
  >
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

    <template #extra></template>
  </TableView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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
const router = useRouter();


// State for Table
const dataList = ref([]);
const isLoading = ref(false);
const isLoadingExport = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);
const hasMoreData = ref(true);

// Methods
const getPayload = () => {
  return {
    company_uid: globalStore?.currentUser?.company_uid,
    report_type: 'invoices',
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
    list_store_uid: Object.values(filterStore.invoice.store_uid_by_tax_code || {}).flat().join(','),
    tax_code: Object.keys(filterStore.invoice.store_uid_by_tax_code || {}).join(','),
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

const openExportHistory = () => {
  router.push('/e-invoice/report/export-invoice-history');
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
