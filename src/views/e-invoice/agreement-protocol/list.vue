<template>
  <TableView
    title="Biên bản thỏa thuận"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm số hóa đơn"
    @search="onSearchChange"
  >
    <template #header-actions>
      <Button size="small" raised @click="directToDetail()">
        <IconPlus />
        Thêm mới
      </Button>
      <ButtonExtendInvoice />
    </template>

    <template #filters>
      <FbDateFilter module="invoice" @update:modelValue="filter" size="small" />
    </template>

    <template #table>
      <FbTable
        :columns="AGREEMENT_PROTOCOL_TABLE_COLUMNS"
        :items="items"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="agreementProtocolList.data?.total || 0"
        @page-change="getData"
      >
        <template #customer="{ row }">
          <div>MÃ/MST: {{ row?.extra_data?.cus_tax_code }}</div>
          <div>Mã tra cứu:{{ row?.fkey_record }}</div>
          <div>Ký hiệu: {{ row?.extra_data?.InvSeries }}</div>
        </template>

        <template #origin_invoice="{ row }">
          <div>Mẫu số: {{ row?.origin_pattern }}</div>
          <div>Ký hiệu: {{ row?.origin_serial }}</div>
          <div>Số hóa đơn: {{ row?.invoice_number_origin }}</div>
        </template>
        <template #replace_invoice="{ row }">
          <div>
            Mẫu số:
            <span :class="{ 'fb-text-gray-300': !row?.origin_pattern }">
              {{ row?.origin_pattern || 'Chưa có dữ liệu' }}
            </span>
          </div>
          <div>
            Ký hiệu:
            <span :class="{ 'fb-text-gray-300': !row?.origin_serial }">
              {{ row?.origin_serial || 'Chưa có dữ liệu' }}
            </span>
          </div>
          <div>
            Số hóa đơn:
            <span :class="{ 'fb-text-gray-300': !row?.invoice_number_replace }">
              {{ row?.invoice_number_replace || 'Chưa có dữ liệu' }}
            </span>
          </div>
        </template>

        <template #record_invoice="{ row }">
          <div>Loại: {{ AGREEMENT_TYPE_MAP[row?.type] || row?.type }}</div>
          <div>Ngày lập: {{ formatDate(row?.record_invoice_date) }}</div>
          <div>Trạng thái : {{ AGREEMENT_STATUS_MAP[row?.status] || row?.status }}</div>
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-justify-center">
            <Button
              size="small"
              variant="text"
              @click="onPreviewPDF(row)"
              :loading="loadingPdfId === row.id && pdfAction === 'preview'"
            >
              <ProgressSpinner
                v-if="loadingPdfId === row.id && pdfAction === 'preview'"
                class="!fb-m-0"
                strokeWidth="6"
                style="width: 1rem; height: 1rem"
              />
              <IconEye v-else class="!fb-text-primary" color="currentColor" />
            </Button>
            <Button
              size="small"
              text
              @click="onDownloadPDF(row)"
              :loading="loadingPdfId === row.id && pdfAction === 'download'"
            >
              <ProgressSpinner
                v-if="loadingPdfId === row.id && pdfAction === 'download'"
                class="!fb-m-0"
                strokeWidth="6"
                style="width: 1rem; height: 1rem"
              />
              <IconDownload v-else />
            </Button>
          </div>
        </template>

        <template #empty>
          {{ agreementProtocolList?.error || 'Chưa có hóa đơn' }}
        </template>
      </FbTable>
    </template>

    <template #extra>
      <ModalExportVat
        v-model:visible="visibleExportVat"
        :itemData="currentSaleData"
        @success="filter"
      />
      <Dialog
        v-model:visible="showPreview"
        header="Xem trước"
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
              :loading="loadingPdfId === itemPreview.id && pdfAction === 'download'"
              raised
            >
              Tải xuống
              <ProgressSpinner
                v-if="loadingPdfId === itemPreview.id && pdfAction === 'download'"
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
import VuePdfEmbed from 'vue-pdf-embed';
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/common/utils/common';
import { AGREEMENT_PROTOCOL_TABLE_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import { AGREEMENT_TYPE_MAP, AGREEMENT_STATUS_MAP } from '@/common/constant/e-invoice.constant';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import ButtonExtendInvoice from '@/components/SharedComponent/ButtonExtendInvoice.vue';

const router = useRouter();

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

const toast = useToast();

// State
const searchField = ref(null);
const agreementProtocolList = computed(() => invoiceStore.agreementProtocolList);
const items = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);

const visibleExportVat = ref(false);
const currentSaleData = ref({});

const loadingPdfId = ref(null);
const pdfAction = ref(''); // 'preview' | 'download'
const showPreview = ref(false);
const previewUrl = ref(null);
const itemPreview = ref(null);

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    page: currentPage.value,
    results_per_page: pageSize.value,
    search: searchField.value,
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
  };

  isLoading.value = true;
  await invoiceStore.getAgreementProtocolList(payload);

  items.value = agreementProtocolList.value?.data?.records || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  items.value = [];
  await getData();
};

const directToDetail = (data = null) => {
  if (data) {
    router.push({ path: `/e-invoice/agreement-protocol/detail/${data?.data?.id}` });
  } else {
    router.push({ path: '/e-invoice/agreement-protocol/detail' });
  }
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
    loadingPdfId.value = item.id;
    const responseData = await invoiceService.getAgreementProtocolPdf(item.id);

    const base64String = responseData.data?.Data;

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
    loadingPdfId.value = null;
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
    a.download = `e_invoice_${item.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

const onBuyInvoice = () => {
  window.location.assign(window.location.origin + '/extend-license/invoice-renewal-stores');
};

onMounted(() => {
  getData();
});
</script>
