<template>
  <TableView title="Lịch sử xuất báo cáo" :searchable="false">
    <template #table>
      <FbTable
        :columns="exportHistoryColumns"
        :items="exportHistoryData"
        :stripedRows="false"
        :isLoading="isLoading"
        enableScrollPagination
        :hasMoreData="hasMoreData"
        :currentPage="currentPage"
        :pageSize="pageSize"
        scrollHeight="flex"
        @page-change="loadMore"
      >
        <template #report_type="{ row }">
          {{ getReportTypeName(row.report_type) }}
        </template>
        <template #status="{ row }">
          <Tag
            :severity="getStatusSeverity(row.status)"
            :value="getStatusLabel(row.status)"
            class="!fb-text-xs !fb-font-medium"
          />
        </template>
        <template #actions="{ row }">
          <Button
            v-if="row.status === 'done' && row.s3_url"
            :loading="loadingId === row.id"
            severity="primary"
            text
            v-tooltip.top="'Tải xuống'"
            @click="downloadReport(row)"
          >
            <IconDownload v-if="loadingId !== row.id" color="currentColor" />
            <FbLoading v-else show />
          </Button>
        </template>
        <template #empty>Chưa có lịch sử xuất báo cáo</template>
      </FbTable>
    </template>
  </TableView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import IconDownload from '@/components/Common/Icon/IconDownload.vue';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useGlobalStore } from '@/stores/global.store';

const isLoading = ref(false);
const loadingId = ref(null);
const exportHistoryData = ref([]);
const currentPage = ref(1);
const pageSize = ref(50);
const hasMoreData = ref(true);
const globalStore = useGlobalStore();

const exportHistoryColumns = [
  { field: 'report_type', header: 'Loại báo cáo' },
  { field: 'created_at', header: 'Thời gian xuất', format: 'datetime' },
  { field: 'requested_by', header: 'Người xuất' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'expires_at', header: 'Thời gian hết hạn', format: 'date' },
  { field: 'actions', header: '', width: '80px' },
];

const getReportTypeName = (type) => {
  const types = {
    monthly_invoice_list: 'Bảng kê hóa đơn hàng tháng',
    invoice_details: 'Báo cáo chi tiết bán hàng',
    invoices_grouped_by_items: 'Báo cáo tổng hợp bán hàng',
    invoices: 'Bảng kê chi tiết hóa đơn',
  };
  return types[type] || type;
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'done':
      return 'success';
    case 'pending':
      return 'warn';
    case 'error':
      return 'danger';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'done':
      return 'Thành công';
    case 'pending':
      return 'Đang xử lý';
    case 'error':
      return 'Thất bại';
    default:
      return status;
  }
};

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    const params = {
      company_uid: globalStore?.currentUser?.company_uid,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
    };
    const res = await invoiceService.getExportReportHistory(params);

    if (currentPage.value === 1) {
      exportHistoryData.value = res?.data || [];
    } else {
      exportHistoryData.value = [...exportHistoryData.value, ...(res?.data || [])];
    }

    // Check if we loaded all data
    hasMoreData.value = res?.data?.length === pageSize.value;
  } catch (error) {
    console.error('Fetch export history error:', error);
    exportHistoryData.value = [];
  } finally {
    isLoading.value = false;
  }
};

const loadMore = () => {
  if (isLoading.value || !hasMoreData.value) return;
  currentPage.value++;
  fetchHistory();
};

const downloadReport = async (row) => {
  if (loadingId.value) return;
  loadingId.value = row.id;
  try {
    const res = await invoiceService.getExportReportUrl(row.id);
    const downloadUrl = res?.data?.download_url;
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  } catch (error) {
    console.error('Download report error:', error);
  } finally {
    loadingId.value = null;
  }
};

onMounted(() => {
  fetchHistory();
});
</script>
