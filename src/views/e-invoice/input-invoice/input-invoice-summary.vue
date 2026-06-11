<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-6']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h5 class="!fb-m-0 !fb-text-lg !fb-font-semibold">Bảng kê hóa đơn đầu vào</h5>
    </div>
  </div>

  <div class="fb-mb-4 fb-flex fb-items-center fb-space-x-4 fb-flex-wrap gap-4">
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
  </div>

  <div class="!fb-p-0 summary-table-container">
    <div v-if="isLoading" class="fb-flex fb-justify-center fb-py-8">Đang tải dữ liệu...</div>
    <div v-else-if="!items || items.length === 0" class="fb-text-center fb-py-8 fb-text-gray-500">
      {{ inputInvoiceSummary?.error ? 'Error: ' + inputInvoiceSummary?.error : 'Chưa có bảng kê' }}
    </div>
    <div v-else class="summary-table-wrapper">
      <table class="summary-table">
        <template v-for="(group, index) in items" :key="index">
          <!-- Tax Rate Row -->
          <tr class="tax-rate-row">
            <td colspan="10">
              <span class="tax-rate-label">Mức thuế suất: {{ group.tax_rate }}</span>
            </td>
          </tr>

          <!-- Header Row -->
          <tr class="header-row">
            <th class="fb-text-center"><span>STT</span></th>
            <th class="fb-text-center"><span>Ký hiệu hóa đơn</span></th>
            <th class="fb-text-center"><span>Mẫu số</span></th>
            <th class="fb-text-center"><span>Số hóa đơn</span></th>
            <th class="fb-text-center"><span>Thời gian lập</span></th>
            <th class="fb-text-left"><span>Đơn vị bán</span></th>
            <th class="fb-text-center"><span>Mã số thuế bên bán</span></th>
            <th class="fb-text-right"><span>Tiền trước thuế</span></th>
            <th class="fb-text-right"><span>Tiền thuế</span></th>
            <th class="fb-text-left"><span>Ghi chú</span></th>
          </tr>

          <!-- Invoice Rows -->
          <tr v-for="invoice in group.invoices" :key="invoice.stt" class="invoice-row">
            <td class="fb-text-center">{{ invoice.stt }}</td>
            <td class="fb-text-center">{{ invoice.serial }}</td>
            <td class="fb-text-center">{{ invoice.pattern }}</td>
            <td class="fb-text-center">{{ invoice.no }}</td>
            <td class="fb-text-center">{{ formatDate(invoice.invoice_date) }}</td>
            <td>{{ invoice.seller_name }}</td>
            <td class="fb-text-center">{{ invoice.seller_tax_code }}</td>
            <td class="fb-text-right">{{ formatCurrency(invoice.amount_before_tax) }}</td>
            <td class="fb-text-right">{{ formatCurrency(invoice.tax_amount) }}</td>
            <td>{{ invoice.note || '' }}</td>
          </tr>

          <!-- Total Row for the tax rate -->
          <tr class="total-row">
            <td colspan="7" class="fb-text-center fb-font-bold">Tổng</td>
            <td class="fb-text-right fb-font-bold">{{ formatCurrency(group.total_before_tax) }}</td>
            <td class="fb-text-right fb-font-bold">{{ formatCurrency(group.total_tax) }}</td>
            <td></td>
          </tr>
        </template>
      </table>

      <Paginator
        v-if="inputInvoiceSummary.data?.total > 0"
        :rows="pageSize"
        :totalRecords="inputInvoiceSummary.data?.total || 0"
        :first="(currentPage - 1) * pageSize"
        @page="onPageChange"
        class="fb-mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import { formatDate, formatCurrency } from '@/common/utils/common';
import Paginator from 'primevue/paginator';

// Store/Getter
const invoiceStore = useEInoiveStore();
const filterStore = useFilterStore();
const globalStore = useGlobalStore();

// State
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

const inputInvoiceSummary = computed(() => invoiceStore.inputInvoiceSummary);
const items = ref([]);
const isLoading = ref(false);

// Methods
const onPageChange = (event) => {
  getData({ page: event.page + 1, rows: event.rows });
};

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

  if (filterStatus.value) payload.tax_declared = filterStatus.value;
  if (filterPattern.value) payload.pattern = filterPattern.value;
  if (filterSerial.value) payload.serial = filterSerial.value;
  if (filterNo.value) payload.no = filterNo.value;

  isLoading.value = true;
  await invoiceStore.getInputInvoiceSummary(payload);
  items.value = inputInvoiceSummary.value?.data?.data || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  items.value = [];
  await getData();
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.summary-table-container {
  width: 100%;
  background: #fff;
  border-radius: 6px;
  // overflow: hidden;
}

.summary-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
  font-size: 13px;

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    vertical-align: middle;
    color: #374151;
  }

  .tax-rate-row {
    background-color: #f3f6f9;

    td {
      border: 1px solid #e5e7eb;
      border-bottom: none;
      padding: 12px;
    }

    .tax-rate-label {
      padding: 4px 8px;
      font-weight: 600;
      border-radius: 2px;
      display: inline-block;
    }
  }

  .header-row {
    background-color: #f3f6f9;

    th {
      border: 1px solid #e5e7eb;
      padding: 8px 12px;

      span {
        padding: 4px 8px;
        font-weight: 600;
        display: inline-block;
        border-radius: 2px;
      }
    }
  }

  .invoice-row {
    background-color: #fff;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9fafb;
    }
  }

  .total-row {
    background-color: #f3f6f9;

    td {
      font-weight: 600;
      color: #111827;
    }
  }
}
</style>
