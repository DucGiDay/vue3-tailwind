<template>
  <div class="fb-p-4 fb-bg-gray-100 fb-min-h-screen">
    <!-- Header -->
    <div class="fb-mb-4 fb-mt-4">
      <!-- <h1 class="fb-text-2xl fb-font-bold">Báo cáo bán hàng</h1> -->
    </div>

    <!-- Filters and Actions -->
    <div
      class="fb-flex fb-justify-between fb-items-center fb-mb-4 fb-bg-white fb-p-3 fb-rounded-lg fb-shadow"
    >
      <div class="fb-flex fb-items-center fb-space-x-3">
        <DatePicker v-model="dates" selectionMode="range" :manualInput="false" />
        <FbSelectCityStore
          :placeholder="$t('SELECT_CITIES_STORES_FILTER--INPUT_PLACEHOLDER_BLUR')"
        />
      </div>

      <!-- Placeholder for export-button-many-choice -->
      <div class="fb-flex fb-items-center fb-space-x-2">
        <Button @click="exportReport('FILTER')" variant="outlined">Xuất báo cáo</Button>
        <div v-if="isExportingReport" class="fb-flex fb-items-center fb-space-x-1">
          <div
            class="fb-w-6 fb-h-6 fb-border-4 fb-border-blue-500 fb-border-t-transparent fb-rounded-full fb-animate-spin"
          ></div>
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
            filter
            optionLabel="header"
            @update:modelValue="onToggle"
            display="chip"
            placeholder="Chọn cột hiển thị"
            class="fb-w-full md:fb-w-80"
          />
        </div>
      </template>
      <Column field="no" header="#" :reorderableColumn="false" headerClass="!fb-bg-gray-50">
        <template #body="{ index }">
          {{ `${index + 1}` }}
        </template>
      </Column>
      <Column
        v-for="(col, index) of selectedColumns"
        :field="col.field"
        :header="col.header"
        :key="col.field + '_' + index"
        headerClass="!fb-bg-gray-50"
      >
        <template #body="{ data }">
          <Skeleton v-if="loading" />
          <span v-else>{{ data[col.field] }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import moment from 'moment';

// State
let dates = reactive([new Date(), new Date()]);
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
const items = ref([]);
const loading = ref(false);
const isExportingReport = ref(false);
const percentageOfExportedData = ref(0);

// mapFilter
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

const filter = () => {};

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
