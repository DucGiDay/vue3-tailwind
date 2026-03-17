<script setup>
// State
let dates = reactive([new Date(), new Date()]);
const selectButtonValue = ref({ name: 'Option 1' });
const selectButtonValues = ref([{ name: 'Option 1' }, { name: 'Option 2' }]);
const searchField = ref(null);
const statusField = ref(null);
const statusOptions = ref([{ name: 'Tất cả trạng thái', code: null }]);

const columns = [
  { field: 'tran_info', header: 'Thông tin hóa đơn' },
  { field: 'tran_id', header: 'Số hóa đơn', classes: 'fb-text-muted-color' },
  { field: 'customer_type', header: 'Người mua', classes: 'fb-text-muted-color' },
  { field: 'customer', header: 'Thông tin khách hàng' },
  { field: 'tran_date', header: 'Ngày hóa đơn', classes: 'fb-text-muted-color', format: 'date' },
  { field: 'amount', header: 'Tổng tiền', format: 'currency' },
  { field: 'type', header: 'Loại hóa đơn', classes: 'fb-text-muted-color' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'action', header: '' }
];
const saleSelecteds = ref([]);
const sales = ref([
  {
    search_code: 'SC-001',
    tran_info: 'HD-2024-001',
    tran_id: 'INV001',
    tran_id_origin: '2C26MAA0000040',
    customer_type: 'Cá nhân',
    customer: { customer_name: 'Nguyễn Văn A', tax_code: '' },
    tran_date: '2024-01-15',
    amount: 1500000,
    type: 'Thay thế',
    status: 1
  },
  {
    search_code: 'SC-002',
    tran_info: 'HD-2024-002',
    tran_id: 'INV002',
    customer_type: 'Doanh nghiệp',
    customer: { customer_name: 'Công ty TNHH ABC', tax_code: '0123456789' },
    tran_date: '2024-01-16',
    amount: 8750000,
    type: 'Hóa đơn GTGT',
    status: 2
  },
  {
    search_code: 'SC-003',
    tran_info: 'HD-2024-003',
    tran_id: 'INV003',
    customer_type: 'Cá nhân',
    customer: { customer_name: 'Trần Thị B', tax_code: '' },
    tran_date: '2024-01-17',
    amount: 320000,
    type: 'Hóa đơn bán lẻ',
    status: 3
  },
  {
    search_code: 'SC-004',
    tran_info: 'HD-2024-004',
    tran_id: 'INV004',
    customer_type: 'Doanh nghiệp',
    customer: { customer_name: 'Công ty CP XYZ', tax_code: '9876543210' },
    tran_date: '2024-01-18',
    amount: 24600000,
    type: 'Hóa đơn GTGT',
    status: 1
  },
  {
    search_code: 'SC-005',
    tran_info: 'HD-2024-005',
    tran_id: 'INV005',
    customer_type: 'Cá nhân',
    customer: { customer_name: 'Lê Văn C', tax_code: '' },
    tran_date: '2024-01-19',
    amount: 670000,
    type: 'Hóa đơn bán lẻ',
    status: 2
  }
]);
</script>

<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-8']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Hóa đơn bán hàng</h4>
    </div>
  </div>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-4']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <Select
        v-model="statusField"
        :options="statusOptions"
        optionLabel="name"
        placeholder="Chọn trạng thái"
        class="fb-w-full md:fb-w-48"
        size="small"
      />
      <DatePicker v-model="dates" selectionMode="range" :manualInput="false" size="small" />
    </div>
    <div>
      <IconField>
        <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="fb-h-[16px]"
          >
            <path
              d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
              stroke="#A4A7AE"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </InputIcon>
        <InputText
          v-model="searchField"
          placeholder="Tìm kiếm mã hóa đơn hoặc tên khách hàng"
          size="small"
          class="fb-w-full md:fb-w-80"
        />
      </IconField>
    </div>
  </div>

  <div>
    <FbTable
      v-model:selection="saleSelecteds"
      :columns="columns"
      :value="sales"
      enableCheckbox
      :stripedRows="false"
    >
      <template #tran_info="{ row }">
        <div class="fb-text-sm">{{ `Ký hiệu: ${row.tran_info}` }}</div>
        <div class="fb-text-sm fb-text-muted-color">
          Mã tra cứu:
          <span class="fb-text-primary">{{ row.search_code }}</span>
        </div>
      </template>

      <template #customer="{ record }">
        <div>{{ `Tên: ${record.customer_name}` }}</div>
        <div class="fb-text-muted-color">{{ `Mã/MST: ${record.tax_code}` }}</div>
      </template>
      <template #type="{ record, row }">
        <div>{{ record }}</div>
        <div v-if="row?.tran_id_origin" class="fb-text-primary">({{ row.tran_id_origin }})</div>
      </template>
    </FbTable>
  </div>
</template>
