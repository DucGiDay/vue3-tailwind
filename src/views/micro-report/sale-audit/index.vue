<template>
  <div class="fb-p-4 fb-bg-gray-100 fb-min-h-screen">
    <!-- Header -->
    <div class="fb-mb-4 fb-mt-4">
      <h1 class="fb-text-2xl fb-font-bold">Báo cáo bán hàng</h1>
    </div>

    <!-- Filters and Actions -->
    <div class="fb-flex fb-justify-between fb-items-center fb-mb-4 fb-bg-white fb-p-3 fb-rounded-lg fb-shadow">
      <div class="fb-flex fb-items-center fb-space-x-3">
        <!-- Placeholder for report-date-range-picker -->
        <div class="fb-flex fb-items-center fb-space-x-2">
          <DatePicker v-model="dates" selectionMode="range" :manualInput="false" />
        </div>
        <!-- Placeholder for select-cities-stores-filter -->
        <select v-model="listStore" multiple class="fb-border fb-rounded fb-px-2 fb-py-1 fb-h-10">
          <option value="store1">Store 1</option>
          <option value="store2">Store 2</option>
        </select>
        <Button @click="filter" raised>Lọc</Button>
      </div>

      <!-- Placeholder for export-button-many-choice -->
      <div class="fb-flex fb-items-center fb-space-x-2">
        <Button @click="exportReport('FILTER')" variant="outlined">Xuất báo cáo</Button>
        <div v-if="isExportingReport" class="fb-flex fb-items-center fb-space-x-1">
          <div class="fb-w-6 fb-h-6 fb-border-4 fb-border-blue-500 fb-border-t-transparent fb-rounded-full fb-animate-spin"></div>
          <span>{{ percentageOfExportedData }}%</span>
        </div>
      </div>
    </div>

    <!-- Guide Text -->
    <div class="fb-mb-4">
      <p class="fb-text-gray-500 fb-ml-3">
        Thời gian lấy báo cáo từ
        {{ dates ? formatDate(dates[0]) : '' }} đến
        {{ dates ? formatDate(dates[1]) : '' }}
      </p>
    </div>

    <!-- Table -->
    <DataTable
      :value="items"
      :reorderableColumns="true"
      resizableColumns
      columnResizeMode="expand"
      stripedRows
      showGridlines
      :loading="loading"
      @columnReorder="onColReorder"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div style="text-align: left">
          <MultiSelect
            :modelValue="selectedColumns"
            :options="columns"
            optionLabel="header"
            @update:modelValue="onToggle"
            display="chip"
            placeholder="Select Columns"
          />
        </div>
      </template>
      <Column field="no" header="#" :reorderableColumn="false">
        <template #body="{ index }">
          {{ `${index + 1}` }}
        </template></Column
      >
      <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index">
        <template #body="{ data }">
          <Skeleton v-if="loading" />
          <span v-else>{{ data[col.field] }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';

// --- Reactive State ---
const dates = reactive([new Date(), new Date()]);
const columns = ref([
  { field: 'item_id', header: 'Mã hàng' },
  { field: 'item_name', header: 'Tên hàng' },
  { field: 'item_type_name', header: 'Nhóm món' },
  { field: 'item_class_name', header: 'Loại món' },
  { field: 'voucher_code', header: 'Mã combo' },
  { field: 'payment_method_name', header: 'PTTT' },
  { field: 'source_name', header: 'Nguồn' },
  { field: 'area_name', header: 'Khu vực' },
  { field: 'table_name', header: 'Bàn' },
  { field: 'tran_id', header: 'Mã hóa đơn' },
  { field: 'tran_no', header: 'Số hóa đơn' },
  { field: 'tran_date', header: 'Thời gian' },
  { field: 'quantity', header: 'Số lượng' },
  { field: 'unit_id', header: 'Đơn vị' },
  { field: 'ots_price', header: 'Giá gốc' },
  { field: 'price', header: 'Giá bán' },
  { field: 'amount', header: 'Thành tiền' },
  { field: 'discount_amount', header: 'Giảm giá' },
  { field: 'discount_extra_amount', header: 'Giảm giá KM' },
  { field: 'partner_marketing_amount', header: 'Giảm giá Đối tác' },
  { field: 'voucher_amount', header: 'Giảm giá Voucher' },
  { field: 'service_charge_amount', header: 'Phí DV' },
  { field: 'vat_tax_rate', header: 'Thuế suất VAT (%)' },
  { field: 'vat_amount', header: 'Tiền VAT' },
  { field: 'deduct_tax_amount', header: 'Tiền thuế TNCN' },
  { field: 'discount_vat_amount', header: 'Tiền giảm giá VAT' },
  { field: 'ship_fee_amount', header: 'Phí vận chuyển' },
  { field: 'vat_tax_reverse_amount', header: 'Tiền VAT ngược' },
  { field: 'commission_amount', header: 'Hoa hồng' },
  { field: 'total_amount', header: 'Tổng cộng' },
  { field: 'promotion_name', header: 'Chương trình KM' },
  { field: 'customer_name', header: 'Tên KH' },
  { field: 'peo_count', header: 'Số người' },
  { field: 'customer_phone', header: 'SĐT KH' }
]);
const selectedColumns = ref(columns.value);

const listStore = ref([]);
const items = ref([]);
const loading = ref(false);
const isExportingReport = ref(false);
const percentageOfExportedData = ref(0);

onMounted(() => {
  fetchData();
});

// --- Utility Functions (replacing Vue 2 filters) ---
const onToggle = (val) => {
  selectedColumns.value = columns.value.filter((col) => val.includes(col));
};

const onColReorder = () => {
  toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 });
};
const formatCurrency = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  // return date.toLocaleDateString("vi-VN");
  return moment(date).format('DD/MM/YYYY HH:mm');
};

const truncateString = (str = '', length = 8) => {
  if (typeof str !== 'string' || str.length <= length) return str;
  return str.substring(0, length) + '...';
};

const converVatToNumber = (vatRate) => {
  if (typeof vatRate !== 'number') return 0;
  return vatRate * 100;
};

const getPromotionName = (item) => {
  // Mock implementation
  if (item.promotion_name) return item.promotion_name;
  return '';
};

// --- Mock Data Fetching ---
const fetchData = async () => {
  items.value = Array.from({ length: 5 }).map((_, i) => ({
    id: i.toString()
  }));
  loading.value = true;

  console.log('Fetching data with filters:', {
    dates: dates,
    stores: listStore.value
  });

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock data - replace with actual API call
  const mockData = [
    {
      id: '1',
      item_id: 'ITM001',
      item_name: 'Cà phê sữa',
      item_type_name: 'Đồ uống',
      item_class_name: 'Cà phê',
      package_id: '',
      payment_method_name: 'Tiền mặt',
      source_name: 'Tại quán',
      area_name: 'Tầng 1',
      table_name: 'Bàn 1',
      tran_id: 'TRANS_1234567890',
      tran_no: 'TN001',
      tran_date: '2025-12-30T10:00:00Z',
      quantity: 2,
      unit_id: 'Ly',
      ots_price: 25000,
      price: 25000,
      amount: 50000,
      discount_amount: 5000,
      discount_extra_amount: 0,
      partner_marketing_amount: 0,
      voucher_amount: 0,
      service_charge_amount: 2500,
      vat_tax_rate: 0.1,
      vat_amount: 4750,
      deduct_tax_amount: 0,
      discount_vat_amount: 0,
      ship_fee_amount: 0,
      vat_tax_reverse_amount: 0,
      commission_amount: 0,
      total_amount: 52250,
      promotion_name: 'Giảm giá 10%',
      voucher_code: 'ABCDE',
      customer_name: 'Nguyễn Văn A',
      peo_count: 2,
      customer_phone: '090xxxxxxx'
    },
    {
      id: '2',
      item_id: 'ITM002',
      item_name: 'Bánh mì',
      item_type_name: 'Đồ ăn',
      item_class_name: 'Bánh',
      package_id: '',
      payment_method_name: 'Thẻ',
      source_name: 'Mang về',
      area_name: '',
      table_name: '',
      tran_id: 'TRANS_1234567891',
      tran_no: 'TN002',
      tran_date: '2025-12-30T10:05:00Z',
      quantity: 1,
      unit_id: 'Cái',
      ots_price: 20000,
      price: 20000,
      amount: 20000,
      discount_amount: 0,
      discount_extra_amount: 0,
      partner_marketing_amount: 0,
      voucher_amount: 0,
      service_charge_amount: 0,
      vat_tax_rate: 0.08,
      vat_amount: 1600,
      deduct_tax_amount: 0,
      discount_vat_amount: 0,
      ship_fee_amount: 0,
      vat_tax_reverse_amount: 0,
      commission_amount: 0,
      total_amount: 21600,
      promotion_name: '',
      voucher_code: '',
      customer_name: 'Trần Thị B',
      peo_count: 1,
      customer_phone: '091xxxxxxx'
    }
  ];

  const sumRow = {
    id: 'SUM',
    item_id: 'SUM',
    item_name: 'Tổng cộng',
    quantity: mockData.reduce((sum, item) => sum + item.quantity, 0),
    amount: mockData.reduce((sum, item) => sum + item.amount, 0),
    discount_amount: mockData.reduce((sum, item) => sum + item.discount_amount, 0),
    discount_extra_amount: mockData.reduce((sum, item) => sum + item.discount_extra_amount, 0),
    service_charge_amount: mockData.reduce((sum, item) => sum + item.service_charge_amount, 0),
    vat_tax_reverse_amount: mockData.reduce((sum, item) => sum + item.vat_tax_reverse_amount, 0),
    vat_amount: mockData.reduce((sum, item) => sum + item.vat_amount, 0),
    discount_vat_amount: mockData.reduce((sum, item) => sum + item.discount_vat_amount, 0),
    deduct_tax_amount: mockData.reduce((sum, item) => sum + item.deduct_tax_amount, 0),
    voucher_amount: mockData.reduce((sum, item) => sum + item.voucher_amount, 0),
    ship_fee_amount: mockData.reduce((sum, item) => sum + item.ship_fee_amount, 0),
    commission_amount: mockData.reduce((sum, item) => sum + item.commission_amount, 0),
    partner_marketing_amount: mockData.reduce((sum, item) => sum + item.partner_marketing_amount, 0),
    peo_count: mockData.reduce((sum, item) => sum + item.peo_count, 0),
    total_amount: mockData.reduce((sum, item) => sum + item.total_amount, 0)
  };

  items.value = [...mockData, sumRow];
  loading.value = false;
};

const filter = () => {
  fetchData();
};

const exportReport = async (exportType) => {
  isExportingReport.value = true;
  percentageOfExportedData.value = 0;
  console.log(`Exporting report for: ${exportType}`);

  // Simulate export progress
  const progressInterval = setInterval(() => {
    if (percentageOfExportedData.value < 100) {
      percentageOfExportedData.value += 10;
    } else {
      clearInterval(progressInterval);
      isExportingReport.value = false;
      alert('Xuất báo cáo thành công!');
    }
  }, 200);
};

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Scoped styles for sticky columns background */
.fb-sticky {
  position: -webkit-sticky;
  position: sticky;
}
.fb-left-0 {
  left: 0;
}
.fb-left-\[50px\] {
  left: 50px;
}
.fb-left-\[183px\] {
  left: 183px;
}
.fb-right-0 {
  right: 0;
}

/* Ensure sticky headers have a higher z-index than body cells */
thead th {
  z-index: 20;
}
/* Ensure sticky body cells have a z-index to be above non-sticky cells */
tbody td.fb-sticky {
  z-index: 10;
}

/* Add a border to separate sticky columns */
td.fb-sticky:not(:last-child):not(.fb-right-0) {
  border-right: 1px solid #e5e7eb;
}
th.fb-sticky:not(:last-child):not(.fb-right-0) {
  border-right: 1px solid #e5e7eb;
}

td.fb-sticky.fb-right-0 {
  border-left: 1px solid #e5e7eb;
}
th.fb-sticky.fb-right-0 {
  border-left: 1px solid #e5e7eb;
}
</style>
