<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-6']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Quản lý hóa đơn</h4>
    </div>
  </div>
  <div :class="['fb-flex fb-flex-wrap fb-gap-3 fb-justify-between fb-items-center fb-mb-4']">
    <div class="fb-flex fb-flex-wrap fb-gap-3 fb-items-center">
      <Select
        v-model="statusField"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Chọn trạng thái"
        class="fb-w-full md:fb-w-48"
        showClear
        size="small"
        @change="filter"
      />

      <FbDateFilter @update:modelValue="filter" size="small" />
      <!-- <FbSelectCityStoreFilter
        :placeholder="$t('SELECT_CITIES_STORES_FILTER--INPUT_PLACEHOLDER_BLUR')"
        size="normal"
        @update:modelValue="filter"
      /> -->
      <!-- <FbSelectTaxStoreFilter
        placeholder="Chọn theo mã số thuế"
        size="small"
        @update:modelValue="filter"
      /> -->
      <FbSelectSingleStoreFilter
        placeholder="Chọn theo cửa hàng"
        size="small"
        @update:modelValue="filter"
      />
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
            class="fb-h-[1rem]"
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
          placeholder="Tìm kiếm mã hóa đơn"
          class="fb-w-full md:fb-w-72"
          size="small"
          @input="onSearchChange"
        />
      </IconField>
    </div>
  </div>

  <div class="!fb-p-0 invoice_manage--table">
    <FbTable
      v-model:selection="saleSelecteds"
      :columns="columns"
      :items="sales"
      enableScrollPagination
      :stripedRows="false"
      :isLoading="isLoading"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :totalRecords="vatInvoice.data?.num_results || 0"
      :totalPages="vatInvoice.data?.total_pages || 0"
      :loadingActionRowCustom="loadingActionRowCustom"
      keyLoading="tran_id"
      :menuItems="menuItems"
      :onToggleMenu="onToggleMenu"
      @page-change="getData"
    >
      <template #tran_info="{ row }">
        <div class="fb-text-sm">{{ `Ký hiệu: ${row?.inv_series}` }}</div>
        <div class="fb-text-sm fb-text-muted-color">
          Mã tra cứu:
          <span class="fb-text-primary">{{ row.tran_id }}</span>
        </div>
      </template>

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
        <div class="fb-flex fb-gap-1">
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
  </div>

  <Dialog
    v-model:visible="showPreview"
    header="Xem trước hóa đơn"
    modal
    :style="{ width: '70vw' }"
    :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
  >
    <!-- {{ previewUrl }}
    <iframe
      v-if="previewUrl"
      :src="previewUrl"
      class="fb-w-full fb-h-[75vh]"
      frameborder="0"
    ></iframe> -->
    <vue-pdf-embed v-if="previewUrl" :source="previewUrl" />
  </Dialog>

  <ModalExportVat v-model:visible="visibleExportVat" :saleData="currentSaleData" />
  <ModalViewBeforeSend v-model:visible="visibleViewBeforeSend" :invoiceData="dataViewBeforeSend" />
  <ConfirmDialog />
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';
import ModalViewBeforeSend from '@/components/PageComponent/e-invoice/ModalViewBeforeSend.vue';
import {
  VAT_PUBLISH_STATUS_COLOR,
  VAT_PUBLISH_STATUS_LIST
} from '@/common/constant/e-invoice.constant';
import { BILL_STATUS } from '@/common/constant/common.constant';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useRouter } from 'vue-router';

import IconDeleteDoc from '@/components/Common/Icon/IconDeleteDoc.vue';
import IconReplace from '@/components/Common/Icon/IconReplace.vue';
import IconEdit from '@/components/Common/Icon/IconEdit.vue';
import IconDownload from '@/components/Common/Icon/IconDownload.vue';
import IconEye from '@/components/Common/Icon/IconEye.vue';
import IconUpload from '@/components/Common/Icon/IconUpload.vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

// constants
const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const columns = [
  { field: 'tran_info', header: 'Thông tin hóa đơn' },
  { field: 'vat_publish_status', header: 'Trạng thái' },
  { field: 'vat_invoice_number', header: 'Số hóa đơn', classes: '!fb-text-muted-color' },
  { field: 'inv_buyerDisplayName', header: 'Người mua', classes: '!fb-text-muted-color' },
  { field: 'inv_buyerLegalName', header: 'Thông tin khách hàng' },
  {
    field: 'vat_invoice_date',
    header: 'Ngày hóa đơn',
    classes: '!fb-text-muted-color',
    format: 'date'
  },
  { field: 'total_amount', header: 'Tổng tiền', format: 'currency' },
  { field: 'invoice_type', header: 'Loại hóa đơn', classes: '!fb-text-muted-color' },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { padding: '0 0 0 0.25rem !important' }
  }
];

// State
const searchField = ref(null);
const statusField = ref(null);
const statusOptions = reactive(VAT_PUBLISH_STATUS_LIST);
const currentPage = ref(1);
const pageSize = 50;

const saleSelecteds = ref([]); // item selected in table
const vatInvoice = computed(() => invoiceStore.vatInvoice); // data from api
const sales = ref([]); // data display in table

const isLoading = ref(false);
const loadingPdfTranId = ref(null);
const loadingActionRowCustom = ref(null);

const pdfAction = ref(''); // 'preview' | 'download'
const showPreview = ref(false);
const previewUrl = ref(null);

const visibleExportVat = ref(false);
const currentSaleData = ref({});

const visibleViewBeforeSend = ref(false);
const dataViewBeforeSend = ref([]);

// Methods
const getData = async () => {
  if (!filterStore?.report?.store_uid) return;

  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: filterStore?.report?.store_uid,
    start_date: new Date(filterStore?.report?.start_date).getTime(),
    end_date: new Date(filterStore?.report?.end_date).getTime(),
    page: currentPage.value,
    results_per_page: pageSize,
    search: searchField.value,
    // vat_publish_status: statusField.value === '-1' ? '' : statusField.value
    status: statusField.value
  };

  isLoading.value = true;
  await invoiceStore.getVatInvoice(payload);
  sales.value = [...sales.value, ...(vatInvoice.value?.data?.data || [])];
  currentPage.value++;
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
    {
      label: 'Thay thế',
      icon: markRaw(IconReplace),
      visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 1,
      command: () => {
        const url =
          window.location.origin +
          `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
        // window.location.assign(url);
        window.open(url, '_self'); // mở tab mới
      }
    },
    // {
    //   label: 'Sửa hóa đơn',
    //   icon: markRaw(IconEdit),
    //   visible: row?.statusSale?.is_edit && [1, 2].includes(row?.statusSale?.edit_type),
    //   command: () => {
    //     const url =
    //       window.location.origin +
    //       `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
    //     // window.location.assign(url);
    //     window.open(url, '_self'); // mở tab mới
    //   }
    // },
    {
      label: 'Phát hành lại hóa đơn',
      visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 2,
      icon: markRaw(IconUpload),
      command: () => {
        const url =
          window.location.origin +
          `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
        // window.location.assign(url);
        window.open(url, '_self'); // mở tab mới
      }
    },
    {
      label: 'Sửa thông tin VAT',
      icon: markRaw(IconEdit),
      disabledd: row?.enable_vat_cms == 0,
      tooltipText: row?.enable_vat_cms == 0 ? $t('SALE_SYNC_VAT--DISABLE_VAT_NOTE') : null,
      command: () => {
        currentSaleData.value = {
          extra_sale: row?.extra_sale || null,
          sales: [row],
          is_immediate: false
        };
        visibleExportVat.value = true;
      }
    },

    {
      label: 'Xóa hóa đơn dự thảo',
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
    }
  ];
};

const isSaleExortedVat = (row) => {
  const { is_sync_vat, extra_sale = {} } = row;
  if (is_sync_vat === 0) return false;
  if (is_sync_vat === 3 && extra_sale?.partner_id === 'FABI') return false;
  return true;
};

const isAbleToDeleteBill = (row) => {
  return (
    row.state_action_bill !== BILL_STATUS.STATE_BILL_ACTION_DELETE
    //  &&
    // !this.rejectPermission.includes("REPORT.DELETE_SALE")
  );
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
  const url = await fetchAndCachePDF(item);
  if (url) {
    previewUrl.value = url;
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

// life cycle
onMounted(() => {
  getData();
});
</script>
