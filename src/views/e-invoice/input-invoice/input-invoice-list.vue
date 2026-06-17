<template>
  <TableView title="Danh sách hóa đơn đầu vào" :searchable="false">
    <template #header-actions>
      <Button
        :loading="isLoadingExport"
        size="small"
        outlined
        class="!fb-rounded-lg"
        @click="handleExportExcel"
      >
        <IconDownload v-if="!isLoadingExport" color="currentColor" />
        <FbLoading v-else show />
        Xuất excel
      </Button>
    </template>
    <template #toolbar>
      <div class="fb-bg-white fb-px-4 fb-py-3 fb-rounded-lg fb-border fb-border-surface-200">
        <div class="fb-flex fb-gap-2 fb-flex-wrap">
          <FbDateFilter module="invoice" useSinglePicker @update:modelValue="filter" size="small" />

          <Button
            size="small"
            @click.prevent="filter"
            v-tooltip.top="{
              value: 'Tra cứu',
              showDelay: 500,
              hideDelay: 100,
            }"
          >
            <IconSearch color="currentColor" />
          </Button>
          <div class="fb-ml-auto">
            <Button
              v-tooltip.bottom="showAdvancedFilter ? 'Ẩn bộ lọc' : 'Lọc nâng cao'"
              :severity="showAdvancedFilter ? 'primary' : 'secondary'"
              outlined
              size="small"
              @click="showAdvancedFilter = !showAdvancedFilter"
            >
              <IconFilter color="currentColor" />
            </Button>
          </div>
        </div>
        <transition name="filter-slide">
          <div
            v-show="showAdvancedFilter"
            class="fb-flex fb-flex-wrap fb-gap-4 fb-w-full fb-mt-2 fb-pt-2 fb-border-t"
          >
            <Select
              v-model="filterStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Trạng thái"
              class="fb-flex-1"
              size="small"
              showClear
              @change="filter"
            />
            <Select
              v-model="filterStatusMST"
              :options="statusMSTOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Trạng thái MST"
              class="fb-flex-1"
              size="small"
              showClear
              @change="filter"
            />
            <InputText
              v-model="filterPattern"
              placeholder="Mẫu số"
              class="fb-flex-1"
              size="small"
              @keyup.enter="filter"
            />
            <InputText
              v-model="filterSerial"
              placeholder="Ký hiệu"
              class="fb-flex-1"
              size="small"
              @keyup.enter="filter"
            />
            <InputText
              v-model="filterNo"
              placeholder="Số hóa đơn"
              class="fb-flex-1"
              type="number"
              size="small"
              @keyup.enter="filter"
            />
          </div>
        </transition>
      </div>
    </template>

    <template #table>
      <FbTable
        :columns="INPUT_INVOICE_TABLE_COLUMNS"
        :items="items"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="inputInvoiceList.data?.total || 0"
        scrollHeight="flex"
        keyLoading="id"
        @page-change="getData"
      >
        <template #pattern_serial="{ row }">{{ row.pattern }} - {{ row.serial }}</template>

        <template #header>
          <div class="fb-justify-end fb-flex fb-gap-2">
            <Button size="small" :loading="isUpdatingStatus" @click="updatePaymentStatus">
              Cập nhật thanh toán
            </Button>
            <Button size="small" :loading="isUpdatingStatus" @click="updateTaxDeclared">
              Cập nhật kê khai
            </Button>
          </div>
        </template>

        <template #tax_declared="{ row }">
          {{ row?.status_tax_code_name }}
        </template>

        <template #invoice_status="{ row }">
          {{ statusMap[row?.invoice_status] || row?.invoice_status }}
        </template>

        <template #note="{ record, row }">
          <div
            class="fb-cursor-pointer fb-flex fb-items-center fb-justify-end fb-gap-1 hover:fb-text-primary fb-underline fb-underline-offset-2"
            @click="openEditNoteDialog(row, record)"
          >
            {{ record || '' }}
            <span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="fb-h-4 fb-w-4"
              >
                <path
                  d="M2.5 21.4998L8.04927 19.3655C8.40421 19.229 8.58168 19.1607 8.74772 19.0716C8.8952 18.9924 9.0358 18.901 9.16804 18.7984C9.31692 18.6829 9.45137 18.5484 9.72028 18.2795L21 6.99982C22.1046 5.89525 22.1046 4.10438 21 2.99981C19.8955 1.89525 18.1046 1.89524 17 2.99981L5.72028 14.2795C5.45138 14.5484 5.31692 14.6829 5.20139 14.8318C5.09877 14.964 5.0074 15.1046 4.92823 15.2521C4.83911 15.4181 4.77085 15.5956 4.63433 15.9506L2.5 21.4998ZM2.5 21.4998L4.55812 16.1488C4.7054 15.7659 4.77903 15.5744 4.90534 15.4867C5.01572 15.4101 5.1523 15.3811 5.2843 15.4063C5.43533 15.4351 5.58038 15.5802 5.87048 15.8703L8.12957 18.1294C8.41967 18.4195 8.56472 18.5645 8.59356 18.7155C8.61877 18.8475 8.58979 18.9841 8.51314 19.0945C8.42545 19.2208 8.23399 19.2944 7.85107 19.4417L2.5 21.4998Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-justify-center fb-items-center fb-gap-2">
            <div class="fb-flex fb-flex-col fb-gap-2">
              <Button
                size="small"
                class="!fb-p-0"
                severity="secondary"
                text
                @click="handleViewXml(row)"
                :loading="isFetchingXml && currentXmlRowNo === row.no"
              >
                <FbLoading v-if="isFetchingXml && currentXmlRowNo === row.no" show />
                <span v-else>XML</span>
              </Button>
              <Button
                size="small"
                class="!fb-p-0"
                severity="secondary"
                text
                @click="handleViewPdf(row)"
                :loading="isFetchingPdf && currentPdfRowNo === row.no"
              >
                <FbLoading v-if="isFetchingPdf && currentPdfRowNo === row.no" show />
                <span v-else>PDF</span>
              </Button>
            </div>
            <Checkbox v-model="row.checked" :binary="true" />
          </div>
        </template>

        <template #empty>
          {{
            inputInvoiceList?.error
              ? 'Error: ' + inputInvoiceList?.error
              : 'Chưa có hóa đơn đầu vào'
          }}
        </template>
      </FbTable>
    </template>
    <template #extra>
      <Dialog
        v-model:visible="showEditNoteDialog"
        header="Chỉnh sửa ghi chú"
        modal
        :style="{ width: '30rem' }"
      >
        <div class="fb-flex fb-flex-col fb-gap-4">
          <Textarea
            v-model="editNoteValue"
            rows="4"
            placeholder="Nhập ghi chú..."
            class="fb-w-full"
            autoResize
          />
          <div class="fb-flex fb-justify-end fb-gap-2 fb-mt-2">
            <Button label="Hủy" severity="secondary" outlined @click="showEditNoteDialog = false" />
            <Button label="Lưu lại" :loading="isSavingNote" @click="saveNote" />
          </div>
        </div>
      </Dialog>

      <Dialog
        v-model:visible="showXmlDialog"
        header="Chi tiết XML"
        modal
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <div class="fb-flex fb-flex-col fb-gap-4">
          <div
            class="fb-bg-surface-50 fb-p-4 fb-rounded-lg fb-max-h-[60vh] fb-overflow-y-auto fb-border"
          >
            <pre class="fb-text-sm fb-whitespace-pre-wrap fb-break-all">{{ xmlContent }}</pre>
          </div>
          <div class="fb-flex fb-justify-end fb-gap-2 fb-mt-2">
            <Button label="Đóng" severity="secondary" outlined @click="showXmlDialog = false" />
            <Button
              label="Copy"
              severity="secondary"
              @click="handleCopyXml"
              :disabled="!xmlContent"
            />
            <Button label="Tải về" @click="handleDownloadXml" :disabled="!xmlContent" />
          </div>
        </div>
      </Dialog>

      <Dialog
        v-model:visible="showPdfDialog"
        header="Xem trước PDF"
        modal
        maximizable
        :style="{ width: '70vw' }"
        :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
      >
        <div class="fb-flex fb-justify-center">
          <vue-pdf-embed v-if="pdfUrl" :source="pdfUrl" :width="800" />
        </div>
        <template #footer>
          <div class="fb-flex fb-justify-end fb-pt-2">
            <Button @click="handleDownloadPdf(itemPreviewPdf)" raised>
              Tải xuống
              <IconDownload class="!fb-text-white" color="currentColor" />
            </Button>
          </div>
        </template>
      </Dialog>
    </template>
  </TableView>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { INPUT_INVOICE_TABLE_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useInputInvoiceExport } from '@/composables/export/useInputInvoiceExport';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

const INVOICE_STATUS_LABEL = {
  '1': 'Hóa đơn mới',
  '2': 'Hóa đơn điều chỉnh',
  '3': 'Hóa đơn thay thế',
  '4': 'Hóa đơn đã bị thay thế',
  '5': 'Hóa đơn đã bị điều chỉnh',
  '6': 'Hóa đơn đã bị hủy',
};

const INVOICE_STATUS_SEVERITY = {
  '1': 'success',
  '2': 'info',
  '3': 'info',
  '4': 'secondary',
  '5': 'secondary',
  '6': 'danger',
};

const router = useRouter();
const { isLoadingExport, executeExport } = useInputInvoiceExport();

// Store/Getter
const invoiceStore = useEInoiveStore();
const filterStore = useFilterStore();
const globalStore = useGlobalStore();

const toast = useToast();

// State
const searchField = ref(null);
const showAdvancedFilter = ref(true);
const currentPage = ref(1);
const pageSize = ref(50);

const filterStatus = ref(null);
const filterStatusMST = ref(null);
const filterPattern = ref('');
const filterSerial = ref('');
const filterNo = ref('');

const statusOptions = ref([
  { label: 'Hóa đơn mới', value: '1' },
  { label: 'Hóa đơn điều chỉnh', value: '2' },
  { label: 'Hóa đơn thay thế', value: '3' },
  { label: 'Hóa đơn đã bị thay thế', value: '4' },
  { label: 'Hóa đơn đã bị điều chỉnh', value: '5' },
  { label: 'Hóa đơn đã bị hủy', value: '6' },
]);
const statusMSTOptions = ref([
  { label: 'NNT đang hoạt động', value: '1' },
  { label: 'Rủi ro vi phạm', value: '2' },
]);

const statusMap = computed(() => {
  return statusOptions.value.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});
});

const inputInvoiceList = computed(() => invoiceStore.inputInvoiceList); // data from api
const items = ref([]); // data display in table

const isLoading = ref(false);

const showEditNoteDialog = ref(false);
const editNoteValue = ref('');
const currentRowForNote = ref(null);
const isSavingNote = ref(false);
const isUpdatingStatus = ref(false);

const openEditNoteDialog = (row, currentNote) => {
  currentRowForNote.value = row;
  editNoteValue.value = currentNote || '';
  showEditNoteDialog.value = true;
};

const handleUpdateInvoice = async (payload, successMessage, shouldReload = true) => {
  try {
    isUpdatingStatus.value = true;
    const res = await invoiceStore.updateInputInvoice(payload);
    if (res?.error) throw res.error;

    toast.add({ severity: 'success', summary: successMessage, life: 3000 });

    if (shouldReload) await filter();
    return true;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: error?.message || '', life: 5000 });
    return false;
  } finally {
    isUpdatingStatus.value = false;
  }
};

const saveNote = async () => {
  isSavingNote.value = true;
  const payload = [
    {
      id: currentRowForNote.value.id,
      note: editNoteValue.value,
    },
  ];

  const success = await handleUpdateInvoice(payload, 'Lưu ghi chú thành công', false);

  if (success) {
    if (currentRowForNote.value) {
      currentRowForNote.value.note = editNoteValue.value;
    }
    showEditNoteDialog.value = false;
  }
  isSavingNote.value = false;
};

const updatePaymentStatus = async () => {
  if (!items.value || !items.value.length) return;
  const payload = items.value.map((item) => ({
    id: item.id,
    payment_status: item.checked || false,
  }));
  await handleUpdateInvoice(payload, 'Cập nhật thanh toán thành công');
};

const updateTaxDeclared = async () => {
  if (!items.value || !items.value.length) return;
  const payload = items.value.map((item) => ({
    id: item.id,
    tax_declared: item.checked || false,
  }));
  await handleUpdateInvoice(payload, 'Cập nhật kê khai thành công');
};

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    company_tax_code: invoiceStore?.currentTaxCode,
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: invoiceStore.listStoreUidInCurrentTaxCode.join(','),
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
    page: currentPage.value,
    page_size: pageSize.value,
  };

  if (searchField.value) payload.search = searchField.value;
  if (filterStatus.value) payload.invoice_status = filterStatus.value;
  if (filterStatusMST.value) payload.status_company_tax_code = filterStatusMST.value;
  if (filterPattern.value) payload.pattern = filterPattern.value;
  if (filterSerial.value) payload.serial = filterSerial.value;
  if (filterNo.value) payload.no = filterNo.value;

  isLoading.value = true;
  await invoiceStore.getInputInvoiceList(payload);
  items.value = (inputInvoiceList.value?.data?.data || []).map((item) => ({
    ...item,
    checked: false,
  }));
  isLoading.value = false;
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

const onAddNew = () => {
  toast.add({ severity: 'info', summary: 'Tính năng đang được phát triển', life: 3000 });
};

const onViewDetail = (row) => {
  toast.add({
    severity: 'info',
    summary: `Xem chi tiết hóa đơn: ${row.invoice_number}`,
    life: 3000,
  });
};

const handleExportExcel = async () => {
  await executeExport(
    {
      searchField: searchField.value,
      filterStatus: filterStatus.value,
      filterStatusMST: filterStatusMST.value,
      filterPattern: filterPattern.value,
      filterSerial: filterSerial.value,
      filterNo: filterNo.value,
    },
    statusMap.value,
  );
};

const showXmlDialog = ref(false);
const xmlContent = ref('');
const isFetchingXml = ref(false);
const currentXmlRowNo = ref(null);

const fetchAndCacheXML = async (row) => {
  if (row.xmlContent) return row.xmlContent;

  try {
    isFetchingXml.value = true;
    currentXmlRowNo.value = row.no;
    const payload = { invoice_id: row.no };
    const res = await invoiceService.getInputInvoiceXml(payload);
    const content = res?.data || res || '';

    row.xmlContent = content;
    return content;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Không thể lấy dữ liệu XML',
      life: 3000,
    });
    return null;
  } finally {
    isFetchingXml.value = false;
    currentXmlRowNo.value = null;
  }
};

const handleViewXml = async (row) => {
  const content = await fetchAndCacheXML(row);
  if (content) {
    xmlContent.value = content;
    showXmlDialog.value = true;
  }
};

const handleCopyXml = () => {
  if (!xmlContent.value) return;
  navigator.clipboard.writeText(xmlContent.value);
  toast.add({
    severity: 'success',
    summary: 'Thành công',
    detail: 'Đã copy nội dung XML',
    life: 3000,
  });
};

const handleDownloadXml = () => {
  if (!xmlContent.value) return;
  const blob = new Blob([xmlContent.value], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice_${new Date().getTime()}.xml`;
  a.click();
  URL.revokeObjectURL(url);
};

const showPdfDialog = ref(false);
const pdfUrl = ref(null);
const isFetchingPdf = ref(false);
const currentPdfRowNo = ref(null);
const itemPreviewPdf = ref(null);

const fetchAndCachePDF = async (row) => {
  if (row.pdfUrl) return row.pdfUrl;

  try {
    isFetchingPdf.value = true;
    currentPdfRowNo.value = row.no;
    const payload = { invoice_id: row.no };
    const responseData = await invoiceService.getInputInvoicePdf(payload);

    let blob;
    const dataContent = responseData?.data?.Data || responseData?.data || responseData;

    if (typeof dataContent === 'string' && dataContent.match(/^[A-Za-z0-9+/=]+$/)) {
      const byteCharacters = atob(dataContent);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      blob = new Blob([byteNumbers], { type: 'application/pdf' });
    } else {
      blob = new Blob([dataContent], { type: 'application/pdf' });
    }

    const url = URL.createObjectURL(blob);
    row.pdfUrl = url;
    return url;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Không thể lấy dữ liệu PDF',
      life: 3000,
    });
    return null;
  } finally {
    isFetchingPdf.value = false;
    currentPdfRowNo.value = null;
  }
};

const handleViewPdf = async (row) => {
  const url = await fetchAndCachePDF(row);
  if (url) {
    pdfUrl.value = url;
    itemPreviewPdf.value = row;
    showPdfDialog.value = true;
  }
};

const handleDownloadPdf = async (row) => {
  const url = await fetchAndCachePDF(row);
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${row.no || new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

// life cycle
onMounted(async () => {
  await getData();
});
</script>
