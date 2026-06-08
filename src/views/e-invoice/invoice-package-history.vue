<script setup>
import { computed, onMounted } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import TableView from '@/components/SharedComponent/views/TableView.vue';

const invoiceStore = useEInoiveStore();

const INVOICE_PACKAGE_HISTORY_COLUMNS = [
  { field: 'package_name', header: 'Mã hóa đơn' },
  { field: 'package_type', header: 'Loại gói' },
  { field: 'total_invoices', header: 'Tổng số HĐ' },
  { field: 'used_invoices', header: 'Đã dùng' },
  { field: 'remaining_invoices', header: 'Còn lại' },
  { field: 'expires_at', header: 'Ngày hết hạn' },
];

const invoicePackagesHistory = computed(() => invoiceStore.invoicePackagesHistory);
const tableData = computed(() => invoicePackagesHistory.value?.data?.packages || []);
const isLoading = computed(() => invoicePackagesHistory.value?.isLoading);
const hasError = computed(() => !!invoicePackagesHistory.value?.error);

const packageTypeLabel = (type) => {
  const map = {
    trial: 'Dùng thử',
    standard: 'Tiêu chuẩn',
    premium: 'Cao cấp',
    enterprise: 'Doanh nghiệp',
  };
  return map[type] || type || '—';
};

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const isExpired = (val) => {
  if (!val) return false;
  return new Date(val) < new Date();
};

onMounted(async () => {
  const taxCode = invoiceStore.currentTaxCode;
  if (taxCode) {
    await invoiceStore.getInvoicePackagesHistory({ tax_code: taxCode });
  }
});
</script>

<template>
  <TableView title="Lịch sử gói hóa đơn điện tử" :searchable="false">
    <!-- Table card -->
    <template #table>
      <FbTable
        :columns="INVOICE_PACKAGE_HISTORY_COLUMNS"
        :items="tableData"
        :isLoading="isLoading"
        :stripedRows="true"
        :enableScrollPagination="false"
        :hasMoreData="false"
        scrollHeight="flex"
      >
        <template #empty>
          <div
            v-if="hasError"
            class="fb-flex fb-flex-col fb-items-center fb-justify-center fb-py-16 fb-gap-3 fb-text-error-500"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="#FEE4E2" />
              <path
                d="M20 13V21M20 27H20.01"
                stroke="#F04438"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="fb-font-medium">
              {{ invoicePackagesHistory?.error || 'Không thể tải dữ liệu. Vui lòng thử lại.' }}
            </span>
          </div>
          <div
            v-else
            class="fb-flex fb-flex-col fb-items-center fb-justify-center fb-py-16 fb-gap-3 fb-text-muted-color"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="24" fill="#F2F4F7" />
              <path
                d="M24 16v8m0 4h.01M32 24c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
                stroke="#98A2B3"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="fb-font-medium">Chưa có dữ liệu lịch sử gói</span>
          </div>
        </template>

        <template #package_name="{ record }">
          <span class="fb-text-color">
            {{ record.split('_')[0].toUpperCase() || '' }}
          </span>
        </template>

        <template #package_type="{ record }">
          <span class="fb-text-color">
            {{ packageTypeLabel(record).toUpperCase() }}
          </span>
        </template>

        <template #total_invoices="{ record }">
          <span class="fb-text-color">
            {{ record != null ? record.toLocaleString('vi-VN') : '' }}
          </span>
        </template>

        <template #used_invoices="{ record }">
          <span class="fb-text-color">
            {{ record != null ? record.toLocaleString('vi-VN') : '' }}
          </span>
        </template>

        <template #remaining_invoices="{ record }">
          <span :class="record > 0 ? 'fb-text-success-600' : 'fb-text-error-500'">
            {{ record != null ? record.toLocaleString('vi-VN') : '' }}
          </span>
        </template>

        <template #expires_at="{ record }">
          <span
            class="fb-text-sm"
            :class="isExpired(record) ? 'fb-text-error-500 fb-font-medium' : 'fb-text-color'"
          >
            {{ formatDate(record) }}
          </span>
          <!-- <span
            v-if="isExpired(record)"
            class="fb-ml-1.5 fb-text-xs fb-text-error-500 fb-bg-error-50 fb-px-1.5 fb-py-0.5 fb-rounded"
          >
            Hết hạn
          </span> -->
        </template>

        <template #footer>
          <div class="fb-py-3 fb-flex fb-items-center fb-gap-6 fb-text-sm fb-text-muted-color">
            <span>
              Tổng:
              <strong class="fb-text-color">{{ tableData.length }}</strong>
              gói
            </span>
          </div>
        </template>
      </FbTable>
    </template>
  </TableView>
</template>
