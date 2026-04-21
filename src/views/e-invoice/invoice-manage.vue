<template>
  <FbTableView
    title="Quản lý hóa đơn"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm mã hóa đơn"
    @search="onSearchChange"
  >
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
        v-model:selection="saleSelecteds"
        :columns="INVOICE_MANAGE_TABLE_COLUMNS"
        :items="sales"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="vatInvoice.data?.num_results || 0"
        :totalPages="vatInvoice.data?.total_pages || 0"
        :loadingActionRowCustom="loadingActionRowCustom"
        scrollHeight="flex"
        keyLoading="tran_id"
        :menuItems="menuItems"
        :onToggleMenu="onToggleMenu"
        @page-change="getData"
      >
        <template #inv_buyerLegalName="{ record, row }">
          <div>{{ `Tên: ${record}` }}</div>
          <div class="fb-text-muted-color">{{ `Mã/MST: ${row?.info_customer}` }}</div>
        </template>
        <template #invoice_type="{ record, row }">
          <div>{{ record }}</div>
          <div v-if="row?.tran_id" class="fb-text-primary">({{ row.tran_id }})</div>
        </template>

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
          {{ vatInvoice?.error ? 'Error: ' + vatInvoice?.error : 'Chưa có hóa đơn' }}
        </template>
      </FbTable>
    </template>

    <template #extra>
      <ModalExportVat v-model:visible="visibleExportVat" :saleData="currentSaleData" />
      <ModalViewBeforeSend
        v-model:visible="visibleViewBeforeSend"
        :invoiceData="dataViewBeforeSend"
      />
      <ConfirmDialog />
      <Dialog
        v-model:visible="showPreview"
        header="Xem trước hóa đơn"
        modal
        :style="{ width: '70vw' }"
        :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
      >
        <vue-pdf-embed v-if="previewUrl" :source="previewUrl" />
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

      <ModalResendMail v-model:visible="showResendEmail" @send="onSendEmail" />
    </template>
  </FbTableView>
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';
import ModalViewBeforeSend from '@/components/PageComponent/e-invoice/ModalViewBeforeSend.vue';
import ModalResendMail from '@/components/PageComponent/e-invoice/ModalResendMail.vue';
import FbTableView from '@/components/Common/FbTableView.vue';
import {
  VAT_PUBLISH_STATUS_COLOR,
  VAT_PUBLISH_STATUS_LIST,
  INVOICE_MANAGE_TABLE_COLUMNS
} from '@/common/constant/e-invoice.constant';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import IconDeleteDoc from '@/components/Common/Icon/IconDeleteDoc.vue';
import IconReplace from '@/components/Common/Icon/IconReplace.vue';
import IconEdit from '@/components/Common/Icon/IconEdit.vue';
import IconDownload from '@/components/Common/Icon/IconDownload.vue';
import IconEye from '@/components/Common/Icon/IconEye.vue';
import IconUpload from '@/components/Common/Icon/IconUpload.vue';
import IconMail from '@/components/Common/Icon/IconMail.vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

const toast = useToast();
const confirm = useConfirm();

// State
const searchField = ref(null);
const statusField = ref(null);
const statusOptions = reactive(VAT_PUBLISH_STATUS_LIST);
const currentPage = ref(1);
const pageSize = ref(50);

const saleSelecteds = ref([]); // item selected in table
const vatInvoice = computed(() => invoiceStore.vatInvoice); // data from api
const sales = ref([]); // data display in table

const isLoading = ref(false);
const loadingPdfTranId = ref(null);
const loadingActionRowCustom = ref(null);

const pdfAction = ref(''); // 'preview' | 'download'
const showPreview = ref(false);
const showResendEmail = ref(null);
const previewUrl = ref(null);
const itemPreview = ref(null);

const visibleExportVat = ref(false);
const currentSaleData = ref({});

const visibleViewBeforeSend = ref(false);
const dataViewBeforeSend = ref([]);

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
  await invoiceStore.getVatInvoice(payload);
  sales.value = vatInvoice.value?.data?.data || [];
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

const menuItems = (row) => {
  return [
    // {
    //   label: 'Xuất VAT',
    //   icon: markRaw(IconDownload),
    //   command: () => {
    //     console.log(row);
    //   }
    // },
    // {
    //   label: 'Sửa hóa đơn',
    //   icon: markRaw(IconEdit),
    //   visible: row?.statusSale?.is_edit && [1, 2].includes(row?.statusSale?.edit_type),
    //   command: () => {
    //     const url =
    //       window.location.origin +
    //       `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
    //     // window.location.assign(url);
    //     window.open(url, '_self');
    //   }
    // },
    {
      label: 'Thay thế',
      icon: markRaw(IconReplace),
      visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 1,
      command: () => {
        const url =
          window.location.origin +
          `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
        // window.location.assign(url);
        window.open(url, '_self');
      }
    },
    {
      label: 'Phát hành lại hóa đơn',
      visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 2,
      icon: markRaw(IconUpload),
      command: () => {
        const url =
          window.location.origin +
          `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
        // window.location.assign(url);
        window.open(url, '_self');
      }
    },
    {
      label: 'Sửa thông tin VAT',
      icon: markRaw(IconEdit),
      disabledd: row?.enable_vat_cms == 0,
      tooltipText: row?.enable_vat_cms == 0 ? $t('SALE_SYNC_VAT--DISABLE_VAT_NOTE') : null,
      command: () => {
        currentSaleData.value = {
          extra_sale: row || null,
          sales: [row],
          is_immediate: false
        };
        visibleExportVat.value = true;
      }
    },

    {
      label: 'Xóa hóa đơn dự thảo',
      visible: !row?.vat_invoice_number,
      icon: markRaw(IconDeleteDoc),
      class: 'fb-text-error',
      command: () => {
        onDeleteDraft(row);
      }
    },

    {
      label: 'Xem gửi CQT',
      visible: row?.partner_id === 'IPOSINVOICE' && !!row?.vat_invoice_number,
      icon: markRaw(IconEye),
      command: async () => {
        await onViewInvoice(row);
      }
    },
    {
      label: 'Tải XML',
      icon: markRaw(IconDownload),
      command: async () => {
        await exportXML(row);
      }
    },
    {
      label: 'Tải PDF',
      icon: markRaw(IconDownload),
      command: async () => {
        await onDownloadPDF(row);
      }
    },
    {
      label: 'Gửi lại email',
      icon: markRaw(IconMail),
      command: async () => {
        await openResendEmail(row);
      }
    }
  ];
};

const onToggleMenu = async (_, row) => {
  if (row?.statusSale) return;
  try {
    const response = await invoiceService.getStatus({ tran_id: row.tran_id });
    Object.assign(row, {
      statusSale: response?.data
    });
  } catch (error) {
    console.error('Error fetching status:', error);
  }
};

const exportXML = async (item) => {
  try {
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      tran_id: item.tran_id,
      store_uid: item?.store_uid
    };
    const responseData = await invoiceService.exportXML(payload);

    let xmlString = responseData.data;

    // Xóa dòng xml-stylesheet để tránh lỗi khi mở local
    xmlString = xmlString.replace(/<\?xml-stylesheet[\s\S]*?\?>/, '');

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    const soHoaDon = doc.querySelector('SHDon')?.textContent ?? 'invoice';
    const kyHieu = doc.querySelector('KHHDon')?.textContent ?? '';

    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `EInvoice_${kyHieu}_${soHoaDon}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    toast.add({ severity: 'error', summary: error?.message, life: 3000 });
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

const onDeleteDraft = (row) => {
  confirm.require({
    message: 'Bạn có chắc chắn muốn xóa hóa đơn dự thảo này?',
    header: 'Xác nhận xóa',
    acceptProps: {
      label: 'Xác nhận',
      severity: 'danger'
    },
    rejectProps: {
      label: 'Hủy',
      severity: 'secondary',
      outlined: true
    },
    accept: async () => {
      loadingActionRowCustom.value = row.tran_id;
      try {
        const payload = {
          merged_tran_id: row.tran_id
        };
        await invoiceService.deleteDraftInvoice(payload);
        toast.add({ severity: 'success', summary: 'Xóa hóa đơn dự thảo thành công', life: 3000 });
        await filter();
      } catch (error) {
        console.error('Error deleteDraftInvoice', error);
        toast.add({
          severity: 'error',
          summary: error?.message || 'Xóa hóa đơn dự thảo thất bại',
          life: 3000
        });
      } finally {
        loadingActionRowCustom.value = null;
      }
    }
  });
};

const onViewInvoice = async (row) => {
  try {
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      tran_id: row.tran_id,
      store_uid: row?.store_uid
    };
    const response = await invoiceService.viewInvoice(payload);
    if (response?.data) {
      visibleViewBeforeSend.value = true;
      dataViewBeforeSend.value = {
        data: [response?.data],
        payload: payload
      };
    } else throw new Error('Không tìm thấy dữ liệu hóa đơn');
  } catch (error) {
    console.error('Error viewInvoice', error);
    toast.add({ severity: 'error', summary: error?.message, life: 3000 });
  }
};

const openResendEmail = async (row) => {
  showResendEmail.value = row;
};

const onSendEmail = async (row) => {
  try {
    loadingActionRowCustom.value = row.tran_id;
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      merged_tran_id: row?.tran_id_sync_vat,
      store_uid: row?.store_uid,
      email: row?.email
    };
    if (row?.cc) {
      payload.cc = row?.cc;
    }
    const response = await invoiceService.sendEmail(payload);
    if (response?.data) {
      toast.add({ severity: 'success', summary: 'Gửi email thành công', life: 3000 });
    } else throw new Error('Không tìm thấy dữ liệu hóa đơn');
  } catch (error) {
    console.error('Error sendEmail', error);
    toast.add({ severity: 'error', summary: error?.message, life: 3000 });
  } finally {
    loadingActionRowCustom.value = null;
  }
};

// life cycle
onMounted(() => {
  getData();
});
</script>
