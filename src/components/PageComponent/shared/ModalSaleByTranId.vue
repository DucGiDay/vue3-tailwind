<template>
  <Dialog
    v-model:visible="visible"
    header="Chi tiết hóa đơn"
    modal
    class="fb-w-[50vw]"
    position="top"
    :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
  >
    <template #header>
      <h6 class="fb-text-center fb-font-semibold fb-text-lg fb-flex-1">Chi tiết hóa đơn</h6>
    </template>

    <div class="fb-flex fb-flex-col fb-gap-4">
      <div class="fb-flex fb-gap-2">
        <InputText v-model="searchText" placeholder="Tìm kiếm theo mã hoá đơn" class="fb-flex-1" />
        <!-- <Button label="Test nhanh" class="p-button-outlined p-button-sm" @click="handleTestQuick" /> -->
      </div>

      <div
        v-if="isLoading"
        class="fb-flex fb-flex-col fb-gap-4 fb-p-4 fb-border fb-border-gray-200 fb-rounded-xl"
      >
        <div v-for="n in 3" :key="n" class="fb-border fb-border-gray-200 fb-rounded-lg fb-p-4">
          <Skeleton width="40%" height="1rem" class="mb-2" />
          <Skeleton width="100%" height="2rem" />
        </div>
      </div>
      <div v-else-if="sales.length > 0" class="fb-space-y-4">
        <div
          v-for="(item, index) in sales"
          :key="index"
          class="fb-border fb-border-gray-200 fb-rounded-xl"
        >
          <!-- Header HĐ -->
          <div
            @click="toggleExpand(index)"
            class="fb-flex fb-justify-between fb-items-start fb-p-4 fb-bg-gray-50 fb-rounded-t-xl fb-border-gray-200 fb-cursor-pointer hover:fb-bg-gray-100 fb-transition-colors"
            :class="{ 'fb-border-b': expandedItems[index] }"
          >
            <div class="fb-flex fb-flex-col fb-gap-1 fb-flex-1">
              <div class="fb-font-bold fb-text-base">
                #{{ item.tran_id?.slice(-5) }} - Số HĐ: {{ item.tran_no }}
                <span class="fb-text-red-500">{{ billStatusText(item.state_action_bill) }}</span>
                <span
                  v-if="
                    item.state_action_bill === BILL_STATUS.STATE_BILL_ACTION_EDIT &&
                    item.origin_tran_id
                  "
                  class="fb-text-gray-500 fb-font-normal fb-text-sm"
                >
                  - ({{ item.origin_tran_id?.slice(-5) }})
                </span>
                <span
                  v-if="item.extra_data && item.extra_data.partner_config == 1"
                  class="fb-w-2 fb-h-2 fb-bg-green-500 fb-rounded-full fb-inline-block fb-ml-1"
                  title="Partner Active"
                ></span>
              </div>

              <!-- Mã đối tác nếu có -->
              <div v-if="item.extra_data?.tran_no_partner" class="fb-text-sm">
                Mã đối tác:
                <span class="fb-font-bold">{{ item.extra_data.tran_no_partner }}</span>
              </div>

              <div class="fb-text-sm fb-text-gray-600">
                {{ globalStore.storesById?.[item.store_uid]?.store_name }} -
                {{ item.table_name }}
                <span v-if="item.sale_type === 'FOODBOOK'" class="fb-text-blue-600">
                  (#{{ item.foodbook_order_id }})
                </span>
                -
                <span class="fb-font-semibold fb-text-gray-800">
                  {{ formatCurrency(item.total_amount) }}
                </span>
              </div>

              <!-- Thông báo chuyển bàn/sửa bàn -->
              <div
                v-if="item.extra_data?.message_modify_table"
                class="fb-text-xs fb-text-gray-500 fb-italic"
              >
                {{ item.extra_data.message_modify_table }}
              </div>
            </div>

            <div class="fb-flex fb-flex-col fb-items-end fb-gap-1">
              <div class="fb-text-sm fb-text-gray-800 fb-flex fb-items-center fb-gap-1">
                {{ formatDate(item.tran_date, 'DD/MM/YYYY HH:mm') }}
                <IconChevronDown
                  class="fb-transition-transform fb-duration-200"
                  :class="{ 'fb-rotate-180': expandedItems[index] }"
                  color="black"
                />
              </div>

              <!-- Giờ cập nhật nếu là hóa đơn Edit -->
              <div
                v-if="
                  item.sale_updated_at > 0 &&
                  item.state_action_bill === BILL_STATUS.STATE_BILL_ACTION_EDIT
                "
                class="fb-text-xs fb-text-gray-500"
              >
                Cập nhật: {{ formatDate(item.sale_updated_at, 'DD/MM/YYYY HH:mm') }}
              </div>

              <a
                href="javascript:void(0)"
                @click.stop="openSaleChangeLog(item)"
                class="fb-text-sm fb-text-primary-600 hover:fb-underline"
              >
                Xem nhật ký order
              </a>
            </div>
          </div>

          <!-- Dùng grid và transition để animate khi ẩn hiện  -->
          <div
            class="fb-grid fb-transition-all fb-duration-300 fb-ease-in-out"
            :class="
              expandedItems[index]
                ? 'fb-grid-rows-[1fr] fb-opacity-100'
                : 'fb-grid-rows-[0fr] fb-opacity-0'
            "
          >
            <!-- Nội dung chi tiết HĐ -->
            <BillContent :sale="item" />
          </div>
        </div>
      </div>

      <div v-else class="fb-font-medium fb-text-gray-500 fb-text-center">Không có dữ liệu</div>
    </div>

    <template #footer>
      <div class="fb-w-full fb-flex fb-justify-end">
        <Button
          class="fb-bg-white fb-text-blue-600 fb-border fb-border-blue-600 hover:fb-bg-blue-50"
          @click="exportSale"
        >
          <IconDownload color="#fff" />
          Xuất hoá đơn
        </Button>
      </div>
    </template>
  </Dialog>

  <!-- Modal Nhật ký order -->
  <ModalSaleChangeLog
    v-model:visible="visibleSaleChangeLog"
    :tranId="selectedSale?.tran_id"
    :tranDate="selectedSale?.tran_date"
    :storeUid="selectedSale?.store_uid"
  />
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { formatDate, formatCurrency } from '@/common/utils/common';
import ModalSaleChangeLog from '@/components/PageComponent/shared/ModalSaleChangeLog.vue';
import BillContent from '@/components/PageComponent/shared/BillContent.vue';
import { useToast } from 'primevue';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const toast = useToast();

const BILL_STATUS = {
  STATE_BILL_ACTION_NONE: 0,
  STATE_BILL_ACTION_DELETE: 1,
  STATE_BILL_ACTION_NEGATIVE: 2,
  STATE_BILL_ACTION_EDIT: 3
};

/**
 * Chuyển đổi mã trạng thái hóa đơn sang văn bản hiển thị
 * @param {number} state Trạng thái hóa đơn
 */
const billStatusText = (state) => {
  return state === BILL_STATUS.STATE_BILL_ACTION_DELETE
    ? ' - Delete'
    : state === BILL_STATUS.STATE_BILL_ACTION_EDIT
      ? ' - Edit'
      : '';
};
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dataDetail: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible']);

const sales = ref([]);
const isLoading = ref(false);
const expandedItems = ref({});
const searchText = ref('');
const visibleSaleChangeLog = ref(false);
const selectedSale = ref(null);

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

watch(
  () => visible.value,
  async (newVal) => {
    if (newVal && props.dataDetail?.merged_tran_id) {
      searchText.value = '';
      await getData();
    }
  }
);

let searchTimeout = null;
watch(searchText, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    getData();
  }, 800);
});

const toggleExpand = (index) => {
  expandedItems.value[index] = !expandedItems.value[index];
};

const openSaleChangeLog = (sale) => {
  selectedSale.value = sale;
  visibleSaleChangeLog.value = true;
};

const getData = async () => {
  isLoading.value = true;
  sales.value = []; // reset
  const payload = {
    brand_uid: globalStore.brandUid,
    company_uid: globalStore.currentUser?.company_uid,
    list_tran_id: props.dataDetail?.merged_tran_id,
    store_uid: props.dataDetail?.store_uid,
    ...(searchText.value ? { search: searchText.value } : {})
  };
  const res = await invoiceStore.getSaleByListTranId(payload);

  if (res.data) {
    sales.value = res?.data || [];
    expandedItems.value = {};
    sales.value.forEach((_, idx) => {
      expandedItems.value[idx] = idx === 0;
    });
  } else {
    toast.add({
      severity: 'error',
      summary: 'Lỗi khi tải dữ liệu',
      detail: res.error?.message,
      life: 3000
    });
    console.error(res.error);
  }
  isLoading.value = false;
};

const exportSale = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Báo cáo bán hàng');

  const row1Values = [
    'STT',
    'Cửa hàng',
    'Mã ca',
    'Mã hoá đơn',
    'Số hoá đơn',
    'Số hoá đơn điện tử',
    'Ngày vào',
    'Giờ vào',
    'Ngày ra',
    'Giờ ra',
    'Thời gian xuất hóa đơn VAT',
    'Bàn',
    'Trạng thái',
    'Mã hoá đơn gốc',
    'Tên hàng',
    'Số lượng',
    'Đơn vị',
    'Đơn giá',
    'Thành tiền',
    'Tổng tiền',
    'Giảm giá',
    'Phí dịch vụ',
    'VAT',
    'Thuế khấu trừ',
    'Chiết khấu thanh toán',
    'Hoa hồng',
    'Phí vận chuyển',
    'Số khách',
    'Loại thành viên',
    'Tên khách',
    'SĐT',
    'Địa chỉ',
    'Ghi chú',
    'Tổng hóa đơn',
    'Mã giảm giá',
    '',
    'Phương thức thanh toán',
    '',
    '',
    ''
  ];

  const row2Values = Array(34).fill('');
  row2Values[34] = 'Tên voucher';
  row2Values[35] = 'Thành tiền voucher';
  row2Values[36] = 'Tên PTTT';
  row2Values[37] = 'Mã thanh toán đối tác';
  row2Values[38] = 'Thành tiền';
  row2Values[39] = 'Số hoá đơn đối tác';

  const headerRow1 = worksheet.addRow(row1Values);
  const headerRow2 = worksheet.addRow(row2Values);

  // Merge, format cho header
  for (let i = 1; i <= 34; i++) worksheet.mergeCells(1, i, 2, i);
  worksheet.mergeCells(1, 35, 1, 36);
  worksheet.mergeCells(1, 37, 1, 40);

  [headerRow1, headerRow2].forEach((row) => {
    row.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '79abe3' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  let currentRow = 3;
  sales.value.forEach((item, index) => {
    const details = item.sale_detail || [];
    const payments = item.sale_payment_method || [];
    const rowCount = Math.max(details.length, payments.length);

    for (let dIndex = 0; dIndex < rowCount; dIndex++) {
      const detailItem = details[dIndex];
      const salePaymentMethod = payments[dIndex];
      const isFirstDetail = dIndex === 0;

      const rowData = [
        isFirstDetail ? index + 1 : '',
        isFirstDetail ? globalStore.storesById?.[item.store_uid]?.store_name || '' : '',
        isFirstDetail ? item.shift_id : '',
        isFirstDetail ? item.tran_id : '',
        isFirstDetail ? item.tran_no : '',
        isFirstDetail ? item.vat_invoice_number : '',
        isFirstDetail ? formatDate(item.start_date) : '',
        isFirstDetail ? formatDate(item.start_date, 'HH:mm') : '',
        isFirstDetail ? formatDate(item.tran_date) : '',
        isFirstDetail ? formatDate(item.tran_date, 'HH:mm') : '',
        isFirstDetail ? formatDate(item.vat_invoice_date) : '',
        isFirstDetail ? item.table_name : '',
        isFirstDetail ? item.state_action_bill : '',
        isFirstDetail ? item.origin_tran_id : '',

        detailItem?.item_name || '',
        detailItem?.quantity || '',
        detailItem?.unit_id || '',
        detailItem?.price || '',
        detailItem?.amount_all_topping || '',

        isFirstDetail ? calTotalItemPrice(details) : '',
        isFirstDetail ? (item.amount_discount_detail || 0) + (item.amount_discount_price || 0) : '',
        isFirstDetail ? item.service_charge_amount || 0 : '',
        isFirstDetail ? item.vat_amount || 0 : '',
        isFirstDetail ? item.deduct_tax_amount || 0 : '',
        isFirstDetail
          ? isDiscountPaymentTovoucher(item)
            ? 0 - (item?.voucher_amount || 0)
            : 0 - (item?.discount_extra_amount || 0)
          : '',
        isFirstDetail ? item.commission_amount || 0 : '',
        isFirstDetail ? item.ship_fee_amount || 0 : '',
        isFirstDetail ? item?.extra_data?.peo_count || '' : '',
        isFirstDetail ? item?.extra_data?.Membership_Type_Name || '' : '',
        isFirstDetail ? item?.extra_data?.customer_name || '' : '',
        isFirstDetail ? item?.extra_data?.customer_phone || '' : '',
        isFirstDetail ? item?.extra_data?.customer_address || '' : '',
        isFirstDetail ? item.sale_note || '' : '',
        isFirstDetail ? item.total_amount || 0 : '',

        isFirstDetail ? item.voucher_name || '' : '',
        isFirstDetail
          ? item.voucher_name
            ? isDiscountPaymentTovoucher(item)
              ? 0
              : 0 - (item.voucher_amount || 0)
            : ''
          : '',

        salePaymentMethod?.payment_method_name || '',
        salePaymentMethod?.tran_id_of_partner || salePaymentMethod?.trace_no || '',
        salePaymentMethod?.payment_method_name ? salePaymentMethod?.payment_amount || 0 : '',
        isFirstDetail ? item?.extra_data?.tran_no_partner || '' : ''
      ];

      const row = worksheet.addRow(rowData);
      row.eachCell((cell, colNumber) => {
        // --- BORDER   ---
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', wrapText: false };

        // Format currency
        if ([16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 34, 36, 38, 39].includes(colNumber)) {
          cell.numFmt = '#,##0';
        }
      });
    }

    // Merge các ô dữ liệu
    if (rowCount > 1) {
      for (let col = 1; col <= 14; col++)
        worksheet.mergeCells(currentRow, col, currentRow + rowCount - 1, col);
      for (let col = 20; col <= 34; col++)
        worksheet.mergeCells(currentRow, col, currentRow + rowCount - 1, col);
      for (let col = 35; col <= 36; col++)
        worksheet.mergeCells(currentRow, col, currentRow + rowCount - 1, col);
      worksheet.mergeCells(currentRow, 40, currentRow + rowCount - 1, 40);
    }
    currentRow += rowCount;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'data.xlsx');
};

const isDiscountPaymentTovoucher = (sale) => {
  return (
    !(sale && sale.voucher_code && (sale.voucher_amount > 0 || sale.voucher_extra > 0)) ||
    (sale && sale.voucher_code && sale.voucher_amount_paid > 0)
  );
};

const calTotalItemPrice = (items) => {
  return items?.length > 0
    ? items.map((item) => item.amount_all_topping || 0).reduce((prev, next) => prev + next, 0)
    : 0;
};

/**
 * Điền dữ liệu giả lập (fake data) vào sales để kiểm tra nhanh giao diện
 */
const handleTestQuick = () => {
  sales.value = [
    {
      tran_id: 'ABCDE123456789',
      tran_no: 'HD0001',
      table_name: 'Bàn số 5',
      total_amount: 155000,
      tran_date: '2026-04-22T10:30:00Z',
      amount_origin: 140000,
      amount_discount_detail: 5000,
      amount_discount_price: 0,
      discount_extra_amount: 10000,
      discount_extra_name: 'Tri ân khách hàng',
      partner_marketing_amount: 5000,
      service_charge_amount: 10000,
      service_charge_name: 'Phí phục vụ ngày lễ',
      vat_amount: 12000,
      discount_vat_amount: 0,
      commission_amount: 2000,
      ship_fee_amount: 15000,
      deduct_tax_amount: 1500,
      deduct_tax_rate: 0.01,
      voucher_name: 'Voucher Giảm Giá 20k',
      voucher_amount: 20000,
      voucher_amount_paid: 20000,
      voucher_code: 'VC-THANKS-2026',
      sale_note: 'Giao hàng sau 11h, không cho nhiều hành.',
      extra_data: {
        vat_option: 3,
        ship_fee: 15000,
        deposit_amount: 50000,
        peo_count: 4,
        customer_name: 'Nguyễn Văn A',
        customer_phone: '0987654321',
        customer_address: '123 Đường Láng, Hà Nội',
        voucher_input: 'Voucher x1\nƯu đãi thẻ thành viên x1'
      },
      sale_detail: [
        {
          item_name: 'Trà Sữa Trân Châu Đường Đen',
          quantity: 2.5,
          amount: 110000,
          price_org: 60000,
          note: 'Ít đá, 50% đường',
          vat_tax_amount: 8000,
          vat_tax_rate: 0.08,
          toppings: [
            {
              item_name: 'Thạch dừa',
              quantity: 2,
              amount: 10000,
              price_org: 5000,
              sub_topping: [
                {
                  item_name: 'Thêm syrup',
                  quantity: 1.1234567,
                  amount: 5000,
                  price_org: 5000
                }
              ]
            }
          ]
        },
        {
          item_name: 'Trà Sữa Trân Châu Đường Đen',
          quantity: 2.5,
          amount: 110000,
          price_org: 60000,
          note: 'Ít đá, 50% đường',
          vat_tax_amount: 8000,
          vat_tax_rate: 0.08,
          toppings: [
            {
              item_name: 'Thạch dừa',
              quantity: 2,
              amount: 10000,
              price_org: 5000,
              sub_topping: [
                {
                  item_name: 'Thêm syrup',
                  quantity: 1.1234567,
                  amount: 5000,
                  price_org: 5000
                }
              ]
            }
          ]
        }
      ],
      sale_payment_method: [
        {
          payment_method_name: 'Chuyển khoản MoMo',
          amount: 105000,
          trace_no: '999888',
          tran_id_of_partner: 'MOMO-123456789',
          payment_fee_type: 1,
          payment_fee_amount: 1000
        }
      ]
    }
  ];
  expandedItems.value = { 0: true };
};
</script>
