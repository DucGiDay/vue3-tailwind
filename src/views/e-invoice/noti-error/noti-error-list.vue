<template>
  <TableView
    title="Thông báo sai sót"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm mã hóa đơn"
    @search="onSearchChange"
  >
    <template #header-actions>
      <Button size="small" raised @click="directToDetail">
        <IconPlus />
        Thêm mới
      </Button>
      <ButtonExtendInvoice />
    </template>

    <template #filters>
      <Select
        v-model="typeErrorField"
        :options="errorTypeList"
        optionLabel="name"
        optionValue="type_error"
        placeholder="Chọn loại sai sót"
        class="fb-w-auto md:fb-w-48"
        showClear
        size="small"
        :loading="isLoadingErrorType"
        @change="filter"
      />

      <FbDateFilter @update:modelValue="filter" size="small" />
    </template>

    <template #table>
      <FbTable
        :columns="NOTI_ERROR_TABLE_COLUMNS"
        :items="items"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="notiErrorList.data?.total || 0"
        scrollHeight="flex"
        keyLoading="tran_id"
        @page-change="getData"
      >
        <template #status="{ record }">
          <span
            :class="statusMap(record)?.class"
            class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
          >
            {{ statusMap(record)?.label }}
          </span>
        </template>

        <template #extra_data="{ record }">
          {{ record.reason }}
        </template>

        <template #type_error="{ record }">
          {{ errorTypeMap?.[record] }}
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
          {{
            notiErrorList?.error ? 'Error: ' + notiErrorList?.error : 'Chưa có thông báo sai sót'
          }}
        </template>
      </FbTable>
    </template>

    <template #extra>
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
              :loading="loadingPdfId === itemPreview?.id && pdfAction === 'download'"
              raised
            >
              Tải xuống
              <ProgressSpinner
                v-if="loadingPdfId === itemPreview?.id && pdfAction === 'download'"
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
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { NOTI_ERROR_STATUS_COLOR } from '@/common/constant/e-invoice.constant';
import { NOTI_ERROR_TABLE_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import ButtonExtendInvoice from '@/components/SharedComponent/ButtonExtendInvoice.vue';

const router = useRouter();

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

const toast = useToast();

// State
const searchField = ref(null);
const typeErrorField = ref(null);
const currentPage = ref(1);
const pageSize = ref(50);

const notiErrorList = computed(() => invoiceStore.notiErrorList); // data from api
const errorTypeList = computed(() => invoiceStore.errorTypeList);
const errorTypeMap = computed(() => invoiceStore.errorTypeMap);
const items = ref([]); // data display in table

const isLoading = ref(false);
const loadingPdfId = ref(null);
const isLoadingErrorType = ref(null);

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
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
    page: currentPage.value,
    results_per_page: pageSize.value,
    search: searchField.value,
    type_error: typeErrorField.value,
  };

  isLoading.value = true;
  await invoiceStore.getNotiError(payload);
  items.value = notiErrorList.value?.data?.items || [];
  isLoading.value = false;
};

const getErrorType = async () => {
  if (errorTypeList.value && errorTypeList.value.length) return;
  isLoadingErrorType.value = true;
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
  };
  await invoiceStore.getErrorType(payload);
  isLoadingErrorType.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  items.value = [];
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
  return NOTI_ERROR_STATUS_COLOR[status] || NOTI_ERROR_STATUS_COLOR['-1'];
};

const fetchAndCachePDF = async (item) => {
  if (item.pdfUrl) return item.pdfUrl;

  try {
    loadingPdfId.value = item.id;
    const responseData = await invoiceService.getNotiErrorPdf(item.id);
    const base64String = responseData.data?.pdf_base64;

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
  if (!item) return;
  pdfAction.value = 'download';
  const url = await fetchAndCachePDF(item);
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `thong_bao_sai_sot_${item.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

const directToDetail = () => {
  router.push({ path: '/e-invoice/noti-error/detail' });
};

const onBuyInvoice = () => {
  window.location.assign(window.location.origin + '/extend-license/invoice-renewal-stores');
};

// life cycle
onMounted(async () => {
  getErrorType();
  await getData();
});
</script>
