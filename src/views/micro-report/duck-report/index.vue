<template>
  <div class="fb-p-4 fb-bg-white fb-min-h-screen">
    <!-- Header -->
    <div class="fb-mb-4 fb-mt-4">
      <h1 class="fb-text-2xl fb-font-bold">Đối soát doanh thu bán hàng</h1>
    </div>

    <!-- Filters and Actions -->
    <div
      class="fb-flex fb-justify-between fb-items-center fb-mb-4 fb-bg-white fb-p-3 fb-rounded-lg fb-shadow-button"
    >
      <div class="fb-flex fb-items-center fb-space-x-3">
        <!-- Placeholder for report-date-range-picker -->
        <div class="fb-flex fb-items-center fb-space-x-2">
          <input
            type="date"
            v-model="dateRange.startDate"
            class="fb-border fb-rounded fb-px-2 fb-py-1"
          />
          <span>-</span>
          <input
            type="date"
            v-model="dateRange.endDate"
            class="fb-border fb-rounded fb-px-2 fb-py-1"
          />
        </div>
        <!-- Placeholder for select-cities-stores-filter -->
        <select v-model="listStore" multiple class="fb-border fb-rounded fb-px-2 fb-py-1 fb-h-10">
          <option value="store1">Store 1</option>
          <option value="store2">Store 2</option>
        </select>
        <button
          @click="filter"
          class="fb-px-4 fb-py-2 fb-bg-blue-500 fb-text-white fb-rounded hover:fb-bg-blue-600"
        >
          Lọc
        </button>
      </div>

      <!-- Placeholder for export-button-many-choice -->
      <div class="fb-flex fb-items-center fb-space-x-2">
        <button
          @click="exportReport('FILTER')"
          class="fb-px-4 fb-py-2 fb-bg-green-500 fb-text-white fb-rounded hover:fb-bg-green-600"
        >
          Xuất báo cáo
        </button>
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
        Thời gian lấy báo cáo từ {{ formatDate(dateRange.startDate) }} đến
        {{ formatDate(dateRange.endDate) }}
      </p>
    </div>

    <!-- Table -->
    <div class="fb-overflow-x-auto fb-bg-white fb-rounded-lg fb-shadow">
      <table class="fb-min-w-full fb-divide-y fb-divide-gray-200">
        <thead class="fb-bg-gray-50">
          <tr>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray fb-uppercase fb-tracking-wider fb-sticky fb-left-0 fb-bg-gray-50 fb-z-10"
              style="min-width: 50px"
            >
              #
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider fb-sticky fb-left-[50px] fb-bg-gray-50 fb-z-10"
            >
              Mã hàng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider fb-sticky fb-left-[183px] fb-bg-gray-50 fb-z-10"
            >
              Tên hàng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Loại mặt hàng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Ngành hàng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Mã combo
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              HTTT
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Nguồn
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Khu vực
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Bàn
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Mã giao dịch
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Số giao dịch
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-left fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Ngày giao dịch
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Số lượng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Đơn vị
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
              title="Giá gốc"
            >
              Giá bán
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Giá
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Thành tiền
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
              title="Giảm giá trên món"
            >
              Giảm giá
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
              title="Giảm giá trên hoá đơn"
            >
              Giảm giá C.Trình
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
              title="Đối tác trả phần KM trên giá trị sản phẩm"
            >
              Phí Marketing
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Voucher
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Phí dịch vụ
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              VAT %
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Thuế
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Tỷ lệ thuế
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Giảm trừ thuế
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Phí giao hàng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Doanh thu chưa VAT
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Phí hoa hồng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Doanh thu có phí HH
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Tên khuyến mãi
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Mã voucher
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Tên khách hàng
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              Số khách
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider"
            >
              SĐT
            </th>
            <th
              class="fb-px-6 fb-py-3 fb-text-right fb-text-xs fb-font-medium fb-text-gray-500 fb-uppercase fb-tracking-wider fb-sticky fb-right-0 fb-bg-gray-50 fb-z-10"
            >
              Tổng cộng
            </th>
          </tr>
        </thead>
        <tbody class="fb-bg-white fb-divide-y fb-divide-gray-200">
          <tr v-if="loading" class="fb-text-center">
            <td colspan="38" class="fb-py-4">Đang tải dữ liệu...</td>
          </tr>
          <tr v-for="(item, index) in items" :key="item.id" class="hover:fb-bg-gray-50">
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-sticky fb-left-0 fb-bg-white"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ item.item_id !== 'SUM' ? index + 1 : '' }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-sticky fb-left-[50px] fb-bg-white"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ item.item_id !== 'SUM' ? item.item_id : '' }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-sticky fb-left-[183px] fb-bg-white"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ item.item_name }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.item_type_name }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.item_class_name }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.package_id }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.payment_method_name }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.source_name }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.area_name }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.table_name }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap" :title="item.tran_id">
              #{{ truncateString(item.tran_id) }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ item.tran_no }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap">
              {{ formatDate(item.tran_date) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ item.quantity }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ item.unit_id }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ formatCurrency(item.ots_price) }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ formatCurrency(item.price) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              - {{ formatCurrency(item.discount_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              - {{ formatCurrency(item.discount_extra_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.partner_marketing_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              - {{ formatCurrency(item.voucher_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.service_charge_amount) }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ item.item_id !== 'SUM' ? `${converVatToNumber(item.vat_tax_rate)}%` : '' }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.vat_amount, 2) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.deduct_tax_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.discount_vat_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.ship_fee_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{
                formatCurrency(
                  item.amount -
                    item.discount_amount -
                    item.discount_extra_amount +
                    item.service_charge_amount -
                    item.vat_tax_reverse_amount -
                    item.discount_vat_amount
                )
              }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              - {{ formatCurrency(item.commission_amount) }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.total_amount + item.commission_amount) }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ getPromotionName(item) }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ getPromotionName(item) && (item.voucher_code || '') }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ item.customer_name }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ item.peo_count }}
            </td>
            <td class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right">
              {{ item.customer_phone }}
            </td>
            <td
              class="fb-px-6 fb-py-4 fb-whitespace-nowrap fb-text-right fb-sticky fb-right-0 fb-bg-white"
              :class="{ 'fb-font-bold': item.item_id === 'SUM' }"
            >
              {{ formatCurrency(item.total_amount, 2) }}
            </td>
          </tr>
          <tr v-if="!loading && items.length === 0" class="fb-text-center">
            <td colspan="38" class="fb-py-4">Không có dữ liệu.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// --- Reactive State ---
const dateRange = reactive({
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10)
});
const listStore = ref([]);
const items = ref([]);
const loading = ref(false);
const isExportingReport = ref(false);
const percentageOfExportedData = ref(0);

// --- Utility Functions (replacing Vue 2 filters) ---
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
  return date.toLocaleDateString('vi-VN');
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
  loading.value = true;
  console.log('Fetching data with filters:', {
    dates: dateRange,
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
    partner_marketing_amount: mockData.reduce(
      (sum, item) => sum + item.partner_marketing_amount,
      0
    ),
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
