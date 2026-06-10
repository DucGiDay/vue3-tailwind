<template>
  <TableView
    title="Hóa đơn bán hàng"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm mã hóa đơn"
    @search="onSearchChange"
    @force-search="filter"
  >
    <template #header-actions>
      <Button
        v-if="saleSelecteds.length > 1"
        size="small"
        severity="help"
        @click="handleExportVat(true)"
      >
        Xuất ngay
      </Button>
      <Button v-if="saleSelecteds.length" size="small" @click="handleExportVat(false)">
        Xuất chi tiết
      </Button>
      <ButtonExtendInvoice />
    </template>

    <template #filters>
      <FbDateFilter module="invoice" @update:modelValue="filter" size="small" />
      <FbSelectTaxStoreFilter isSingleGroup @update:modelValue="filter" />
    </template>

    <template #table>
      <FbTable
        v-model:selection="saleSelecteds"
        :columns="invoiceTab === 'tab1' ? SALE_ORDER_TABLE_COLUMNS : invoiceManageColumns"
        :items="sales"
        enableCheckbox
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="
          invoiceTab === 'tab1'
            ? saleNotSyncVat.data?.num_results || 0
            : vatInvoice.data?.num_results || 0
        "
        :totalPages="
          invoiceTab === 'tab1'
            ? saleNotSyncVat.data?.total_pages || 0
            : vatInvoice.data?.total_pages || 0
        "
        @page-change="getData"
      >
        <template #header>
          <SelectButton
            v-model="invoiceTab"
            :options="[
              { label: 'Hóa đơn chưa xuất', value: 'tab1' },
              { label: 'Hóa đơn chờ đồng bộ', value: 'tab2' },
              { label: 'Hóa đơn xuất lỗi', value: 'tab3' },
            ]"
            size="small"
            optionLabel="label"
            optionValue="value"
            :allowEmpty="false"
            @change="filter"
          />
        </template>
        <!-- START Tab hóa đơn chưa xuất -->
        <template #tran_id="{ record, row }">
          <span v-tooltip.top="{ value: record, showDelay: 500, hideDelay: 100 }">
            {{ invoiceTab === 'tab1' ? truncate(record) : record }}
          </span>
          <span v-if="row?.extra_sale?.error_vat" v-tooltip="{ value: row?.extra_sale?.error_vat }">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="!fb-inline fb-ml-1"
            >
              <g clip-path="url(#clip0_2505_55752)">
                <path
                  d="M7.99999 10.6666V7.99998M7.99999 5.33331H8.00666M14.6667 7.99998C14.6667 11.6819 11.6819 14.6666 7.99999 14.6666C4.3181 14.6666 1.33333 11.6819 1.33333 7.99998C1.33333 4.31808 4.3181 1.33331 7.99999 1.33331C11.6819 1.33331 14.6667 4.31808 14.6667 7.99998Z"
                  stroke="#D92D20"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2505_55752">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </template>
        <template #end_date="{ row }">{{ row.end_hour }}:{{ row.end_minute }}</template>
        <!-- END Tab hóa đơn chưa xuất -->

        <!-- START Tab hóa đơn chờ đồng bộ và Hóa đơn xuất lỗi -->
        <template #vat_publish_status="{ record, row }">
          <Tag
            :severity="statusMap(row?.vat_publish_status_code)?.severity || 'secondary'"
            :value="record || statusMap('-1')?.label"
            class="!fb-text-xs !fb-font-medium"
          />
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-justify-center">
            <Button
              size="small"
              text
              v-tooltip.left="{ value: 'Xem trước hóa đơn', showDelay: 500, hideDelay: 100 }"
              @click="onPreviewPDF(row)"
              :loading="loadingPdfTranId === row.tran_id && pdfAction === 'preview'"
            >
              <ProgressSpinner
                v-if="loadingPdfTranId === row.tran_id && pdfAction === 'preview'"
                class="!fb-m-0"
                strokeWidth="6"
                style="width: 1rem; height: 1rem"
              />
              <IconEye v-else class="!fb-text-primary" color="currentColor" />
            </Button>
            <Button
              size="small"
              text
              v-tooltip.left="{ value: 'Làm mới', showDelay: 500, hideDelay: 100 }"
              @click="refreshRow(row)"
              :loading="loadingRefreshTranId === row.tran_id"
            >
              <ProgressSpinner
                v-if="loadingRefreshTranId === row.tran_id"
                class="!fb-m-0"
                strokeWidth="6"
                style="width: 1rem; height: 1rem"
              />
              <IconRefresh v-else class="!fb-text-primary" color="currentColor" />
            </Button>
          </div>
        </template>
        <!-- END Tab hóa đơn chờ đồng bộ và Hóa đơn xuất lỗi -->

        <template #empty>
          {{
            invoiceTab === 'tab1'
              ? saleNotSyncVat?.error ||
                (!storeUidByTaxCode ? 'Vui lòng chọn cửa hàng' : 'Chưa có hóa đơn')
              : vatInvoice?.error ||
                (!storeUidByTaxCode ? 'Vui lòng chọn cửa hàng' : 'Chưa có hóa đơn')
          }}
        </template>
      </FbTable>
    </template>

    <template #extra>
      <ModalExportVat
        v-model:visible="visibleExportVat"
        :saleData="currentSaleData"
        @success="filter"
      />
      <Dialog
        v-model:visible="showPreview"
        header="Xem trước hóa đơn"
        modal
        maximizable
        :style="{ width: '70vw' }"
        :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
      >
        <div class="fb-flex fb-justify-center">
          <vue-pdf-embed v-if="previewUrl" :source="previewUrl" :width="800" />
        </div>
        <template #footer>
          <div class="fb-flex fb-justify-end fb-pt-2">
            <Button
              @click="onDownloadPDF(itemPreview)"
              :loading="loadingPdfTranId === itemPreview.tran_id && pdfAction === 'download'"
              raised
            >
              Tải xuống
              <ProgressSpinner
                v-if="loadingPdfTranId === itemPreview.tran_id && pdfAction === 'download'"
                class="!fb-m-0"
                strokeWidth="6"
                style="width: 1rem; height: 1rem"
              />
              <IconDownload v-else class="!fb-text-white" color="currentColor" />
            </Button>
          </div>
        </template>
      </Dialog>
    </template>
  </TableView>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import VuePdfEmbed from 'vue-pdf-embed';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import {
  SALE_ORDER_TABLE_COLUMNS,
  INVOICE_MANAGE_TABLE_COLUMNS,
} from '@/common/constant/e-invoice-column.constant';
import { VAT_PUBLISH_STATUS_COLOR } from '@/common/constant/e-invoice.constant';
import ButtonExtendInvoice from '@/components/SharedComponent/ButtonExtendInvoice.vue';
import IconDownload from '@/components/Common/Icon/IconDownload.vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();
const route = useRoute();
const toast = useToast();

// State
const searchField = ref(null);
const invoiceTab = ref('tab1'); // tab1, tab2, tab3
const saleSelecteds = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);
const visibleExportVat = ref(false);

const loadingPdfTranId = ref(null);
const loadingRefreshTranId = ref(null);
const pdfAction = ref(null);
const showPreview = ref(false);
const itemPreview = ref(null);
const previewUrl = ref(null);

const saleNotSyncVat = computed(() => invoiceStore.saleNotSyncVat);
const vatInvoice = computed(() => invoiceStore.vatInvoice); // data from api
const sales = ref([]);
const currentSaleData = ref({});

const storeUidByTaxCode = computed(() => {
  const selectedObj = filterStore?.invoice?.store_uid_by_tax_code;
  if (!selectedObj || Object.keys(selectedObj).length === 0) {
    return invoiceStore.listStoreUidInCurrentTaxCode.join(',');
  }
  return Object.values(selectedObj).flat().filter(Boolean).join(',');
});

const invoiceManageColumns = computed(() => {
  // tab3
  if (invoiceTab.value === 'tab3') {
    const columns = [
      ...INVOICE_MANAGE_TABLE_COLUMNS,
      { field: 'error_message', header: 'Lý do xuất lỗi' },
    ];
    const actionIndex = columns.findIndex((col) => col.field === 'action');
    const newColumn = { field: 'error_message', header: 'Lý do xuất lỗi' };
    if (actionIndex !== -1) {
      columns.splice(actionIndex, 0, newColumn);
    } else {
      columns.push(newColumn);
    }
    return columns;
  }
  // tab2
  return INVOICE_MANAGE_TABLE_COLUMNS;
});

// Methods
const getData = async ({ page, rows } = {}) => {
  if (!storeUidByTaxCode.value) return;

  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    // brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: storeUidByTaxCode.value,
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
    page: currentPage.value,
    results_per_page: pageSize.value,
    search: searchField.value,
  };

  isLoading.value = true;
  await invoiceStore.getSaleNotSyncVat(payload);
  sales.value = saleNotSyncVat.value?.data?.data || [];
  isLoading.value = false;
};

const getExportedInvoice = async ({ page, rows } = {}) => {
  if (!storeUidByTaxCode.value) return;

  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: storeUidByTaxCode.value,
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
    page: currentPage.value,
    results_per_page: pageSize.value,
    search: searchField.value,
    is_sync_vat: invoiceTab.value === 'tab2' ? '3' : invoiceTab.value === 'tab3' ? '2' : null,
  };

  isLoading.value = true;
  await invoiceStore.getVatInvoice(payload);
  sales.value = vatInvoice.value?.data?.data || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  sales.value = [];
  if (invoiceTab.value === 'tab1') {
    await getData();
  } else {
    await getExportedInvoice();
  }
};
const statusMap = (status) => {
  return VAT_PUBLISH_STATUS_COLOR[status] || VAT_PUBLISH_STATUS_COLOR['-1'];
};

const handleExportVat = (isImmediate = false) => {
  if (!saleSelecteds.value.length) return;
  // Chuẩn bị dữ liệu truyền vào Modal
  // Nếu là nhiều sales, API thường nhận object chứa array list_sale
  currentSaleData.value = {
    sales: saleSelecteds.value,
    is_immediate: isImmediate, // Flag để modal biết là xuất ngay (nếu cần xử lý riêng)
  };

  visibleExportVat.value = true;
};

let searchTimeout = null;

const refreshRow = async (row) => {
  loadingRefreshTranId.value = row.tran_id;
  await getStatusSale(null, row);
  loadingRefreshTranId.value = null;
};

const getStatusSale = async (_, row) => {
  try {
    const response = await invoiceService.getStatus({ tran_id: row.tran_id });
    Object.assign(row, {
      statusSale: response?.data,
      vat_publish_status: response?.data?.vat_publish_status || row?.vat_publish_status,
      vat_publish_status_code:
        response?.data?.vat_publish_status_code || row?.vat_publish_status_code,
    });
  } catch (error) {
    console.error('Error fetching status:', error);
  }
};

const fetchAndCachePDF = async (item) => {
  if (item.pdfUrl) return item.pdfUrl;

  try {
    loadingPdfTranId.value = item.tran_id;
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      tran_id: item.tran_id,
      store_uid: item?.store_uid,
    };
    const responseData = await invoiceService.exportPDF(payload);
    const base64String = responseData.data;

    const byteCharacters = atob(base64String);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    item.pdfUrl = url;
    return url;
  } catch (error) {
    toast.add({ severity: 'error', summary: error?.message, life: 3000 });
    return null;
  } finally {
    loadingPdfTranId.value = null;
  }
};

const onPreviewPDF = async (item) => {
  pdfAction.value = 'preview';
  itemPreview.value = null;

  const url = await fetchAndCachePDF(item);
  if (url) {
    previewUrl.value = url;
    itemPreview.value = item;
    showPreview.value = true;
  }
};

const onDownloadPDF = async (item) => {
  pdfAction.value = 'download';
  const url = await fetchAndCachePDF(item);
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `e_invoice_${item.tran_id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

const truncate = (value) => {
  return value ? `#${value.toString().slice(-5)}` : '';
};

onMounted(() => {
  const queryType = route.query?.invoiceTab;
  if (!queryType) {
    invoiceTab.value = 'tab1';
    getData();
    return;
  }
  const validTypes = ['tab1', 'tab2', 'tab3'];
  invoiceTab.value = validTypes.includes(queryType) ? queryType : 'tab1';
  if (invoiceTab.value === 'tab1') {
    getData();
  } else {
    getExportedInvoice();
  }
});
</script>
