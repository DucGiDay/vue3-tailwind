<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-8']">
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
        @change="filter"
      />

      <FbDateFilter @update:modelValue="filter" />
      <!-- <FbSelectCityStoreFilter
        :placeholder="$t('SELECT_CITIES_STORES_FILTER--INPUT_PLACEHOLDER_BLUR')"
        size="normal"
        @update:modelValue="filter"
      /> -->
      <FbSelectTaxStoreFilter
        placeholder="Chọn theo mã số thuế"
        size="normal"
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
      :menuItems="menuItems"
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
            <IconEye class="!fb-text-primary" color="currentColor" />
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
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import {
  VAT_PUBLISH_STATUS_COLOR,
  VAT_PUBLISH_STATUS_LIST
} from '@/common/constant/e-invoice.constant';
import { useToast } from 'primevue';

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
const columns = [
  { field: 'tran_info', header: 'Thông tin hóa đơn' },
  { field: 'list_tran_no', header: 'Số hóa đơn', classes: '!fb-text-muted-color' },
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
  { field: 'vat_publish_status', header: 'Trạng thái' },
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

const saleSelecteds = ref([]);
const vatInvoice = computed(() => invoiceStore.vatInvoice);
const sales = ref([]);
const isLoading = ref(false);
const loadingTranId = ref(null);
const loadingPdfTranId = ref(null);
const pdfAction = ref(''); // 'preview' | 'download'
const showPreview = ref(false);
const previewUrl = ref(null);
const currentPage = ref(1);
const pageSize = 50;

// Methods
const getData = async () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: filterStore?.report?.stores_uid?.length
      ? filterStore?.report?.stores_uid.join(',')
      : (globalStore?.storesIdAccessibleInCurrentBrand || []).join(','),
    start_date: new Date(filterStore?.report?.start_date).getTime(),
    end_date: new Date(filterStore?.report?.end_date).getTime(),
    page: currentPage.value,
    results_per_page: pageSize,
    search: searchField.value,
    vat_publish_status: statusField.value === '-1' ? '' : statusField.value
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
    {
      label: 'Xuất VAT',
      icon: markRaw(IconDownload),
      command: () => {
        console.log(row);
      }
    },
    {
      label: 'Xóa hóa đơn dự thảo',
      icon: markRaw(IconDeleteDoc),
      class: 'fb-text-error',
      command: () => {
        console.log(row);
      }
    },
    {
      label: 'Thay thế',
      icon: markRaw(IconReplace),
      command: () => {
        console.log(row);
      }
    },
    {
      label: 'Sửa thông tin VAT',
      icon: markRaw(IconEdit),
      command: () => {
        console.log(row);
      }
    },
    {
      label: 'Tải XML',
      icon: markRaw(IconDownload),
      command: async () => {
        await exportXML(row);
      }
    },
    // {
    //   label: 'Xem trước PDF',
    //   icon: markRaw(IconEye),
    //   command: async () => {
    //     await onPreviewPDF(row);
    //   }
    // },
    {
      label: 'Tải PDF',
      icon: markRaw(IconDownload),
      command: async () => {
        await onDownloadPDF(row);
      }
    },
    // {
    //   label: 'Xem hóa đơn (Chi tiết)',
    //   icon: markRaw(IconEye),
    //   command: async () => {
    //     await onViewInvoice(row);
    //   }
    // },
    {
      label: 'Xem gửi CQT',
      icon: markRaw(IconEye),
      command: () => {
        console.log(row);
      }
    },
    {
      label: 'Phát hành lại hóa đơn',
      icon: markRaw(IconUpload),
      command: () => {
        console.log(row);
      }
    }
  ];
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

const onViewInvoice = async (row) => {
  try {
    loadingTranId.value = row.tran_id;
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      tran_id: row.tran_id,
      store_uid: row?.store_uid
    };
    const response = await invoiceService.viewInvoice(payload);
    console.log('View Invoice Result:', response?.data);

    let linkInvoice = null;
    const { access_token, link_image_invoice, partner_id, tax_code, url, file_content } =
      response?.data;
    if (link_image_invoice) {
      linkInvoice = link_image_invoice;
    } else if (file_content) {
      try {
        // 1. Chuyển base64 thành byte characters
        const byteCharacters = atob(file_content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // 2. Tạo Blob với định dạng PDF
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // 3. Tạo URL tạm thời từ Blob
        linkInvoice = URL.createObjectURL(blob);
      } catch (e) {
        console.error('Lỗi convert base64:', e);
      }
    } else if (url) {
      try {
        const headers = {
          Authorization: access_token,
          fabi_type: undefined,
          timezone: undefined,
          'x-client-timezone': undefined,
          access_token: undefined,
          ...(partner_id === 'MEINVOICE' ? { TaxCode: tax_code } : {})
        };
        const responseData = await invoiceService.getImageInvoice(url, {
          headers,
          responseType: 'blob'
        });
        linkInvoice = URL.createObjectURL(responseData);
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Lỗi tải hóa đơn',
          detail: error?.message,
          life: 3000
        });
      }
    }
    if (linkInvoice) {
      window.open(linkInvoice, '_blank');
    }
  } catch (error) {
    console.error('Error viewInvoice', error);
    toast.add({ severity: 'error', summary: error?.message, life: 3000 });
  } finally {
    loadingTranId.value = null;
  }
};

// life cycle
onMounted(() => {
  getData();
});
</script>

<style lang="scss">
// .invoice_manage--table {
//   th {
//     border-top-color: transparent !important;
//     border-radius: 0 !important;
//   }
// }
</style>
