<template>
  <FbTableView
    title="Biên bản thỏa thuận"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm mã biên bản"
    @search="onSearchChange"
  >
    <template #header-actions>
      <Button size="small" raised @click="directToDetail">Thêm mới</Button>
    </template>

    <template #filters>
      <FbDateFilter @update:modelValue="filter" size="small" />
      <FbSelectSingleTaxStoreFilter
        placeholder="Chọn theo cửa hàng"
        size="small"
        @update:modelValue="filter"
      />
    </template>

    <template #table>
      <FbTable
        v-model:selection="saleSelecteds"
        :columns="columns"
        :items="sales"
        enableCheckbox
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="agreementProtocolList.data?.num_results || 0"
        :totalPages="agreementProtocolList.data?.total_pages || 0"
        @page-change="getData"
      >
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
            agreementProtocolList?.error ||
            (!filterStore?.report?.store_uid ? 'Vui lòng chọn cửa hàng' : 'Chưa có biên bản')
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
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';
import FbTableView from '@/components/Common/FbTableView.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

// Constants
const toast = useToast();
const columns = [
  { field: 'inv_buyerLegalName', header: 'Khách hàng' },
  { field: 'inv_number_error', header: 'Hóa đơn sai' },
  { field: 'vat_invoice_number', header: 'Hóa đơn xử lý' },
  {
    field: 'tran_id',
    header: 'Biên bản',
    format: 'truncate'
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
const saleSelecteds = ref([]);
const agreementProtocolList = computed(() => invoiceStore.agreementProtocolList);
const sales = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);

const visibleExportVat = ref(false);
const currentSaleData = ref({});

const isLoadingPdf = ref(false);
const loadingPdfTranId = ref(null);
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
    search: searchField.value
  };

  isLoading.value = true;
  await invoiceStore.getAgreementProtocolList(payload);
  sales.value = agreementProtocolList.value?.data?.data || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  sales.value = [];
  await getData();
};

const directToDetail = () => {
  router.push({ path: '/e-invoice/agreement-protocol/detail' });
};

let searchTimeout = null;
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
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

onMounted(() => {
  getData();
});
</script>
