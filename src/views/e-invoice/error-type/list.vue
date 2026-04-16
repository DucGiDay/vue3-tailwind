<template>
  <FbTableView
    title="Thông báo sai sót"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm mã tra cứu"
    :handleBack="handleBack"
    @search="onSearchChange"
  >
    <template #header-actions>
      <Button size="small" raised @click="directToDetail">Thêm mới</Button>
    </template>

    <template #filters>
      <Select
        v-model="statusField"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Chọn trạng thái"
        class="fb-w-auto md:fb-w-48"
        showClear
        size="small"
        @change="filter"
      />

      <FbDateFilter @update:modelValue="filter" size="small" />

      <FbSelectSingleTaxStoreFilter
        placeholder="Chọn theo cửa hàng"
        size="small"
        @update:modelValue="filter"
      />
    </template>

    <template #table>
      <FbTable
        :columns="columns"
        :items="sales"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="errorTypeList.data?.num_results || 0"
        :totalPages="errorTypeList.data?.total_pages || 0"
        :loadingActionRowCustom="loadingActionRowCustom"
        scrollHeight="flex"
        keyLoading="tran_id"
        @page-change="getData"
      >
        <template #vat_publish_status="{ record, row }">
          <span
            :class="statusMap(row?.vat_publish_status_code)?.class"
            class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
          >
            {{ record || statusMap('-1')?.label }}
          </span>
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-justify-center">
            <Button
              size="small"
              text
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
          </div>
        </template>

        <template #empty>
          {{
            errorTypeList?.error ? 'Error: ' + errorTypeList?.error : 'Chưa có thông báo sai sót'
          }}
        </template>
      </FbTable>
    </template>

    <template #extra>
      <Dialog
        v-model:visible="showPreview"
        header="Xem trước"
        modal
        :style="{ width: '70vw' }"
        :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
      >
        <vue-pdf-embed v-if="previewUrl" :source="previewUrl" />
      </Dialog>
    </template>
  </FbTableView>
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import FbTableView from '@/components/Common/FbTableView.vue';
import {
  VAT_PUBLISH_STATUS_COLOR,
  VAT_PUBLISH_STATUS_LIST
} from '@/common/constant/e-invoice.constant';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

import IconEye from '@/components/Common/Icon/IconEye.vue';

const router = useRouter();

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

// constants
const toast = useToast();
const columns = [
  { field: 'inv_series', header: 'Ký hiệu' },
  { field: 'tran_id', header: 'Mã tra cứu' },
  { field: 'vat_invoice_number', header: 'Số hóa đơn' },
  { field: 'inv_template', header: 'Mẫu số' },
  { field: 'vat_publish_status', header: 'Trạng thái' },
  { field: 'error_type', header: 'Loại sai sót' },
  { field: 'reason', header: 'Lý do' },
  {
    field: 'created_at',
    header: 'Ngày tạo',
    classes: '!fb-text-muted-color',
    format: 'date'
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '3rem', minWidth: '3rem', padding: '0 0 0 0.25rem !important' }
  }
];

// State
const searchField = ref(null);
const statusField = ref(null);
const statusOptions = reactive(VAT_PUBLISH_STATUS_LIST);
const currentPage = ref(1);
const pageSize = ref(50);

const errorTypeList = computed(() => invoiceStore.errorTypeList); // data from api
const sales = ref([]); // data display in table

const isLoading = ref(false);
const loadingPdfTranId = ref(null);
const loadingActionRowCustom = ref(null);

const pdfAction = ref(''); // 'preview' | 'download'
const showPreview = ref(false);
const previewUrl = ref(null);

// Methods
const getData = async ({ page, rows } = {}) => {
  if (!filterStore?.report?.store_uid) return;

  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: filterStore?.report?.store_uid,
    start_date: new Date(filterStore?.report?.start_date).getTime(),
    end_date: new Date(filterStore?.report?.end_date).getTime(),
    page: currentPage.value,
    results_per_page: pageSize.value,
    search: searchField.value,
    status: statusField.value
  };

  isLoading.value = true;
  await invoiceStore.getErrorType(payload);
  sales.value = errorTypeList.value?.data?.data || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  sales.value = [];
  await getData();
};

let searchTimeout = null;
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

const statusMap = (status) => {
  return VAT_PUBLISH_STATUS_COLOR[status] || VAT_PUBLISH_STATUS_COLOR['-1'];
};

const fetchAndCachePDF = async (item) => {
  if (item.pdfUrl) return item.pdfUrl;

  try {
    loadingPdfTranId.value = item.tran_id;
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      tran_id: item.tran_id,
      store_uid: item?.store_uid
    };
    const responseData = await invoiceService.exportPDF(payload);
    const base64String = responseData.data;

    // Decode base64 → binary
    const byteCharacters = atob(base64String);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Cache URL vào item
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
  const url = await fetchAndCachePDF(item);
  if (url) {
    previewUrl.value = url;
    showPreview.value = true;
  }
};

const directToDetail = () => {
  router.push({ path: '/e-invoice/error-type/detail' });
};

const handleBack = () => {
  router.push({ path: '/e-invoice/error-type' });
};

// life cycle
onMounted(() => {
  getData();
});
</script>
