<template>
  <TableView title="Quản lý hóa đơn">
    <template #header-actions>
      <ButtonExtendInvoice />
    </template>
    <template #toolbar>
      <div
        class="fb-flex fb-gap-2 fb-flex-wrap fb-bg-white fb-px-4 fb-py-3 fb-rounded-lg fb-border fb-border-surface-200"
      >
        <FbDateFilter module="invoice" @update:modelValue="filter" size="small" />

        <FbSelectTaxStoreFilter isSingleGroup @update:modelValue="filter" />

        <Button
          v-tooltip.bottom="'Lọc nâng cao'"
          :severity="showAdvancedFilter ? 'primary' : 'secondary'"
          outlined
          size="small"
          @click="showAdvancedFilter = !showAdvancedFilter"
        >
          <IconFilter color="currentColor" />
        </Button>
        <IconField class="fb-ml-auto">
          <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
            <IconSearch />
          </InputIcon>
          <InputText
            :modelValue="searchField"
            placeholder="Tìm kiếm mã hóa đơn"
            class="fb-w-full md:fb-w-72"
            size="small"
            @input="onSearchChange"
          />
        </IconField>
      </div>
      <transition name="filter-slide">
        <div v-show="showAdvancedFilter" class="fb-flex fb-flex-wrap fb-gap-4 fb-w-full fb-mt-3">
          <!-- Các bộ lọc khác -->
          <Select
            v-model="statusField"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Chọn trạng thái"
            class="fb-w-full md:fb-w-52"
            showClear
            size="small"
            @change="filter"
          />

          <InputText
            v-model="serialField"
            placeholder="Ký hiệu"
            class="fb-w-full md:fb-w-52"
            size="small"
            @input="onSearchChange"
          />
          <Select
            v-model="invoiceAction"
            :options="[
              { label: 'Hóa đơn gốc', value: 'origin' },
              { label: 'Hóa đơn điều chỉnh', value: 'adjust' },
              { label: 'Hóa đơn thay thế', value: 'replace' },
            ]"
            optionLabel="label"
            optionValue="value"
            placeholder="Loại hóa đơn"
            class="fb-w-full md:fb-w-52"
            showClear
            size="small"
            @change="filter"
          />
        </div>
      </transition>
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
        <template #header>
          <SelectButton
            v-model="invoiceType"
            :options="[
              { label: 'Danh sách hóa đơn', value: '1' },
              { label: 'Hóa đơn chờ xuất', value: '2,3' },
            ]"
            size="small"
            optionLabel="label"
            optionValue="value"
            :allowEmpty="false"
            @change="filter"
          />
        </template>
        <template #inv_buyerLegalName="{ record, row }">
          <div>{{ `Tên: ${record}` }}</div>
          <div class="fb-text-muted-color">{{ `Mã/MST: ${row?.info_customer}` }}</div>
        </template>
        <template #invoice_type="{ record, row }">
          <div>{{ record }}</div>
          <div v-if="row?.origin_tran_id" class="fb-text-primary">({{ row.origin_tran_id }})</div>
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
          {{
            vatInvoice?.error || (!storeUidByTaxCode ? 'Vui lòng chọn cửa hàng' : 'Chưa có hóa đơn')
          }}
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
      <ModalResendMail v-model:visible="showResendEmail" @send="onSendEmail" />
    </template>
  </TableView>
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { useRouter, useRoute } from 'vue-router';
import ModalExportVat from '@/components/PageComponent/e-invoice/ModalExportVat.vue';
import ModalViewBeforeSend from '@/components/PageComponent/e-invoice/ModalViewBeforeSend.vue';
import ModalResendMail from '@/components/PageComponent/e-invoice/ModalResendMail.vue';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import {
  VAT_PUBLISH_STATUS_COLOR,
  VAT_PUBLISH_STATUS_LIST,
} from '@/common/constant/e-invoice.constant';
import { INVOICE_MANAGE_TABLE_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ButtonExtendInvoice from '@/components/SharedComponent/ButtonExtendInvoice.vue';

import IconEdit from '@/components/Common/Icon/IconEdit.vue';
import IconReplace from '@/components/Common/Icon/IconReplace.vue';
import IconUpload from '@/components/Common/Icon/IconUpload.vue';
import IconDeleteDoc from '@/components/Common/Icon/IconDeleteDoc.vue';
import IconEye from '@/components/Common/Icon/IconEye.vue';
import IconDownload from '@/components/Common/Icon/IconDownload.vue';
import IconMail from '@/components/Common/Icon/IconMail.vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

// State
const showAdvancedFilter = ref(false);
const searchField = ref(null);
const statusField = ref(null);
const invoiceAction = ref(null);
const serialField = ref(null);
const invoiceType = ref('1');
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

const storeUidByTaxCode = computed(() => {
  const selectedObj = filterStore?.invoice?.store_uid_by_tax_code;
  if (!selectedObj || Object.keys(selectedObj).length === 0) {
    return invoiceStore.listStoreUidInCurrentTaxCode.join(',');
  }
  return Object.values(selectedObj).flat().filter(Boolean).join(',');
});

// Methods
const getData = async ({ page, rows } = {}) => {
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
    status: statusField.value,
    is_sync_vat: invoiceType.value,
    vat_invoice_serial: serialField.value,
    invoice_action: invoiceAction.value,
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
  return invoiceType.value === '1'
    ? [
        {
          label: 'Điều chỉnh tăng',
          icon: markRaw(IconEdit),
          visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 1,
          command: () => {
            const url =
              window.location.origin +
              `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}&adjustType=1`;
            window.open(url, '_self');
          },
        },
        {
          label: 'Điều chỉnh giảm',
          icon: markRaw(IconEdit),
          visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 1,
          command: () => {
            const url =
              window.location.origin +
              `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}&adjustType=2`;
            window.open(url, '_self');
          },
        },
        {
          label: 'Điều chỉnh thông tin',
          icon: markRaw(IconEdit),
          visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 1,
          command: () => {
            const url =
              window.location.origin +
              `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}&adjustType=3`;
            window.open(url, '_self');
          },
        },
        {
          label: 'Thay thế',
          icon: markRaw(IconReplace),
          visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 1,
          command: () => {
            const url =
              window.location.origin +
              `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
            window.open(url, '_self');
          },
        },
        {
          label: 'Phát hành lại hóa đơn',
          visible: row?.statusSale?.is_edit && row?.statusSale?.edit_type === 2,
          icon: markRaw(IconUpload),
          command: () => {
            const url =
              window.location.origin +
              `/sale/edit-sale?tranId=${row.tran_id}&storeUid=${row.store_uid}&editType=${row.statusSale?.edit_type}`;
            window.open(url, '_self');
          },
        },
        {
          label: 'Sửa thông tin VAT',
          icon: markRaw(IconEdit),
          notAllowClick: row?.enable_vat_cms == 0,
          tooltipText: row?.enable_vat_cms == 0 ? $t('SALE_SYNC_VAT--DISABLE_VAT_NOTE') : null,
          command: () => {
            currentSaleData.value = {
              extra_sale: row || null,
              sales: [row],
              is_immediate: false,
            };
            visibleExportVat.value = true;
          },
        },
        {
          label: 'Xóa hóa đơn dự thảo',
          visible: !row?.vat_invoice_number,
          icon: markRaw(IconDeleteDoc),
          class: 'fb-text-error',
          command: () => {
            onDeleteDraft(row);
          },
        },
        {
          label: 'Xem gửi CQT',
          visible: row?.partner_id === 'IPOSINVOICE' && !!row?.vat_invoice_number,
          icon: markRaw(IconEye),
          command: async () => {
            await onViewInvoice(row);
          },
        },
        {
          label: 'Tải XML',
          icon: markRaw(IconDownload),
          command: async () => {
            await exportXML(row);
          },
        },
        {
          label: 'Tải PDF',
          icon: markRaw(IconDownload),
          command: async () => {
            await onDownloadPDF(row);
          },
        },
        {
          label: 'Gửi lại email',
          icon: markRaw(IconMail),
          command: async () => {
            await openResendEmail(row);
          },
        },
      ]
    : [
        {
          label: 'Xuất VAT',
          icon: markRaw(IconDownload),
          command: () => {
            currentSaleData.value = {
              extra_sale: row || null,
              sales: [row],
              is_immediate: false,
              is_re_export_vat: true,
            };
            visibleExportVat.value = true;
          },
        },
        {
          label: 'Hủy xuất VAT',
          icon: markRaw(IconDeleteDoc),
          class: 'fb-text-error',
          command: () => {
            onCancelExportVat(row);
          },
        },
      ];
};

const onToggleMenu = async (_, row) => {
  // if (row?.statusSale) return;
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

const exportXML = async (item) => {
  try {
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      tran_id: item.tran_id,
      store_uid: item?.store_uid,
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
      store_uid: item?.store_uid,
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
      severity: 'danger',
    },
    rejectProps: {
      label: 'Hủy',
      severity: 'secondary',
      outlined: true,
    },
    accept: async () => {
      loadingActionRowCustom.value = row.tran_id;
      try {
        const payload = {
          merged_tran_id: row.tran_id,
        };
        await invoiceService.deleteDraftInvoice(payload);
        toast.add({ severity: 'success', summary: 'Xóa hóa đơn dự thảo thành công', life: 3000 });
        await filter();
      } catch (error) {
        console.error('Error deleteDraftInvoice', error);
        toast.add({
          severity: 'error',
          summary: error?.message || 'Xóa hóa đơn dự thảo thất bại',
          life: 3000,
        });
      } finally {
        loadingActionRowCustom.value = null;
      }
    },
  });
};

const onCancelExportVat = (row) => {
  confirm.require({
    message: 'Bạn có chắc chắn muốn hủy xuất VAT cho hóa đơn này?',
    header: 'Xác nhận hủy xuất VAT',
    acceptProps: {
      label: 'Xác nhận',
      severity: 'danger',
    },
    rejectProps: {
      label: 'Hủy',
      severity: 'secondary',
      outlined: true,
    },
    accept: async () => {
      loadingActionRowCustom.value = row.tran_id;
      try {
        const payload = {
          merged_tran_id: row.tran_id,
        };
        await invoiceService.deleteVatInvoice(payload);
        toast.add({ severity: 'success', summary: 'Hủy xuất VAT thành công', life: 3000 });
        await filter();
      } catch (error) {
        console.error('Error deleteVatInvoice', error);
        toast.add({
          severity: 'error',
          summary: error?.message || 'Hủy xuất VAT thất bại',
          life: 5000,
        });
      } finally {
        loadingActionRowCustom.value = null;
      }
    },
  });
};

const onViewInvoice = async (row) => {
  try {
    const payload = {
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      tran_id: row.tran_id,
      store_uid: row?.store_uid,
    };
    const response = await invoiceService.viewInvoice(payload);
    if (response?.data) {
      visibleViewBeforeSend.value = true;
      dataViewBeforeSend.value = {
        data: [response?.data],
        payload: payload,
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
      email: row?.email,
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

const onBuyInvoice = () => {
  window.location.assign(window.location.origin + '/extend-license/invoice-renewal-stores');
};

// life cycle
onMounted(() => {
  const queryType = route.query?.invoiceType;
  const validTypes = ['1', '2,3'];
  invoiceType.value = validTypes.includes(queryType) ? queryType : '1';
  getData();
});
</script>
